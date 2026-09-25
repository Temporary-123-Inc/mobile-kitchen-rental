import { describe, it, expect } from "vitest";
import { businessTopics, createGuide } from "../src/core";
import { temporaryGuide } from "../../../src/websiteGuide/config";
import site from "../../../site.json";

describe("direct website answers", () => {
  it.each(["what is your phone number", "how can I call Temporary123", "contact number"])("answers %s directly", (query) => {
    const reply = createGuide(temporaryGuide).respond(query);
    expect(reply.intentId).toBe("business-phone");
    expect(reply.text).toContain(site.phoneDisplay);
    expect(reply.actions[0].href).toBe(`tel:${site.phoneE164}`);
  });
  it.each([
    ["are you open on weekends", "business-hours", "24/7"],
    ["where do you deliver", "areas", "United States"],
    ["what utilities do kitchens need", "utilities", "wastewater"],
    ["what kitchen options do you have", "equipment-mobile-kitchens", "24ft"],
    ["how much do kitchens cost", "pricing", "not a final quote"],
    ["urgent kitchen availability", "availability", site.phoneDisplay],
    ["minimum rental duration", "duration", "confirmation"],
    ["can I rent several types together", "combined", "Yes"],
    ["email address", "email", "do not have a verified"],
  ])("answers %s", (query, id, text) => {
    const reply = createGuide(temporaryGuide).respond(query);
    expect(reply.intentId).toBe(id);
    expect(reply.text).toContain(text);
  });
  it("does not invent missing answers", () => {
    expect(createGuide(temporaryGuide).respond("insurance policy exclusions").text).toBe(temporaryGuide.fallback);
  });
  it("reuses public facts on an unrelated website without brand leakage", () => {
    const topics = businessTopics({ name: "Example Studio", phone: { display: "555-0100", href: "tel:5550100" }, email: "hello@example.com", hours: "Weekdays, 9–5" });
    const guide = createGuide({ siteId: "example", title: "Guide", greeting: "Hello", fallback: "Unknown", suggestions: ["business-phone"], topics });
    expect(guide.respond("phone").text).toBe("You can call Example Studio at 555-0100.");
    expect(guide.respond("email").actions[0].href).toBe("mailto:hello@example.com");
    expect(guide.respond("hours").text).toBe("Weekdays, 9–5");
    expect(guide.respond("address").text).toBe("Unknown");
    expect(JSON.stringify(topics)).not.toContain("Temporary123");
  });
  it("chooses a specific phrase over a general phrase at equal priority", () => {
    const guide = createGuide({ ...temporaryGuide, topics: [
      { id: "general", title: "General", phrases: ["number"], answer: "General" },
      { id: "specific", title: "Specific", phrases: ["phone number"], answer: "Specific" },
    ], suggestions: [] });
    expect(guide.respond("phone number").intentId).toBe("specific");
  });
});
