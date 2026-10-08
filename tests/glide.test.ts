import { afterEach, describe, expect, it, vi } from "vitest";
import { createGlidePayload, sendToGlide } from "../server/glide";
import { submitGlideContact } from "../server/glideContact";

const lead = {
  name: "Visitor name",
  email: "visitor@example.com",
  phone: "5551234567",
  message: "Visitor message with enough project detail.",
  service: "temporary-facilities" as const,
  duration: "under-1-month" as const,
  industry: "other" as const,
  location: "City, State",
  startDate: "2026-10-25",
  consent: true as const,
  website: "",
  page: "/contact/" as const,
};

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.GLIDE_WEBHOOK_URL;
  delete process.env.GLIDE_WEBHOOK_TOKEN;
});

describe("Glide contact delivery", () => {
  it("maps the Contact Us form to the required Glide payload", () => {
    expect(createGlidePayload(lead)).toEqual({
      data: {
        url: "https://mobile-kitchen-rental.com/contact-us/",
        name: "Visitor name",
        email: "visitor@example.com",
        phone: "5551234567",
        message: "Visitor message with enough project detail.",
        service: "temporary-facilities",
        duration: "under-1-month",
        industry: "other",
        location: "City, State",
        startDate: "2026-10-25",
        consent: true,
      },
    });
  });

  it("posts JSON with the server-only bearer token", async () => {
    process.env.GLIDE_WEBHOOK_URL = "https://glide.test/webhook";
    process.env.GLIDE_WEBHOOK_TOKEN =
      "synthetic-glide-token-for-tests-only";
    const fetchMock = vi.fn(async () =>
      new Response(null, {
        status: 200,
        headers: { "x-request-id": "glide-request" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const payload = createGlidePayload(lead);
    await expect(sendToGlide(payload, "inquiry-key")).resolves.toBe(
      "glide-request",
    );
    expect(fetchMock).toHaveBeenCalledWith("https://glide.test/webhook", {
      method: "POST",
      headers: {
        Authorization: "Bearer synthetic-glide-token-for-tests-only",
        "Content-Type": "application/json",
        "Idempotency-Key": "inquiry-key",
      },
      body: JSON.stringify(payload),
      signal: expect.any(AbortSignal),
    });
  });

  it("rejects non-success responses for retry", async () => {
    process.env.GLIDE_WEBHOOK_URL = "https://glide.test/webhook";
    process.env.GLIDE_WEBHOOK_TOKEN =
      "synthetic-glide-token-for-tests-only";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 401 })));
    await expect(sendToGlide(createGlidePayload(lead), "key")).rejects.toThrow(
      "Glide webhook failed (401)",
    );
  });

  it("accepts Contact Us without Firebase configuration", async () => {
    process.env.GLIDE_WEBHOOK_URL = "https://glide.test/webhook";
    process.env.GLIDE_WEBHOOK_TOKEN =
      "synthetic-glide-token-for-tests-only";
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await submitGlideContact({
      method: "POST",
      headers: {
        origin: "https://mobile-kitchen-rental.com",
        "content-type": "application/json",
        "idempotency-key": "8116e91d-8881-4475-8f1b-1e177f47ca01",
        "x-vercel-forwarded-for": "192.0.2.40",
      },
      body: JSON.stringify(lead),
    });
    expect(result).toEqual({ status: 201, body: { ok: true } });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects calculator submissions", async () => {
    await expect(
      submitGlideContact({
        method: "POST",
        headers: {
          origin: "https://mobile-kitchen-rental.com",
          "content-type": "application/json",
          "idempotency-key": "8116e91d-8881-4475-8f1b-1e177f47ca02",
          "x-vercel-forwarded-for": "192.0.2.41",
        },
        body: JSON.stringify({ ...lead, page: "/rental-calculator/" }),
      }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
