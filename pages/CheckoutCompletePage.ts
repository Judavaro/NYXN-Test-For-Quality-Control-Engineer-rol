import { expect, Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
