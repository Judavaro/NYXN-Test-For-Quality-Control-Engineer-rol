import { test } from '../fixtures/pages.fixture';
import { CHECKOUT_INFO, PRODUCT_NAME } from '../fixtures/test-data';

test.describe('Escenario crítico: compra exitosa', () => {
  test('al finalizar desde Checkout: Overview se muestra "Thank you for your order!"', async ({
    authenticatedInventory,
    cartPage,
    checkoutStepOnePage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await authenticatedInventory.addProductToCart(PRODUCT_NAME);
    await authenticatedInventory.goToCart();

    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInformationAndContinue(CHECKOUT_INFO);

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectProductInOrderSummary(PRODUCT_NAME);
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.expectOrderConfirmed();
  });
});
