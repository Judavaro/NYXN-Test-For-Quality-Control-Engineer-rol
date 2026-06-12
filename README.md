# SauceDemo — Automatización E2E con Playwright (POM)

Suite de pruebas E2E para [https://www.saucedemo.com/](https://www.saucedemo.com/) que cubre el flujo crítico de compra usando Playwright + TypeScript con el patrón **Page Object Model**.

## Escenarios cubiertos

| # | Test | Validación |
|---|------|------------|
| 1 | `01-login.spec.ts` | Login con `standard_user` / `secret_sauce` carga la página de inventario |
| 2 | `02-add-to-cart.spec.ts` | Agregar "Sauce Labs Backpack" muestra el badge del carrito en `1` |
| 3 | `03-checkout-overview.spec.ts` | El producto agregado aparece en el resumen de **Checkout: Overview** |
| 4 | `04-purchase-complete.spec.ts` | Al pulsar **Finish** en Overview, **Checkout: Complete!** muestra "Thank you for your order!" |

## Estructura (POM)

```
pages/
  LoginPage.ts             # Pantalla de login
  InventoryPage.ts         # Listado de productos + carrito
  CartPage.ts              # Carrito (Your Cart)
  CheckoutStepOnePage.ts   # Checkout: Your Information
  CheckoutOverviewPage.ts  # Checkout: Overview
  CheckoutCompletePage.ts  # Checkout: Complete!
fixtures/
  pages.fixture.ts         # Fixtures de page objects + login reutilizable (authenticatedInventory)
  test-data.ts             # Credenciales, producto y datos de checkout
tests/
  0X-*.spec.ts             # Escenarios (sin selectores directos; solo page objects)
playwright.config.ts       # baseURL, screenshot y trace on failure
```

Los selectores usan los atributos estables `data-test` que expone SauceDemo (p. ej. `[data-test="login-button"]`, `[data-test="finish"]`, `[data-test="complete-header"]`).

## Instalación

```bash
npm install
npx playwright install chromium
```

## Ejecución

```bash
npm test            # toda la suite (headless)
npm run test:headed # con navegador visible
npm run report      # abre el reporte HTML
```
