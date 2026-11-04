import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { Config } from './utils/config';

export const playwrightDefaults = {
  baseUrl: 'https://www.saucedemo.com/',
  browser: 'chromium',
  headless: true,
  timeoutMs: 30_000,
} as const;

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['step-definitions/*.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  // reporter: [
  //   ['list'],
  //   ['allure-playwright', { outputFolder: 'allure-results' }]
  // ],
  use: {
    baseURL: Config.baseUrl,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }
  ],
});
