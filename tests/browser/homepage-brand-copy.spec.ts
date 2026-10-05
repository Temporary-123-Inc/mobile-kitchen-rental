import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`Mobile Kitchen Rental homepage description at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const intro = page.locator('.rental-hero [data-h1-intro]');
    await expect(intro).toBeVisible();
    await expect(intro).toContainText('Mobile Kitchen Rental provides nationwide rental and leasing');
    await expect(intro).toContainText('equipment availability and dispatch timing require confirmation.');
    await expect(intro).not.toContainText('Temporary Kitchens 123');
    await expect(intro).not.toContainText('&#x20;');
    await expect(intro.locator('a')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Temporary Facilities and Trailer Rental');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://mobile-kitchen-rental.com/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
