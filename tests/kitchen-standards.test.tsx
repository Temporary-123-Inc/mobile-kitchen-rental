import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { Site } from "../src/Site";
import { statePageByPath } from "../src/StateDetail";
import { regionPages } from "../src/regionGuides";
import { reviewedCityPages } from "../src/cityDirectory";
import { locationKitchenFamilyImages } from "../src/LocationImageCarousel";
import { temporaryGuide } from "../src/websiteGuide/config";

const otherRental = /(?:dishwashing|refrigeration|shower|restroom|laundry|sleeper|bunk.?bed)\s+(?:trailer|rental|facilit)/i;

describe("adopted kitchen-site standards in rendered output", () => {
  const locations = [
    ...Object.entries(statePageByPath).map(([path, state]) => ({ path, state })),
    ...regionPages.map(({ path, state }) => ({ path, state })),
    ...reviewedCityPages.map(({ path, state }) => ({ path, state })),
  ];

  it("keeps every location lead state-first, kitchen-only, unique and 70–120 words", () => {
    const leads = new Set<string>();
    for (const { path, state } of locations) {
      const $ = load(renderToStaticMarkup(<Site path={path} />));
      const h1 = $("main h1");
      expect(h1.length, path).toBe(1);
      expect(h1.text().startsWith(state), path).toBe(true);
      expect(h1.text().length, path).toBeGreaterThanOrEqual(30);
      expect(h1.text(), path).toMatch(/kitchen.*(?:rent|lease)/i);
      expect(h1.text(), path).not.toMatch(otherRental);
      const lead = h1.next("p[data-h1-intro]");
      expect(lead.length, path).toBe(1);
      const text = lead.text().replace(/\s+/g, " ").trim();
      expect(text.split(" ").length, path).toBeGreaterThanOrEqual(70);
      expect(text.split(" ").length, path).toBeLessThanOrEqual(120);
      expect(text, path).toMatch(/request availability or a project-specific quote/);
      expect(leads.has(text), path).toBe(false);
      leads.add(text);
      const planning = $("[data-kitchen-rental-planning]");
      expect(planning.length, path).toBe(1);
      expect(planning.text(), path).toMatch(/not a weekly or monthly rate/);
      expect(planning.text(), path).toContain("24/7");
      expect(planning.text(), path).toContain("GPS tracking");
      expect(planning.find("[data-local-context]").text(), path).toContain("statewide routes such as");
      const names = planning.find("[data-nearby-kitchen-cities]").text().split("locations:")[1].split(". Confirm")[0].trim().split(", ");
      expect(names.length, path).toBeGreaterThanOrEqual(5);
      expect(names.length, path).toBeLessThanOrEqual(10);
    }
  }, 60000);

  it("offers only kitchen rentals in shared menus, forms, calculator and guide", () => {
    for (const path of ["/", "/equipment-rental/", "/services/", "/contact-us/", "/rental-calculator/"]) {
      const $ = load(renderToStaticMarkup(<Site path={path} />));
      expect($(".services-panel .service-category").length, path).toBe(1);
      expect($(".services-panel").text(), path).not.toMatch(otherRental);
      $("select[name='service'] option[value]:not([value='']):not([value='multiple'])").each((_, option) => {
        expect($(option).attr("value"), path).toBe("mobile-kitchens");
      });
      $("select[name='equipment'] option[value]:not([value=''])").each((_, option) => {
        expect($(option).attr("value"), path).toBe("mobile-kitchen");
      });
      if (path === "/") expect($(".equipment-card").length).toBe(5);
    }
    expect(temporaryGuide.topics.map((topic) => topic.answer).join(" ")).not.toMatch(otherRental);
  });

  it("uses five distinct actual kitchen photographs, including in location previews", () => {
    for (const key of ["Alabama", "Arctic, Alaska", "Seattle, Washington"]) {
      const images = locationKitchenFamilyImages(key);
      expect(images.length).toBe(5);
      expect(new Set(images.map((image) => image.sha256 || image.src)).size).toBe(5);
      for (const image of images) {
        expect(image.alt).toMatch(/kitchen|cooking|food|preparation|appliance|stove|oven|workstation|fryer|grill|equipment/i);
        expect(image.alt).not.toMatch(/dishwashing trailer|refrigerated trailer|shower|restroom/i);
      }
    }
  });
});
