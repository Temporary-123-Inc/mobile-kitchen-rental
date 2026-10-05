import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { TargetSite } from "../src/TargetSite";
import {
  allRoutes,
  brand,
  routeDescription,
  routeTitle,
  services,
  stateGuides,
} from "../src/targetData";

const dist = path.resolve("dist");
const templatePath = path.join(dist, "index.html");
const template = await readFile(templatePath, "utf8");

const esc = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

const routeDirectory = (route: string) =>
  route === "/" ? dist : path.join(dist, route.replace(/^\//, ""));
const renderHead = (route: string) => {
  const title = `${routeTitle(route)} | ${brand.name}`;
  const description = routeDescription(route);
  const canonical = new URL(route, brand.origin).href;
  const state = stateGuides.find((item) => item.path === route);
  const service = services.find(
    (item) => route === `/equipment-rental/${item.slug}/`,
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": state || service ? "Service" : "WebPage",
    name: routeTitle(route),
    description,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: brand.legalName,
      telephone: brand.phoneE164,
      url: brand.origin,
    },
    ...(state
      ? {
          areaServed: { "@type": "State", name: state.name },
          serviceType: "Mobile commercial kitchen trailer rental",
        }
      : {}),
    ...(service ? { serviceType: service.label } : {}),
  };
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="index,follow" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${brand.origin}/images/service-heroes/40ft-mobile-kitchen/03-960.webp" />`,
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
};

for (const route of allRoutes) {
  const directory = routeDirectory(route);
  await mkdir(directory, { recursive: true });
  const html = renderToStaticMarkup(<TargetSite path={route} />);
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="robots"[^>]*>/, "")
    .replace("<!--page-head-->", renderHead(route))
    .replace("<!--app-html-->", html);
  await writeFile(path.join(directory, "index.html"), page, "utf8");
}

const notFoundDirectory = path.join(dist, "404");
await mkdir(notFoundDirectory, { recursive: true });
const notFound = template
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta name="robots"[^>]*>/, "")
  .replace(
    "<!--page-head-->",
    `<title>Page not found | ${brand.name}</title><meta name="robots" content="noindex,nofollow" />`,
  )
  .replace(
    "<!--app-html-->",
    renderToStaticMarkup(<TargetSite path="/404/" />),
  );
await writeFile(path.join(notFoundDirectory, "index.html"), notFound, "utf8");
await writeFile(path.join(dist, "404.html"), notFound, "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes.map((route) => `  <url><loc>${new URL(route, brand.origin).href}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${brand.origin}/sitemap.xml\n`,
  "utf8",
);

await rm(path.join(dist, "sitemap-review.xml"), { force: true });
console.log(`Prerendered ${allRoutes.length} public routes plus 404.`);
