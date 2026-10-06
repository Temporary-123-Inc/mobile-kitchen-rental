import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`guide direct answers at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.getByRole('button', { name: 'Rental guide', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Rental guide' });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    const ask = async (question: string) => {
      await page.getByLabel('Ask about this website').fill(question);
      await page.getByRole('button', { name: 'Send', exact: true }).click();
    };
    await ask('What is your phone number?');
    await expect(page.getByRole('log')).toContainText('You can call Mobile Kitchen Rental at +1 (800) 443 - 5212.');
    await expect(page.getByRole('log').getByRole('link', { name: 'Call (888) 290-1839', exact: true })).toHaveAttribute('href', 'tel:+18882901839');
    await ask('Are you open on weekends?');
    await expect(page.getByRole('log')).toContainText('rental team is available 24/7');
    await expect(page.getByRole('log')).toContainText('dispatch timing require confirmation');
    await page.screenshot({ path: `test-results/guide-direct-${width}.png` });
    await ask('How much do showers cost?');
    await expect(page.getByRole('log')).toContainText('not a final quote');
    await ask('astronomy');
    await expect(page.getByRole('log')).toContainText("don't have a prepared answer");
    await page.getByRole('log').getByRole('link', { name: 'Contact the rental team', exact: true }).click();
    await expect(page.locator('#contact-drawer')).toBeVisible();
    await expect(page.locator('#quote-island')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
