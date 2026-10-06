import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { renderToString } from "react-dom/server";
import { load } from "cheerio";
import { Site, isLocationPagePath, type SourcePage } from "../src/Site";
import { routes } from "../src/content";
import { catalog } from "../src/EquipmentCatalog";
import { serviceCategories, serviceOptions } from "../src/serviceMenu";
import modelDetails from "../content/service-details.json";
import { regionPages } from "../src/regionGuides";
import { reviewedCityPages } from "../src/cityDirectory";
import { statePageByPath } from "../src/StateDetail";
import { legacyAuthorityPages } from "../src/LegacyAuthorityPage";
import introOverrides from "../content/aligned-page-introductions.json";
import replacedLeads from "../content/aligned-source-original-leads.json";
import media from "../content/media-map.json";
import site from "../site.json";
import vercel from "../vercel.json";
import { renderSourceContent } from "./source-content";
import { readableFragmentText } from "./prerender-text";

type SourceEntry = { path: string; file: string; title: string };

// Vite serves index.html directly in development. Supply the HTML that the
// production prerender normally inserts, before main.tsx binds its controls.
export async function renderDevPage(url: string, template: string) {
  const pathname = new URL(url, "http://localhost").pathname;
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const entries: SourceEntry[] = JSON.parse(
    await readFile(
      new URL("../content/route-index.json", import.meta.url),
      "utf8",
    ),
  );
  const redirects = new Map(
    vercel.redirects
      .filter((rule) => !("has" in rule) && !("missing" in rule))
      .map((rule) => [rule.source, rule.destination]),
  );
  const knownRoutes = new Set([
    ...routes,
    ...entries.map((entry) => entry.path),
    ...catalog.items.map((item) => item.path),
    ...serviceCategories.map((item) => item.href),
    ...serviceOptions.map((item) => item.href),
    ...Object.keys(modelDetails),
    ...regionPages.flatMap((region) => [region.path, `${region.path}cities/`]),
    ...reviewedCityPages.map((city) => city.path),
    ...Object.keys(statePageByPath),
    ...legacyAuthorityPages.map((page) => page.path),
  ]);
  const entry = entries.find((entry) => entry.path === path);
  let page: SourcePage | undefined;
  if (entry) {
    page = JSON.parse(
      gunzipSync(
        await readFile(
          new URL(`../content/pages/${entry.file}`, import.meta.url),
        ),
      ).toString(),
    ) as SourcePage;
    page.path = path;
    if (path === "/gsa-schedule/") page.title = "GSA Schedule";
    page.html = renderSourceContent(page.html, {
      origin: site.origin,
      routes: knownRoutes,
      redirects,
      media: media as Record<string, { local?: string }>,
      unresolved: new Set(),
      removeLeadParagraph: Boolean(
        introOverrides[path as keyof typeof introOverrides],
      ),
      replacedLead: replacedLeads[path as keyof typeof replacedLeads],
    });
  }
  const html = renderToString(
    <Site
      path={path}
      page={page}
      catalog={entries.filter(
        (entry) => !redirects.has(entry.path) && isLocationPagePath(entry.path),
      )}
      serviceCatalog={entries.filter(
        (entry) =>
          !redirects.has(entry.path) &&
          !isLocationPagePath(entry.path) &&
          !routes.includes(entry.path) &&
          !catalog.items.some((item) => item.path === entry.path),
      )}
    />,
  );
  const $ = load(html);
  const title = $("<title></title>")
    .text(
      `${readableFragmentText($("h1").first().html() || "")} | ${site.brand}`,
    )
    .toString();
  return template
    .replace(/<title>[\s\S]*?<\/title>/, title)
    .replace("<!--app-html-->", html);
}
