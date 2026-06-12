import { test } from '../fixtures/pages.fixture';
import { CHECKOUT_INFO, PRODUCT_NAME } from '../fixtures/test-data';

test.describe('Escenario crítico: checkout del carrito', () => {
  test('el producto agregado aparece en el resumen de Checkout: Overview', async ({
    authenticatedInventory,
    cartPage,
    checkoutStepOnePage,
    checkoutOverviewPage,
  }) => {
    await authenticatedInventory.addProductToCart(PRODUCT_NAME);
    await authenticatedInventory.goToCart();

    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(PRODUCT_NAME);
    await cartPage.checkout();

    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInformationAndContinue(CHECKOUT_INFO);

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectProductInOrderSummary(PRODUCT_NAME);
  });
});
