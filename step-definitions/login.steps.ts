import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/config';
import { CustomWorld } from '../hooks/hooks';

// Step definitions connect Gherkin wording to reusable page-object behavior.
Given('I navigate to the login page', async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: CustomWorld) {
  await this.loginPage.enterUsername(config.username);
  await this.loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async function (this: CustomWorld) {
  await this.loginPage.enterUsername('invalid_user');
  await this.loginPage.enterPassword('invalid_password');
});

When('I click the login button', async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: CustomWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see a login error message', async function (this: CustomWorld) {
  const errorMessage = await this.loginPage.getLoginErrorMessage();
  assert.match(errorMessage, /username and password do not match/i);
});
