import {
  After,
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  Status,
  World,
  type ITestCaseHookParameter,
} from '@cucumber/cucumber';
import {
  chromium,
  firefox,
  webkit,
  type Browser,
  type BrowserContext,
  type BrowserType,
  type Page,
} from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config, type BrowserName } from '../config/config';
import type { LoginPage } from '../pages/LoginPage';

// A Page is a single browser tab; the BrowserContext isolates scenario state.
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(config.timeoutMs);

const browserTypes: Record<BrowserName, BrowserType> = {
  chromium,
  firefox,
  webkit,
};

// Hooks manage browser setup and teardown for every independent scenario.
Before(async function (this: CustomWorld) {
  this.browser = await browserTypes[config.browser].launch({
    headless: config.headless,
  });
  this.context = await this.browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
});

After(async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter,
) {
  const cleanupErrors: Error[] = [];

  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      const screenshotDirectory = path.resolve(process.cwd(), 'screenshots');
      const safeScenarioName = scenario.pickle.name
        .replace(/[^a-z0-9-_]+/gi, '-')
        .replace(/^-|-$/g, '');
      const screenshotPath = path.join(
        screenshotDirectory,
        `${safeScenarioName}-${Date.now()}.png`,
      );

      await mkdir(screenshotDirectory, { recursive: true });
      await writeFile(screenshotPath, screenshot);
      await this.attach(screenshot, 'image/png');
    } catch (error) {
      cleanupErrors.push(
        new Error('Failed to capture or attach the failure screenshot', {
          cause: error,
        }),
      );
    }
  }

  for (const resource of [this.page, this.context, this.browser]) {
    if (!resource) continue;

    try {
      await resource.close();
    } catch (error) {
      cleanupErrors.push(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  if (cleanupErrors.length > 0) {
    throw new AggregateError(cleanupErrors, 'Scenario cleanup failed');
  }
});
