import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import details from "../content/service-details.json" with { type: "json" };
import { rentalProductHeadline } from "../src/rentalHeadlines";
import { ServiceDetail } from "../src/ServiceDetail";
import { imagesForServicePath } from "../src/serviceHeroImages";

describe("service-page four-tier H1 and hero imagery", () => {
  it("uses temporary + commercial + equipment/facility + rental in every H1", () => {
    for (const [path, item] of Object.entries(details)) {
      const headline = rentalProductHeadline(item.name);
      expect(headline, path).toMatch(/^Temporary Commercial .+ Rental$/);
      expect(headline.trim().split(/\s+/).length, path).toBeGreaterThanOrEqual(
        5,
      );
    }
  });

  it("renders an equipment gallery in every service-page hero", () => {
    for (const [path, item] of Object.entries(details)) {
      const images = imagesForServicePath(path);
      expect(images?.length ?? 0, `${path} image inventory`).toBeGreaterThan(0);
      const markup = renderToStaticMarkup(
        createElement(ServiceDetail, {
          path: path as keyof typeof details,
        }),
      );
      const $ = load(markup);
      expect($("h1").text(), `${path} H1`).toBe(
        rentalProductHeadline(item.name),
      );
      expect(
        $(".model-hero [data-service-carousel]").length,
        `${path} hero`,
      ).toBe(1);
      expect(
        $(".model-hero .service-hero-unverified").length,
        `${path} placeholder`,
      ).toBe(0);
    }
  });

  it("uses the exact mapped Drive collections where the spreadsheet supplies them", () => {
    const exactPaths = [
      "/services/mobile-kitchen-trailers/24ft/",
      "/services/mobile-kitchen-trailers/26ft-bulk/",
      "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      "/services/laundry-trailers/24ft/",
      "/services/shower-restroom-combination-trailers/8-stall-1-ada/",
    ];
    for (const path of exactPaths) {
      const images = imagesForServicePath(path) ?? [];
      expect(images.length, path).toBeGreaterThan(0);
      expect(
        images.every(
          (image) =>
            image.sourceUrl.includes("drive.google.com") ||
            image.src.startsWith("/media/equipment-drive/"),
        ),
        path,
      ).toBe(true);
    }
    expect(
      imagesForServicePath(
        "/services/mobile-sleeper-trailers/20ft-contractor/",
      )?.map((image) => image.reviewId),
    ).toEqual(["22.01", "22.04"]);
    expect(
      imagesForServicePath("/services/mobile-sleeper-trailers/20ft-vip/")?.map(
        (image) => image.reviewId,
      ),
    ).toEqual(["23.07"]);
  });
});
