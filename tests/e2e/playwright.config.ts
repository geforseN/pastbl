import { fileURLToPath } from "node:url";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "@playwright/test";
import { isCI } from "std-env";
import { endToEndTestsGlobs } from "./utils";

const options = isCI
  ? { host: process.env.PLAYWRIGHT_NUXT_HOST || "https://pastbl.vercel.app" }
  : { host: "http://127.0.0.1:3000" };

const rootDir = fileURLToPath(new URL("../..", import.meta.url));

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<ConfigOptions>({
  testDir: rootDir,
  outputDir: "playwright-results",
  testMatch: [...endToEndTestsGlobs],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 1 : undefined,
  globalTimeout: 5 * 60 * 1000,
  timeout: 45 * 1000,
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: "http://127.0.0.1:3000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    nuxt: {
      rootDir,
      ...options,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
