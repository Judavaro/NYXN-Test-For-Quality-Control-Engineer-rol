import { expect, Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  private readonly itemNames: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/checkout-step-two\.html/);
  }

  async expectProductInOrderSummary(productName: string): Promise<void> {
    await expect(this.itemNames.filter({ hasText: productName })).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
