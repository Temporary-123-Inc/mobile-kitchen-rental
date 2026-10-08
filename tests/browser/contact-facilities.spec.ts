import { expect, test } from "@playwright/test";

const requestedFacilities = [
  ["mobile-kitchens", "Mobile Kitchen Trailers"],
  ["multiple", "Help choosing a kitchen layout"],
] as const;

test("Contact Us offers the approved kitchen-only choices", async ({ page }) => {
  await page.goto("/contact-us/");
  await page.locator(".contact-rail").click();
  const drawer = page.locator("#contact-drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('button[type="submit"]')).toBeEnabled();
  const select = drawer.locator('select[name="service"]');
  await expect(select.locator("option")).toHaveCount(3);

  for (const [value, label] of requestedFacilities) {
    await expect(select.locator(`option[value="${value}"]`)).toHaveText(label);
    await select.selectOption(value);
    await expect(select).toHaveValue(value);
  }
});
