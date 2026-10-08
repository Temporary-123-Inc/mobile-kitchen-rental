import { createHmac } from "node:crypto";
import type { Database } from "firebase-admin/database";
import { firebase, required, requiredSecret } from "./firebase.js";
import { processDelivery } from "./delivery.js";
import site from "../site.json" with { type: "json" };
import { HttpError } from "./contact.js";
import type { Lead } from "./schema.js";
export const digest = (text: string) =>
  createHmac("sha256", requiredSecret("RATE_LIMIT_SECRET"))
    .update(text)
    .digest("hex");
export async function rateLimit(db: Database, ip: string, now = Date.now()) {
  const window = Math.floor(now / 900000),
    key = digest(ip);
  try {
    const result = await db
      .ref(`rateLimits/${window}`)
      .transaction((current) => {
        const value = current || {
          count: 0,
          ips: {},
          expiresAt: (window + 1) * 900000 + 86400000,
        };
        if (value.count >= 100 || (value.ips?.[key] || 0) >= 5) return;
        return {
          ...value,
          count: value.count + 1,
          ips: { ...value.ips, [key]: (value.ips?.[key] || 0) + 1 },
        };
      });
    if (!result.committed)
      throw new HttpError(
        429,
        "Too many inquiries. Please try again later.",
        Math.ceil(((window + 1) * 900000 - now) / 1000),
      );
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(
      503,
      "Inquiries are temporarily unavailable. Please retry later.",
    );
  }
}
export async function saveLead(db: Database, key: string, data: Lead) {
  const id = digest("inquiry:" + key),
    payloadHash = digest(JSON.stringify(data)),
    now = Date.now();
  const result = await db.ref("inquiries/" + id).transaction(
    (current) =>
      current || {
        data,
        payloadHash,
        createdAt: now,
        expiresAt: now + 90 * 86400000,
        status: data.page === "/contact/" ? "queued" : "saved",
      },
  );
  if (result.snapshot.val()?.payloadHash !== payloadHash)
    throw new HttpError(
      409,
      "This request identifier was already used. Refresh the form.",
    );
  return id;
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
  const response = await fetch(required("GLIDE_WEBHOOK_URL"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requiredSecret("GLIDE_WEBHOOK_TOKEN")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw Error(`Glide webhook failed (${response.status})`);
  return response.headers.get("x-request-id") || "accepted";
}
export async function deliverLead(id: string) {
  const { db } = firebase();
  return processDelivery(id, {
    db,
    createMessage: (record) => createGlidePayload(record.data as Lead),
    send: sendToGlide,
  });
}
export function dependencies() {
  const { db, appCheck } = firebase();
  return {
    enabled: process.env.CONTACT_ENABLED === "true",
    origins: required("ALLOWED_ORIGINS")
      .split(",")
      .map((s) => s.trim()),
    verify: async (token: string) => {
      const verified = await appCheck.verifyToken(token);
      if (verified.appId !== required("FIREBASE_APP_ID"))
        throw Error("Wrong application");
    },
    limit: (ip: string) => rateLimit(db, ip),
    save: (key: string, data: Lead) => saveLead(db, key, data),
    deliver: async (id: string) => {
      await deliverLead(id);
    },
  };
}
