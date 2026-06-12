import { expect, Locator, Page } from '@playwright/test';
import { CORPORATE_ORDERS_PAGE_URL } from '../fixtures/corporate-orders.mock';

export class CorporateOrdersPage {
  private readonly createOrderButton: Locator;
  private readonly orderSuccessMessage: Locator;
  private readonly nyxnServiceAlert: Locator;

  constructor(private readonly page: Page) {
    this.createOrderButton = page.locator('[data-test="create-corporate-order"]');
    this.orderSuccessMessage = page.locator('[data-test="order-success"]');
    this.nyxnServiceAlert = page.locator('[data-test="nyxn-service-alert"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(CORPORATE_ORDERS_PAGE_URL);
  }

  async createOrder(): Promise<void> {
    await this.createOrderButton.click();
  }

  /** aca simplemente validamos que la alerta de NYXN sea visible */
  async expectNyxnServiceAlert(): Promise<void> {
    await expect(this.nyxnServiceAlert).toBeVisible();
    await expect(this.nyxnServiceAlert).toContainText(
      'El servicio de órdenes corporativas no está disponible',
    );
    await expect(this.nyxnServiceAlert).toContainText('NYXN-503');
  }

  /** aca validamos que el mensaje de éxito no sea visible */
  async expectNoSuccessMessage(): Promise<void> {
    await expect(this.orderSuccessMessage).toBeHidden();
  }
}
