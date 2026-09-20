import { beforeEach, describe, expect, it, vi } from "vitest";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock("@vercel/analytics", () => ({ track }));

import { trackSavedConversion } from "../src/conversionAnalytics";

describe("saved conversion analytics", () => {
  beforeEach(() => {
    track.mockReset();
  });

  it("tracks a confirmed save only once per idempotency key", () => {
    expect(trackSavedConversion("Contact Form Submitted", "contact-key")).toBe(
      true,
    );
    expect(trackSavedConversion("Contact Form Submitted", "contact-key")).toBe(
      false,
    );

    expect(track).toHaveBeenCalledTimes(1);
    expect(track.mock.calls[0]).toEqual(["Contact Form Submitted"]);
  });

  it("keeps the two lead paths distinct without attaching properties", () => {
    expect(
      trackSavedConversion("Calculator Quote Submitted", "calculator-key"),
    ).toBe(true);

    expect(track.mock.calls[0]).toEqual(["Calculator Quote Submitted"]);
  });

  it("does not block a later retry when analytics throws", () => {
    track.mockImplementationOnce(() => {
      throw new Error("analytics unavailable");
    });

    expect(trackSavedConversion("Contact Form Submitted", "retry-key")).toBe(
      false,
    );
    expect(trackSavedConversion("Contact Form Submitted", "retry-key")).toBe(
      true,
    );
    expect(track).toHaveBeenCalledTimes(2);
  });
});
