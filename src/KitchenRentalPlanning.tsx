import { equipmentPrices, deliveryStartingPrice } from "./calculatorData";

export function KitchenRentalPlanning({ cities, localContext }: { cities: readonly string[]; localContext: string }) {
  const kitchen = equipmentPrices.find((item) => item.id === "mobile-kitchen")!;
  return (
    <div data-kitchen-rental-planning>
      <p>
        <strong>Starting estimates:</strong> equipment ${kitchen.startingPrice.toLocaleString("en-US")};
        20 ft delivery ${deliveryStartingPrice(20).toLocaleString("en-US")}. National planning figures,
        not a weekly or monthly rate. Confirm duration, delivery charges and your local quote.
        {" "}<a href="/rental-calculator/">Calculate a starting estimate</a>.
      </p>
      <p>
        <strong>Rental terms:</strong> request one-week, monthly, short-term or long-term options.
        Minimum periods and extensions require confirmation. The rental team is available 24/7.
      </p>
      <p>
        <strong>Delivery and setup:</strong> confirm arrival, installation time, stairs or ramp,
        utilities and removal. Ask about GPS tracking; availability is unconfirmed.
      </p>
      <p data-local-context>{localContext}</p>
      <p data-nearby-kitchen-cities>
        <strong>Nearby project locations:</strong> {Array.from(new Set(cities)).slice(0, 10).join(", ")}.
        Confirm the full delivery address.
      </p>
    </div>
  );
}
