/** url de la página de órdenes corporativas */
export const CORPORATE_ORDERS_PAGE_URL = '/corporate-orders';

/** url del endpoint de órdenes corporativas */
export const CORPORATE_ORDERS_API_PATTERN = '**/api/orders/corporate';

/** mensaje de error cuando el servicio no está disponible */
export const SERVICE_UNAVAILABLE_BODY = {
  code: 'NYXN-503',
  message: 'Corporate orders service unavailable',
};

/** HTML de la página de órdenes corporativas */
export const CORPORATE_ORDERS_PAGE_HTML = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>NYXN — Órdenes Corporativas</title>
  </head>
  <body>
    <h1>Órdenes Corporativas</h1>
    <button data-test="create-corporate-order">Crear orden corporativa</button>
    <div data-test="order-success" hidden>Orden corporativa creada.</div>
    <div data-test="nyxn-service-alert" role="alert" hidden>
      NYXN: El servicio de órdenes corporativas no está disponible en este momento.
      Por favor, inténtalo de nuevo más tarde. (NYXN-503)
    </div>
    <script>
      document
        .querySelector('[data-test="create-corporate-order"]')
        .addEventListener('click', async () => {
          const response = await fetch('/api/orders/corporate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [] }),
          });
          if (response.ok) {
            document.querySelector('[data-test="order-success"]').hidden = false;
          } else if (response.status === 503) {
            document.querySelector('[data-test="nyxn-service-alert"]').hidden = false;
          }
        });
    </script>
  </body>
</html>`;
