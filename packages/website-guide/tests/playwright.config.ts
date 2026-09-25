import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "widget.spec.ts",
  use: { baseURL: "http://127.0.0.1:4319", headless: true },
  reporter: "list",
  outputDir: "../test-results",
  webServer: {
    command: "node --import tsx packages/website-guide/tests/preview.tsx",
    cwd: "../../..",
    url: "http://127.0.0.1:4319",
    reuseExistingServer: false,
  },
});
