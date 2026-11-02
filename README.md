# Playwright + Cucumber BDD Framework

A beginner-friendly browser automation framework for SauceDemo. Cucumber runs
the Gherkin scenarios; Playwright provides the browser automation library. This
project does not use the Playwright Test runner.

## A. Project architecture

```text
features/                 Gherkin feature files and tagged scenarios
step-definitions/         Cucumber steps; connect behavior to page objects
pages/                    Page Object Model classes, selectors, and interactions
hooks/                    Scenario-scoped browser setup, screenshots, and cleanup
config/                   Environment settings and QA/UAT dotenv files
test-runner/              Optional programmatic entry point for Cucumber CLI
utils/                    Place for future shared test helpers
reports/                  Generated Cucumber HTML and JSON reports
screenshots/              PNG screenshots captured for failed scenarios
playwright.config.ts      Browser defaults used by this Cucumber framework
.cucumber.js              Cucumber feature discovery, TypeScript loading, formatters
```

`Browser` launches the browser process. A `BrowserContext` is an isolated
session with its own cookies and storage, and a `Page` represents one tab. A
fresh browser context and page are created for every scenario.

## B. Installation

From the project directory:

```bash
npm install
```

## C. Install Playwright browsers

Install the Chromium browser used by default:

```bash
npx playwright install chromium
```

To use another supported browser, install it as well:

```bash
npx playwright install firefox webkit
```

## D. Configure environments

The framework selects `config/.env.qa` by default. Choose UAT with
`TEST_ENV=uat`. Each environment file should define:

```dotenv
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
```

The included QA and UAT files use SauceDemo's supplied test account. For other
systems, replace the values and avoid committing private credentials. Process
environment variables override values in the selected dotenv file. Since
Windows reserves `USERNAME` for the signed-in account, use `TEST_USERNAME` to
override the configured username from the process environment. Optional
settings are `BROWSER=chromium|firefox|webkit`, `HEADLESS=true|false`, and
`TIMEOUT_MS=30000`.

PowerShell examples:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd

$env:TEST_ENV = "qa"
$env:BROWSER = "firefox"
npm run test:bdd
```

## E. Execute all BDD tests

```bash
npm run test:bdd
```

## F. Execute a specific feature

```bash
npx cucumber-js features/login.feature
```

The optional Cucumber runner accepts the same feature and tag arguments:

```bash
npm run test:bdd:runner -- features/login.feature
```

## G. Execute a specific scenario or tag

Run the smoke scenario:

```bash
npx cucumber-js --tags "@smoke"
```

Run the regression scenario:

```bash
npm run test:bdd:regression
```

Use the Cucumber expression or tag filter supported by `cucumber-js` to choose
other scenarios. The feature file's `@smoke` and `@regression` tags are metadata;
they do not require changes to the step definitions.

## H. Run in headed mode

```bash
npm run test:bdd:headed
```

Or set `HEADLESS=false` in the process environment for a custom command.

## I. Generate the HTML report

Every Cucumber run uses `.cucumber.js` to generate:

- `reports/cucumber-report.html` — readable feature/scenario/step results,
  execution durations, and failure details.
- `reports/cucumber-report.json` — machine-readable Cucumber results.

Run the HTML-report script explicitly with:

```bash
npm run test:bdd:html
```

The HTML formatter receives Cucumber attachments, including screenshots for
failed scenarios.

## J. Failure screenshots

When a scenario fails, the `After` hook takes a full-page PNG screenshot,
saves it under `screenshots/`, and attaches the image to the Cucumber scenario.
The report therefore retains the screenshot alongside the failure. Hooks close
the page, context, and browser even when screenshot or cleanup work encounters
an error; cleanup errors are surfaced rather than silently ignored.

## K. End-to-end execution flow

1. Cucumber reads a feature file and selects scenarios (including tag filters).
2. Cucumber matches each Gherkin step to a TypeScript step definition.
3. The step definition delegates UI work to `LoginPage`, the Page Object.
4. `LoginPage` uses Playwright's `Page` methods and locators.
5. Playwright drives a browser launched by the Cucumber `Before` hook.
6. The browser interacts with SauceDemo; assertions pass or fail the scenario.
7. Cucumber records step outcomes, duration, errors, and attached screenshots in
   the HTML and JSON reports.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```
