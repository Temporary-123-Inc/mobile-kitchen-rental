import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { currentContactHref, currentContactText } from "../src/contactNumber";
import { renderSourceContent } from "../scripts/source-content";
import { pageSchema } from "../scripts/structured-data";
import { pageInfo } from "../src/content";
import site from "../site.json" with { type: "json" };

describe("owner-approved contact number", () => {
  it("uses the requested display and international dial target", () => {
    expect(site.phoneDisplay).toBe("(888) 290-1839");
    expect(site.phoneE164).toBe("+18882901839");
    expect(pageInfo("/contact-us/").description).toContain(site.phoneDisplay);
  });

  it.each([
    "+1 (800) 443 - 5212",
    "800-443-5212",
    "+18004435212",
    "(833) 634-7811",
    "+18336347811",
    "1-800-205-6106",
    "+1 817 435 1558",
    "+1 800-550-0065",
  ])("normalizes the site's historical contact reference %s", (old) => {
    expect(currentContactText(`Call ${old} today.`)).toBe(
      `Call ${site.phoneDisplay} today.`,
    );
    expect(currentContactHref(`tel:${old}`)).toBe(`tel:${site.phoneE164}`);
  });

  it("preserves unrelated phone references, email and URLs", () => {
    expect(currentContactText("Call 911 or (555) 123-4567.")).toBe(
      "Call 911 or (555) 123-4567.",
    );
    expect(currentContactHref("tel:+15551234567")).toBe("tel:+15551234567");
    expect(currentContactHref("mailto:team@example.com")).toBe(
      "mailto:team@example.com",
    );
    expect(currentContactText("ID 9180044352129")).toBe("ID 9180044352129");
  });

  it("updates recovered visible text, accessible labels and dial links together", () => {
    const html = renderSourceContent(
      '<p>Sales: 1-800-205-6106</p><a href="tel:+18174351558" aria-label="Call +1 800 443 5212">+1 800 443 5212</a><a href="tel:+15551234567">Other contact</a>',
      {
        origin: site.origin,
        routes: new Set(),
        redirects: new Map(),
        media: {},
        unresolved: new Set(),
      },
    );
    const $ = load(html);
    expect($("p").text()).toBe(`Sales: ${site.phoneDisplay}`);
    expect($("a").first().attr("href")).toBe(`tel:${site.phoneE164}`);
    expect($("a").first().attr("aria-label")).toBe(`Call ${site.phoneDisplay}`);
    expect($("a").first().text()).toBe(site.phoneDisplay);
    expect($("a").last().attr("href")).toBe("tel:+15551234567");
  });

  it("publishes the same telephone in organization and contact-point schema", () => {
    const schema = pageSchema({
      path: "/contact-us/",
      title: "Contact",
      description: "Contact the rental team",
      crumbs: [],
    });
    const organization = schema["@graph"].find(
      (node) => node["@type"] === "Organization",
    )!;
    expect(organization.telephone).toBe(site.phoneE164);
    expect((organization.contactPoint as { telephone: string }).telephone).toBe(
      site.phoneE164,
    );
  });
});
