import { test } from '../fixtures/pages.fixture';
import { CREDENTIALS } from '../fixtures/test-data';

test.describe('Escenario crítico: autenticación', () => {
  test('el usuario estándar puede iniciar sesión y ver el inventario', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
    await inventoryPage.expectLoaded();
  });
});
