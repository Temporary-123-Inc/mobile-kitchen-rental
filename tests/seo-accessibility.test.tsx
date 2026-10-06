import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { Site, Header, Footer } from "../src/Site";
import { ServiceHeroCarousel } from "../src/ServiceHeroCarousel";
import { Cards } from "../src/Equipment";
import { stateGuides } from "../src/stateGuides";
import { stateRentalDescription } from "../src/seoMetadata";
import { serviceHeroImages } from "../src/serviceHeroImages";
import { EquipmentCatalog } from "../src/EquipmentCatalog";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim().toLowerCase();

describe("design-preserving SEO and accessibility", () => {
  it("keeps state names in distinct, concise descriptions without local inventory promises", () => {
    const descriptions = Object.keys(stateGuides).map((name) => {
      const description = stateRentalDescription(name);
      expect(description.startsWith(name)).toBe(true);
      expect(description.length).toBeLessThanOrEqual(170);
      expect(description).toContain("confirm availability");
      return description;
    });
    expect(new Set(descriptions).size).toBe(50);
  });

  it("lets branding and the project desk expose their complete visible labels", () => {
    const $ = load(renderToStaticMarkup(<Header path="/" />));
    for (const selector of [".brand", ".contact-rail"]) {
      expect($(selector).attr("aria-label")).toBeUndefined();
      expect($(selector).text().trim()).not.toBe("");
    }
    expect($(".contact-rail").parents('[role="complementary"]').length).toBe(1);
  });

  it("gives the closing call to action a named region", () => {
    const $ = load(renderToStaticMarkup(<Footer />));
    const id = $(".closing").attr("aria-labelledby");
    expect(id).toBeTruthy();
    expect($(`#${id}`).text().trim()).not.toBe("");
  });

  it("includes the displayed action in every catalog image link's accessible name", () => {
    const $ = load(renderToStaticMarkup(<EquipmentCatalog />));
    const links = $("a.catalog-media").toArray();
    expect(links.length).toBe(25);
    for (const link of links) {
      expect(normalize($(link).attr("aria-label") || "")).toContain(normalize($(link).text()));
      expect($(link).attr("aria-label")).toContain("opens in a new tab");
    }
  });

  it("keeps hidden carousel slides out of keyboard navigation before enhancement", () => {
    const images = Object.values(serviceHeroImages).find((images) => images.length > 1)!;
    expect(images.length).toBeGreaterThan(1);
    const $ = load(renderToStaticMarkup(<ServiceHeroCarousel images={images} label="Kitchen" />));
    expect($("[data-carousel-slide]:not([hidden])").length).toBe(1);
    expect($("[data-carousel-slide][hidden]").length).toBe(images.length - 1);
    $("[data-carousel-select]").each((_, button) => {
      expect(normalize($(button).attr("aria-label") || "")).toContain(normalize($(button).text()));
    });
  });

  it("exposes card headings at the page's level without altering their styled tags", () => {
    const $ = load(renderToStaticMarkup(<Cards />));
    expect($(".card-copy > h3[aria-level='2']").length).toBe(9);
    const homepage = load(renderToStaticMarkup(<Site path="/" />));
    expect(homepage(".card-copy > h3[aria-level='3']").length).toBe(9);
  });
});
