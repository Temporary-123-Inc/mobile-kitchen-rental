import site from "../site.json" with { type: "json" };
import type { Lead } from "./schema.js";

function setting(name: "GLIDE_WEBHOOK_URL" | "GLIDE_WEBHOOK_TOKEN") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server setting: ${name}`);
  if (name === "GLIDE_WEBHOOK_TOKEN" && Buffer.byteLength(value) < 32)
    throw new Error(`${name} must contain at least 32 bytes`);
  return value;
}

export function createGlidePayload(data: Lead) {
  return {
    data: {
      url: new URL("/contact-us/", site.origin).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      service: data.service,
      duration: data.duration,
      industry: data.industry,
      location: data.location,
      startDate: data.startDate,
      consent: data.consent,
    },
  };
}

export async function sendToGlide(payload: Record<string, unknown>, key: string) {
  const response = await fetch(setting("GLIDE_WEBHOOK_URL"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${setting("GLIDE_WEBHOOK_TOKEN")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw Error(`Glide webhook failed (${response.status})`);
  return response.headers.get("x-request-id") || "accepted";
}
