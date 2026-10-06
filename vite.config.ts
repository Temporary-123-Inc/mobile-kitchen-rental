import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const devPages = (): Plugin => ({
  name: "development-pages",
  apply: "serve",
  transformIndexHtml: {
    order: "pre",
    async handler(html, context) {
      if (!context.server) return html;
      const { renderDevPage } = await context.server.ssrLoadModule(
        "/scripts/dev-page.tsx",
      );
      return renderDevPage(context.originalUrl || context.path, html);
    },
  },
});

export default defineConfig({
  plugins: [devPages(), react(), tailwindcss()],
  build: {
    sourcemap: false,
    assetsInlineLimit(filePath) {
      // Small font subsets must remain same-origin files for font-src 'self'.
      if (/\.(?:woff2?|ttf|otf|eot)$/i.test(filePath)) return false;
      return undefined;
    },
  },
});
