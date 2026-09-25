import { describe, it, expect } from "vitest";
import { createGuide, safeHref, type GuideConfig } from "../src/core";
const config: GuideConfig = {
  siteId: "test",
  title: "Guide",
  greeting: "Hello",
  fallback: "No match",
  suggestions: ["showers"],
  topics: [
    {
      id: "showers",
      title: "Showers",
      phrases: ["shower", "showers"],
      answer: "Shower details",
      followUp: "quote",
    },
    {
      id: "laundry",
      title: "Laundry",
      phrases: ["laundry"],
      answer: "Laundry details",
    },
    {
      id: "pricing",
      title: "Pricing",
      phrases: ["cost", "how much"],
      priority: 100,
      answer: "Starting estimate only",
    },
    {
      id: "quote",
      title: "Quote",
      phrases: ["quote"],
      answer: "Contact the team",
    },
  ],
};
describe("portable guide", () => {
  it("prioritizes pricing over equipment", () =>
    expect(
      createGuide(config).respond("How much do showers cost?").intentId,
    ).toBe("pricing"));
  it("handles case and punctuation", () =>
    expect(createGuide(config).respond("SHOWERS!").intentId).toBe("showers"));
  it("does not match word fragments", () =>
    expect(createGuide(config).respond("showery").text).toBe("No match"));
  it("offers disambiguation for multiple equipment topics", () =>
    expect(
      createGuide(config).respond("showers and laundry").suggestions,
    ).toEqual(["showers", "laundry"]));
  it("follows conversational context", () => {
    const g = createGuide(config);
    g.respond("showers");
    expect(g.respond("yes").intentId).toBe("quote");
  });
  it("resets context", () => {
    const g = createGuide(config);
    g.respond("showers");
    g.reset();
    expect(g.respond("yes").text).toBe("No match");
  });
  it("isolates instances and copies configuration", () => {
    const c = structuredClone(config);
    const a = createGuide(c),
      b = createGuide(c);
    a.respond("showers");
    c.topics[0].answer = "Changed";
    expect(b.respond("yes").text).toBe("No match");
    expect(a.respond("showers").text).toBe("Shower details");
  });
  it("rejects duplicate IDs and unknown references", () => {
    expect(() =>
      createGuide({ ...config, topics: [config.topics[0], config.topics[0]] }),
    ).toThrow();
    expect(() =>
      createGuide({ ...config, suggestions: ["missing"] }),
    ).toThrow();
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.test",
    "\\\\evil.test",
    "java\nscript:alert(1)",
  ])("rejects unsafe URL %s", (href) => expect(safeHref(href)).toBe(false));
  it.each([
    "/contact/",
    "#services",
    "https://example.com",
    "tel:+18001234567",
    "mailto:hello@example.com",
  ])("accepts ordinary link %s", (href) => expect(safeHref(href)).toBe(true));
  it("rejects CSS injection", () =>
    expect(() =>
      createGuide({ ...config, accent: "red;}body{display:none" }),
    ).toThrow());
});
