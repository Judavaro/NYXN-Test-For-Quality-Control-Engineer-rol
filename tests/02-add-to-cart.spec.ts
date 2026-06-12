import { test } from '../fixtures/pages.fixture';
import { PRODUCT_NAME } from '../fixtures/test-data';

test.describe('Escenario crítico: agregar producto al carrito', () => {
  test('agregar un producto actualiza el contador del carrito', async ({
    authenticatedInventory,
  }) => {
    await authenticatedInventory.addProductToCart(PRODUCT_NAME);
    await authenticatedInventory.expectCartBadgeCount(1);
  });
});
