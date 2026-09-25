import { createServer as createHttpServer } from "node:http";
import { resolve, extname, sep } from "node:path";
import { readFile } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import React from "react";
import { Site } from "../../../src/Site";
import vercel from "../../../vercel.json";
// Read-only harness: compiled production assets + current Site, no dist/audit writes.
const build = resolve(".temp/website-guide-build");
const mime: Record<string, string> = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
const csp = vercel.headers
  .flatMap((h) => h.headers)
  .find((h) => h.key === "Content-Security-Policy")?.value;
createHttpServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  if (["/", "/contact-us/", "/rental-calculator/"].includes(path)) {
    try {
      const template = await readFile(resolve(build, "index.html"), "utf8");
      const html = template.replace(
        "<!--app-html-->",
        renderToString(<Site path={path} />),
      );
      res.setHeader("Content-Type", "text/html");
      if (csp) res.setHeader("Content-Security-Policy", csp);
      res.end(html);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(String(error));
    }
  } else {
    try {
      const isDemo = path.startsWith("/packages/website-guide/");
      const root = isDemo ? resolve("packages/website-guide") : build;
      const relative = isDemo
        ? path.slice("/packages/website-guide/".length)
        : path.slice(1);
      const file = resolve(root, decodeURIComponent(relative));
      if (!file.startsWith(root + sep)) {
        res.statusCode = 403;
        res.end();
        return;
      }
      const content = await readFile(file);
      res.setHeader(
        "Content-Type",
        mime[extname(file)] ?? "application/octet-stream",
      );
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.end("Not found");
    }
  }
}).listen(4319, "127.0.0.1", () =>
  console.log("Guide preview http://127.0.0.1:4319"),
);
