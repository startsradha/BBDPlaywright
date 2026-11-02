import { strict as assert } from 'node:assert';
import type { Page } from 'playwright';

// The Page Object Model keeps page selectors and UI interactions in one place.
export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly inventoryContainer;
  private readonly loginError;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.loginError = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.inventoryContainer.waitFor({ state: 'visible' });
    assert.match(this.page.url(), /\/inventory\.html$/);
  }

  async getLoginErrorMessage(): Promise<string> {
    await this.loginError.waitFor({ state: 'visible' });
    return (await this.loginError.textContent())?.trim() ?? '';
  }
}
