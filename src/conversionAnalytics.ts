import { track } from "@vercel/analytics";

export type SavedConversionEvent =
  | "Contact Form Submitted"
  | "Calculator Quote Submitted";

const trackedIdempotencyKeys = new Set<string>();

/**
 * Records a confirmed saved lead without sending any customer details.
 * The API idempotency key prevents a browser retry from counting twice.
 */
export function trackSavedConversion(
  event: SavedConversionEvent,
  idempotencyKey: string,
): boolean {
  if (!idempotencyKey || trackedIdempotencyKeys.has(idempotencyKey)) {
    return false;
  }

  trackedIdempotencyKeys.add(idempotencyKey);
  try {
    track(event);
    return true;
  } catch {
    trackedIdempotencyKeys.delete(idempotencyKey);
    return false;
  }
}
