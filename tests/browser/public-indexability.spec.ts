import { expect, test } from "@playwright/test";
import { load } from "cheerio";
import registry from "../../audit/build-registry.json" with { type: "json" };
import site from "../../site.json" with { type: "json" };

const publicPages = registry.pages.filter(
  (row) => row.path !== "/seo-dashboard/",
);

test("every existing public page is a direct indexable HTTP 200", async ({
  request,
}) => {
  test.setTimeout(180000);
  expect(registry.mode).toBe("production");
  expect(site.indexingScope).toBe("existing-public-pages");
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < publicPages.length) {
        const row = publicPages[cursor++];
        const response = await request.get(row.path, { maxRedirects: 0 });
        expect(response.status(), row.path).toBe(200);
        const $ = load(await response.text());
        expect($("meta[name='robots']").attr("content"), row.path).toBe(
          "index,follow",
        );
        expect($("link[rel='canonical']").attr("href"), row.path).toBe(
          site.origin + row.path,
        );
        expect($("h1").length, row.path).toBe(1);
        // Local and Vercel preview hosts deliberately retain their noindex header.
        if (new URL(response.url()).origin === site.origin)
          expect(
            response.headers()["x-robots-tag"] || "",
            row.path,
          ).not.toMatch(/noindex/i);
        await response.dispose();
      }
    }),
  );
});

const samples = [
  "/",
  "/contact-us/",
  "/rental-calculator/",
  "/equipment-rental/command-center-trailers/",
  "/houston-texas-mobile-kitchen-rental/",
  "/service-areas/california/",
  "/service-areas/arizona/phoenix-area/",
  "/service-areas/washington/olympic-peninsula/port-angeles/",
  "/service-areas/alabama/central-alabama/cities/",
  "/government/hospitals/",
  "/modular-kitchen-facilities/",
  "/video/",
];

for (const width of [1440, 390]) {
  test(`indexing survives browser enhancement at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      localStorage.setItem(
        "temporary123:emergency-dismissed-until-v1",
        String(Date.now() + 86400000),
      ),
    );
    for (const route of samples) {
      const response = await page.goto(route, { waitUntil: "load" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main h1"), route).toBeVisible();
      await expect(page.locator("meta[name=robots]"), route).toHaveAttribute(
        "content",
        "index,follow",
      );
      await expect(page.locator("link[rel=canonical]"), route).toHaveAttribute(
        "href",
        site.origin + route,
      );
    }
    expect(errors).toEqual([]);
  });
}

test("operational and missing pages keep their exclusions", async ({
  request,
}) => {
  const dashboard = await request.get("/seo-dashboard/", { maxRedirects: 0 });
  expect(dashboard.status()).toBe(200);
  const $ = load(await dashboard.text());
  expect($("meta[name=robots]").attr("content")).toBe("noindex,follow");
  expect($("link[rel=canonical]").length).toBe(0);
  const missing = await request.get(
    "/indexability-test-missing-page-20260922/",
    { maxRedirects: 0 },
  );
  expect(missing.status()).toBe(404);
  const error = load(await missing.text());
  expect(error("meta[name=robots]").attr("content")).toBe("noindex,nofollow");
});
