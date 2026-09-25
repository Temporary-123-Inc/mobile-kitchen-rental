import { defineConfig } from "@playwright/test";
if (!process.env.GUIDE_TEST_URL) throw new Error("Set GUIDE_TEST_URL to the deployment being verified");
export default defineConfig({
  testDir: ".",
  testMatch: "widget.spec.ts",
  grep: /Temporary123 guide/,
  use: { baseURL: process.env.GUIDE_TEST_URL, headless: true },
  reporter: "list",
  outputDir: "../test-results/deployed",
});
