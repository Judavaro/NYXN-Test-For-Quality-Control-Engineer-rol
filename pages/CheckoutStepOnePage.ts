import { expect, Locator, Page } from '@playwright/test';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export class CheckoutStepOnePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/checkout-step-one\.html/);
  }

  async fillInformationAndContinue(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.zipCode);
    await this.continueButton.click();
  }
}
