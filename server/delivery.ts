import { randomUUID } from "node:crypto";
import type { Database } from "firebase-admin/database";
export type DeliveryPayload = Record<string, unknown>;
export type DeliveryDeps = {
  db: Database;
  send: (message: DeliveryPayload, key: string) => Promise<string>;
  createMessage: (
    data: Record<string, unknown>,
    id: string,
  ) => DeliveryPayload;
  now?: () => number;
};
export async function processDelivery(
  id: string,
  { db, send, createMessage, now = Date.now }: DeliveryDeps,
) {
  const ref = db.ref("inquiries/" + id),
    leaseId = randomUUID();
  // null must be returned (not aborted) on an uncached first transaction pass.
  // The SDK retries against the actual server state before committing.
  const claim = await ref.transaction((current) => {
    if (!current) return null;
    if (current.status !== "queued" || current.leaseUntil > now()) return;
    if (now() - current.createdAt >= 23 * 3600000)
      return { ...current, status: "manual_review" };
    return {
      ...current,
      message: current.message || createMessage(current, id),
      leaseId,
      leaseUntil: now() + 60000,
    };
  });
  const value = claim.snapshot.val();
  if (
    !claim.committed ||
    value?.leaseId !== leaseId ||
    value.status !== "queued"
  )
    return false;
  try {
    const deliveryId = await send(value.message, `mobile-kitchen-rental/${id}`);
    await ref.transaction((current) =>
      !current
        ? null
        : current.leaseId === leaseId
          ? { ...current, status: "sent", deliveryId }
          : undefined,
    );
    return true;
  } catch {
    await ref.transaction((current) =>
      !current
        ? null
        : current.leaseId === leaseId && current.status === "queued"
          ? { ...current, leaseUntil: 0 }
          : undefined,
    );
    throw Error("Delivery failed; retained for retry");
  }
}
