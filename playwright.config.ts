// Defaults consumed by the Cucumber framework; Playwright Test is not used.
export const playwrightDefaults = {
  baseUrl: 'https://www.saucedemo.com/',
  browser: 'chromium',
  headless: true,
  timeoutMs: 30_000,
} as const;
