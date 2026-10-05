import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { CityDetail } from "../src/CityDetail";
import { reviewedCityPages } from "../src/cityDirectory";
import {
  locationKitchenFamilyImages,
  LocationImageCarousel,
} from "../src/LocationImageCarousel";
import { StateDetail } from "../src/StateDetail";
import { stateGuides } from "../src/stateGuides";

describe("state and city kitchen-family galleries", () => {
  it("uses an exact 80/20 five-image mix", () => {
    for (const location of [
      ...Object.keys(stateGuides),
      ...reviewedCityPages.map((city) => `${city.name}, ${city.state}`),
    ]) {
      const images = locationKitchenFamilyImages(location);
      expect(images, location).toHaveLength(5);
      expect(
        images.slice(0, 4).every((image) => /kitchen/i.test(image.alt)),
        location,
      ).toBe(true);
      expect(images[4].alt, location).toMatch(
        /dishwash|refrigerat|cold.storage/i,
      );
      expect(
        new Set(images.map((image) => image.sha256 || image.src)).size,
        location,
      ).toBe(5);
    }
  });

  it("renders verified galleries instead of photography placeholders", () => {
    const stateMarkup = renderToStaticMarkup(
      createElement(StateDetail, { name: "Alaska" }),
    );
    const city = reviewedCityPages[0];
    const cityMarkup = renderToStaticMarkup(
      createElement(CityDetail, { city }),
    );
    for (const [label, markup] of [
      ["Alaska", stateMarkup],
      [city.name, cityMarkup],
    ]) {
      const $ = load(markup);
      const gallery = $(
        "[data-gallery-presentation='location-kitchen-family-80-20']",
      );
      expect(gallery.length, label).toBe(1);
      expect(gallery.attr("data-kitchen-image-count"), label).toBe("4");
      expect(gallery.attr("data-kitchen-family-image-count"), label).toBe("1");
      expect(gallery.find("[data-carousel-slide]").length, label).toBe(5);
      expect(gallery.find("[data-verified-photo-pending]").length, label).toBe(
        0,
      );
    }
  });

  it("rotates image combinations between locations", () => {
    const combinations = ["Alaska", "California", "Texas", "New York"].map(
      (location) =>
        locationKitchenFamilyImages(location)
          .map((image) => image.src)
          .join("|"),
    );
    expect(new Set(combinations).size).toBeGreaterThan(1);
  });

  it("leaves non-location gallery behavior unchanged", () => {
    const markup = renderToStaticMarkup(
      createElement(LocationImageCarousel, {
        headline: "24 ft Mobile Kitchen Trailer",
      }),
    );
    const $ = load(markup);
    expect(
      $("[data-gallery-presentation='location-kitchen-family-80-20']").length,
    ).toBe(0);
    expect($("[data-location-gallery]").attr("data-equipment-family")).toBe(
      "mobile-kitchen",
    );
  });
});
