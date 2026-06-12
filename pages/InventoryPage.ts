import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  private readonly inventoryList: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  /**
   * El botón "Add to cart" de cada producto usa el data-test
   * "add-to-cart-<nombre-en-kebab-case>", p. ej. "add-to-cart-sauce-labs-backpack".
   */
  async addProductToCart(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
