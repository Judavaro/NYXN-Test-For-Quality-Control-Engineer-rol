import { test, expect } from '../fixtures/pages.fixture';
import {
  CORPORATE_ORDERS_API_PATTERN,
  CORPORATE_ORDERS_PAGE_HTML,
  CORPORATE_ORDERS_PAGE_URL,
  SERVICE_UNAVAILABLE_BODY,
} from '../fixtures/corporate-orders.mock';

test.describe('Reto 2: Mocking de red — órdenes corporativas', () => {
  test('validar el error 503 del endpoint de órdenes corporativas', async ({
    page,
    corporateOrdersPage,
  }) => {
    //Aca simulamos la pagina de corporate orders con un boton que simula una petición al servicio de corporte orders
    await page.route(`**${CORPORATE_ORDERS_PAGE_URL}`, (route) =>
      route.fulfill({ contentType: 'text/html', body: CORPORATE_ORDERS_PAGE_HTML }),
    );

    ///luego interceptamos la petición al endpoint de corporate orders y simulamos un error 503
    await page.route(CORPORATE_ORDERS_API_PATTERN, (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify(SERVICE_UNAVAILABLE_BODY),
      }),
    );

    await corporateOrdersPage.goto();

    // Se captura la respuesta para asertar que la petición realmente salió
    // de la UI y recibió el 503 simulado (no un falso positivo visual).
    const responsePromise = page.waitForResponse(CORPORATE_ORDERS_API_PATTERN);
    await corporateOrdersPage.createOrder();
    const response = await responsePromise;

    // validación técnica del response simulado
    expect(response.status()).toBe(503);

    // acá las validaciones visuales
    await corporateOrdersPage.expectNyxnServiceAlert();
    await corporateOrdersPage.expectNoSuccessMessage();
  });
});
