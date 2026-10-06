import { test, expect } from "@playwright/test";
import site from "../../../site.json" with { type: "json" };
test("plain HTML reuse, isolated styles, context, keyboard and safe rendering", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/packages/website-guide/demo/index.html");
  await page.getByRole("button", { name: "Studio guide", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Ask about this website").fill("phone number");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("log")).toContainText("You can call Northstar Studio at 555-0100.");
  await expect(page.getByRole("log")).not.toContainText("Temporary123");
  expect(
    await page
      .getByRole("button", { name: "Send", exact: true })
      .evaluate((n) => getComputedStyle(n).fontSize),
  ).toBe("15px");
  await page
    .getByRole("button", { name: "Design services", exact: true })
    .click();
  await page.getByLabel("Ask about this website").fill("yes");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("log")).toContainText("Demo hours:");
  await page
    .getByLabel("Ask about this website")
    .fill('<img src=x onerror="window.injected=true">');
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("log")).toContainText(
    "I do not have that answer",
  );
  expect(await page.evaluate(() => "injected" in window)).toBe(false);
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(page.getByRole("log")).not.toContainText("Demo hours:");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Studio guide", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});
for (const width of [320, 375, 768, 1440])
  test(`Temporary123 guide at ${width}px with host CSP`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    const launcher = page.getByRole("button", {
      name: "Rental guide",
      exact: true,
    });
    await launcher.click();
    const dialog = page.getByRole("dialog", { name: "Rental guide" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.getByLabel("Ask about this website").fill("What is your phone number?");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("log")).toContainText(`You can call ${site.brand} at ${site.phoneDisplay}.`);
    await expect(page.getByRole("log").getByRole("link", { name: "Call +1 (888) 563-6507", exact: true })).toHaveAttribute("href", "tel:+18885636507");
    await page.getByLabel("Ask about this website").fill("Are you open on weekends?");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("log")).toContainText("rental team is available 24/7");
    await page
      .getByLabel("Ask about this website")
      .fill("How much do showers cost?");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("log")).toContainText("not a final quote");
    await expect(
      page
        .getByRole("log")
        .getByRole("link", { name: "Open rental calculator" }),
    ).toHaveAttribute("href", "/rental-calculator/");
    await page.getByLabel("Ask about this website").fill("astronomy");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("log")).toContainText(
      "don't have a prepared answer",
    );
    await page.screenshot({
      path: `packages/website-guide/test-results/temporary-${width}.png`,
    });
    await page
      .getByRole("log")
      .getByRole("link", { name: "Contact the rental team", exact: true })
      .click();
    await expect(page.locator("#contact-drawer")).toBeVisible();
    await expect(page.locator("#quote-island")).toBeVisible();
    expect(errors).toEqual([]);
  });
test("multiple instances, bounded history, private telemetry and cleanup", async ({
  page,
}) => {
  await page.goto("/packages/website-guide/demo/index.html");
  const result = await page.evaluate(async () => {
    // Dynamic import path intentionally points to the built universal module.
    const { mountGuide } = await import(
      /* @vite-ignore */ "/packages/website-guide/dist/index.js"
    );
    const events: unknown[] = [];
    const config = {
      siteId: "second",
      title: "Second guide",
      greeting: "Second site",
      fallback: "No answer",
      suggestions: ["a"],
      topics: [
        { id: "a", title: "Topic A", phrases: ["alpha"], answer: "Answer A" },
      ],
    };
    const handle = mountGuide(document.body, config, {
      onEvent: (event: unknown) => events.push(event),
    });
    handle.open();
    const shadow = document.querySelectorAll("website-guide")[1].shadowRoot!;
    const input = shadow.querySelector("input")!;
    for (let i = 0; i < 25; i++) {
      input.value = "private text";
      shadow
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { cancelable: true }));
    }
    const bounded = shadow.querySelector('[role="log"]')!.children.length <= 41;
    input.value = "restart";
    shadow
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { cancelable: true }));
    const cleared = !shadow
      .querySelector('[role="log"]')!
      .textContent!.includes("private text");
    handle.destroy();
    handle.open();
    return {
      bounded,
      cleared,
      remaining: document.querySelectorAll("website-guide").length,
      events,
    };
  });
  expect(result.bounded).toBe(true);
  expect(result.cleared).toBe(true);
  expect(result.remaining).toBe(1);
  expect(JSON.stringify(result.events)).not.toContain("private text");
});
