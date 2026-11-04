import { strict as assert } from 'node:assert';
import { createBdd, test } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/config';

const { Given, Then, When } = createBdd(test);

// Step definitions connect Gherkin wording to reusable page-object behavior.
Given('I navigate to the login page', async ({ page }) => {
  await new LoginPage(page).navigateToLoginPage();
});

When('I enter valid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterUsername(config.username);
  await loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterUsername('invalid_user');
  await loginPage.enterPassword('invalid_password');
});

When('I click the login button', async ({ page }) => {
  await new LoginPage(page).clickLogin();
});

Then('I should be successfully logged in', async ({ page }) => {
  await new LoginPage(page).verifySuccessfulLogin();
});

Then('I should see a login error message', async ({ page }) => {
  const errorMessage = await new LoginPage(page).getLoginErrorMessage();
  assert.match(errorMessage, /username and password do not match/i);
});
