import { readFile } from "node:fs/promises";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { renderDevPage } from "../scripts/dev-page";

const template = await readFile(
  new URL("../index.html", import.meta.url),
  "utf8",
);

describe("development page rendering", () => {
  it("renders the homepage before browser enhancements execute", async () => {
    const html = await renderDevPage("/", template);
    const $ = load(html);
    expect($("#root h1")).toHaveLength(1);
    expect($("#root nav").length).toBeGreaterThan(0);
    expect($("title").text()).toContain("Rentals For Short-Term");
    expect($(".contact-rail")).toHaveLength(1);
    expect($('meta[name="robots"]').attr("content")).toBe("noindex,follow");
    expect($('script[src="/src/main.tsx"]')).toHaveLength(1);
    expect(html).not.toContain("<!--app-html-->");
  });

  it("renders a direct state URL without a trailing slash and with a query", async () => {
    const $ = load(
      await renderDevPage("/service-areas/washington?example=1", template),
    );
    expect($("h1")).toHaveLength(1);
    expect($("h1").text()).toMatch(/^Washington/);
    expect($("h1").text()).toContain("Kitchen");
    expect($("#root").text()).not.toContain("We couldn’t find this page");
  });

  it("loads archived page content for source routes", async () => {
    const $ = load(await renderDevPage("/gsa-schedule/", template));
    expect($("h1")).toHaveLength(1);
    expect($("h1").text()).toContain("GSA");
    expect($("#root").text()).not.toContain("We couldn’t find this page");
  });

  it("renders the missing-page content for unknown paths", async () => {
    const $ = load(await renderDevPage("/missing-development-page/", template));
    expect($("h1")).toHaveLength(1);
    expect($("#root").text()).toContain("We couldn’t find this page");
  });
});
