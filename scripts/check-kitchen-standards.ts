import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load } from "cheerio";
import { statePageByPath } from "../src/StateDetail";
import { regionPages } from "../src/regionGuides";
import { reviewedCityPages } from "../src/cityDirectory";

// Inspect finished HTML, including the paragraphs that will be indexed and
// inert dialogs/templates. This gate does not approve unverified business facts.
const root = resolve(process.argv[2] || "dist");
const locations = [
  ...Object.entries(statePageByPath).map(([path, state]) => ({ path, state })),
  ...regionPages.map(({ path, state }) => ({ path, state })),
  ...reviewedCityPages.map(({ path, state }) => ({ path, state })),
];
const problems: string[] = [];
const leads = new Set<string>();
for (const { path, state } of locations) {
  const $ = load(await readFile(resolve(root, `.${path}`, "index.html"), "utf8"));
  const h1 = $("main h1");
  const intro = h1.next("p[data-h1-intro]").text().replace(/\s+/g, " ").trim();
  const words = intro.split(/\s+/).length;
  const fail = (condition: boolean, message: string) => {
    if (!condition) problems.push(`${path}: ${message}`);
  };
  fail(h1.length === 1 && h1.text().startsWith(state) && h1.text().length >= 30, "state-first H1, minimum 30 characters");
  fail(/kitchen.*rent/i.test(h1.text()), "kitchen rental H1");
  fail(words >= 70 && words <= 120, `direct opening paragraph (${words} words)`);
  fail(/request availability or a project-specific quote/.test(intro), "closing availability/quote invitation");
  fail(!leads.has(intro), "distinct location introduction");
  leads.add(intro);
  const planning = $("[data-kitchen-rental-planning]");
  fail(planning.length === 1 && /24\/7/.test(planning.text()) && /GPS tracking/.test(planning.text()), "qualified rental planning facts");
  fail(planning.find("[data-local-context]").text().includes("statewide routes such as"), "local delivery route reference");
  const cities = planning.find("[data-nearby-kitchen-cities]").text().split("locations:")[1]?.split(". Confirm")[0].trim().split(", ") || [];
  fail(cities.length >= 5 && cities.length <= 10, "5–10 nearby project locations");
  fail(!/\b(?:dishwashing|refrigeration|shower|restroom|laundry|sleeper) (?:trailers?|rentals?|facilities)\b/i.test($("main").text()), "focused equipment promotions");
  const schema = $("script[type='application/ld+json']").toArray().flatMap((node) => JSON.parse($(node).text())["@graph"] || []);
  fail(schema.some((node) => node["@type"] === "Service" && node.serviceType === "Commercial mobile kitchen trailer rental"), "matching kitchen service schema");
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Kitchen standards: ${locations.length} rendered location pages passed. Pricing, delivery, GPS and setup remain subject to business confirmation.`);
}
