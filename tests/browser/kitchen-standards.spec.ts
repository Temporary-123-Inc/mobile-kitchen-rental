import { test, expect } from "@playwright/test";

const paths = ["/", "/service-areas/alabama/", "/service-areas/alaska/arctic/", "/service-areas/washington/puget-sound/seattle/", "/equipment-rental/mobile-kitchen-trailers/", "/rental-calculator/"];
for (const width of [375, 768, 1440]) {
  test(`kitchen pages retain working layouts and assets at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
      const hero = page.locator("main img:visible").first();
      if (await hero.count()) await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(page.locator("select[name='service'] option[value='dishwashing']")).toHaveCount(0);
      await expect(page.locator(".services-panel .service-category")).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
}

test("keyboard menu and all five circular previews preserve focus and galleries", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const inventory = page.locator(".services-trigger");
  await inventory.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".services-nav")).toHaveAttribute("open", "");
  await expect(page.locator(".services-panel .service-category")).toHaveCount(1);
  await inventory.click();
  const previews = page.locator("[data-open-dialog^='equipment-']");
  await expect(previews).toHaveCount(5);
  for (let index = 0; index < 5; index++) {
    const button = previews.nth(index);
    await button.scrollIntoViewIfNeeded();
    const offset = await button.evaluate((element) => {
      const rect = element.getBoundingClientRect(), icon = element.querySelector("svg")!.getBoundingClientRect();
      return Math.abs(rect.x + rect.width / 2 - icon.x - icon.width / 2) + Math.abs(rect.y + rect.height / 2 - icon.y - icon.height / 2);
    });
    expect(offset).toBeLessThan(1);
    await button.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator(`#equipment-${index}`);
    await expect(dialog).toBeVisible();
    const gallery = dialog.locator("[data-service-carousel]");
    await expect(gallery).toHaveCount(1);
    await gallery.locator("[data-carousel-next]").click();
    await expect(gallery.locator("[data-carousel-position]")).toHaveText("2");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(button).toBeFocused();
  }
});

test("calculator keeps the published kitchen estimate without sending an inquiry", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST" && request.url().includes("/api/")) posts.push(request.url()); });
  await page.goto("/rental-calculator/");
  const form = page.locator("#rental-calculator-form");
  await form.locator("select[name='state']").selectOption("Alabama");
  await form.locator("select[name='city']").selectOption({ index: 1 });
  await form.locator("select[name='equipment']").selectOption("mobile-kitchen");
  await expect(form.locator("select[name='equipment'] option[value]:not([value=''])")).toHaveCount(1);
  await form.locator("select[name='length']").selectOption("25");
  await form.locator("input[name='startDate']").fill("2026-11-01");
  await form.locator("input[name='endDate']").fill("2026-11-08");
  await form.locator("[data-calculator-calculate]").click();
  await expect(page.locator("[data-estimate-total]")).toHaveText("$6,490");
  expect(posts).toEqual([]);
});

test("styled location content and navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const page = await context.newPage();
  await page.goto("/service-areas/alabama/");
  await expect(page.locator("main h1")).toContainText("Kitchen");
  await expect(page.locator("[data-kitchen-rental-planning]")).toContainText("24/7");
  expect(await page.locator("main h1").evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThan(24);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await context.close();
});
