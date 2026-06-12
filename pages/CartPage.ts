import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  private readonly cartItems: Locator;
  private readonly itemNames: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/cart\.html/);
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.itemNames.filter({ hasText: productName })).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
