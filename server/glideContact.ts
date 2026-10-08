import { isIP } from "node:net";
import { z } from "zod";
import site from "../site.json" with { type: "json" };
import { HttpError } from "./contact.js";
import { leadSchema } from "./schema.js";
import { createGlidePayload, sendToGlide } from "./store.js";

const attempts = new Map<string, { count: number; expiresAt: number }>();
const allowedOrigins = new Set([
  site.origin,
  site.origin.replace("https://", "https://www."),
]);

function limit(ip: string, now = Date.now()) {
  const current = attempts.get(ip);
  if (!current || current.expiresAt <= now) {
    attempts.set(ip, { count: 1, expiresAt: now + 15 * 60_000 });
    return;
  }
  if (current.count >= 5)
    throw new HttpError(
      429,
      "Too many inquiries. Please try again later.",
      Math.ceil((current.expiresAt - now) / 1000),
    );
  current.count++;
}

export async function submitGlideContact(request: {
  method?: string;
  headers: Record<string, string | undefined>;
  body: string;
}) {
  if (request.method !== "POST") throw new HttpError(405, "Use POST.");
  if (!request.headers.origin || !allowedOrigins.has(request.headers.origin))
    throw new HttpError(403, "Request origin is not allowed.");
  if (
    request.headers["content-type"]?.split(";")[0].trim() !== "application/json"
  )
    throw new HttpError(415, "Use application/json.");
  if (Buffer.byteLength(request.body) > 8192)
    throw new HttpError(413, "Inquiry is too large.");

  let json: unknown;
  try {
    json = JSON.parse(request.body);
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success || parsed.data.page !== "/contact/")
    throw new HttpError(400, "Check the form fields and try again.");

  const key = request.headers["idempotency-key"];
  if (!z.uuid().safeParse(key).success)
    throw new HttpError(400, "Invalid request identifier.");
  const ip = request.headers["x-vercel-forwarded-for"];
  if (!ip || !isIP(ip))
    throw new HttpError(503, "Unable to verify the request network.");
  limit(ip);

  await sendToGlide(createGlidePayload(parsed.data), key!);
  return { status: 201, body: { ok: true } };
}
