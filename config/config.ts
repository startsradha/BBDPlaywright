import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { playwrightDefaults } from '../playwright.config';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

const selectedEnvironment = process.env.TEST_ENV ?? 'qa';
if (!['qa', 'uat'].includes(selectedEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${selectedEnvironment}". Choose "qa" or "uat".`,
  );
}

const environmentFile = path.resolve(
  process.cwd(),
  'config',
  `.env.${selectedEnvironment}`,
);
if (!existsSync(environmentFile)) {
  throw new Error(`Environment file not found: ${environmentFile}`);
}

const dotenvResult = dotenv.config({ path: environmentFile, override: false });
if (dotenvResult.error) {
  throw new Error(`Unable to load ${environmentFile}`, {
    cause: dotenvResult.error,
  });
}

function readBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`Expected "true" or "false", received "${value}".`);
}

function readBrowser(value: string | undefined): BrowserName {
  const browser = value ?? playwrightDefaults.browser;
  if (browser === 'chromium' || browser === 'firefox' || browser === 'webkit') {
    return browser;
  }
  throw new Error(
    `Unsupported BROWSER "${browser}". Choose chromium, firefox, or webkit.`,
  );
}

function readPositiveNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(`Expected a positive number, received "${value}".`);
  }
  return parsedValue;
}

function requiredEnvironmentValue(name: 'BASE_URL' | 'USERNAME' | 'PASSWORD') {
  // Windows reserves USERNAME for the signed-in account; prefer the dotenv
  // value unless an explicit TEST_USERNAME override was provided.
  const value =
    name === 'USERNAME'
      ? process.env.TEST_USERNAME ?? dotenvResult.parsed?.USERNAME ?? process.env.USERNAME
      : process.env[name];
  if (!value) {
    throw new Error(`${name} must be set in ${environmentFile} or the process environment.`);
  }
  return value;
}

export const config = {
  environment: selectedEnvironment,
  baseUrl: requiredEnvironmentValue('BASE_URL'),
  username: requiredEnvironmentValue('USERNAME'),
  password: requiredEnvironmentValue('PASSWORD'),
  browser: readBrowser(process.env.BROWSER),
  headless: readBoolean(process.env.HEADLESS, playwrightDefaults.headless),
  timeoutMs: readPositiveNumber(
    process.env.TIMEOUT_MS,
    playwrightDefaults.timeoutMs,
  ),
};
