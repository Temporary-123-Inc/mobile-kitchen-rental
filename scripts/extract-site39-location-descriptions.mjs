import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [sourceArgument, outputArgument = "src/locationDescriptions.json"] =
  process.argv.slice(2);

if (!sourceArgument) {
  throw new Error(
    "Usage: node scripts/extract-site39-location-descriptions.mjs <site-39.json> [output]",
  );
}

const sourcePath = path.resolve(sourceArgument);
const outputPath = path.resolve(outputArgument);
const source = JSON.parse(await readFile(sourcePath, "utf8"));

const statePages = source.location_data?.state_pages;
const cityPages = source.service_area_data;

if (!Array.isArray(statePages) || !Array.isArray(cityPages)) {
  throw new Error("The source JSON is missing state or city location records.");
}

const states = Object.fromEntries(
  statePages.map((page) => {
    if (!page.state || !page.description) {
      throw new Error("A state record is missing its state or description.");
    }
    return [page.state, page.description];
  }),
);

const cities = Object.fromEntries(
  cityPages.map((page) => {
    const city = page.representative_city;
    const state = page.state;
    const description = page.page_layout_data?.description;
    if (!city || !state || !description) {
      throw new Error("A city record is missing its location or description.");
    }
    return [`${city}, ${state}`, description];
  }),
);

const descriptions = [...Object.values(states), ...Object.values(cities)];
const placeholders = descriptions.filter((description) =>
  /\[[^\]]+\]/.test(description),
);

if (Object.keys(states).length !== 50 || Object.keys(cities).length !== 246) {
  throw new Error(
    `Unexpected location counts: ${Object.keys(states).length} states and ${Object.keys(cities).length} cities.`,
  );
}

if (placeholders.length) {
  throw new Error(
    "Bracketed placeholders remain in the location descriptions.",
  );
}

await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      sourceSiteId: source.site_id,
      states,
      cities,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(
  `Extracted ${Object.keys(states).length} state and ${Object.keys(cities).length} city descriptions from site ${source.site_id}.`,
);
