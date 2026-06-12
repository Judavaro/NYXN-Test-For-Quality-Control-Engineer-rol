# NYXN — Prueba Técnica 24 Horas (Express) · Quality Control Engineer

Solución a la [prueba técnica de NYXN](<Prueba_Tecnica_24_Horas_QC_NYXN_2026%20(1).docx.pdf>) para el rol **Quality Control Engineer (Semi-Senior)**.

- **Respuestas escritas** (bloques teórico, MCP y performance): [`Respuestas.md`](Respuestas.md)
- **Código** (automatización UI + API): este repositorio — Playwright + TypeScript (POM) y Jest + Ajv.

## Mapa de la entrega

| Bloque de la prueba | Solución | Dónde está |
|---|---|---|
| 2. Bloque Teórico y Calidad Ágil | Early Testing, DoR/DoD | [`Respuestas.md`](Respuestas.md) §2 |
| 3A. UI — Suite base (POM) | 4 escenarios críticos del flujo de compra | `tests/01-04*.spec.ts`, `pages/`, `fixtures/` |
| 3A. **Reto 1**: Optimización de Sesión | Storage State reutilizable, sin login gráfico por archivo | `tests/auth.setup.ts`, `playwright.config.ts` |
| 3A. **Reto 2**: Mocking de Red | Intercepción 503 + alerta controlada NYXN | `tests/05-corporate-orders-503.spec.ts`, `fixtures/corporate-orders.mock.ts`, `pages/CorporateOrdersPage.ts` |
| 3B. API & Data Testing Express | Jest: POST /api/v1/orders → 201 + esquema JSON; query nativa a BD | `api/orders.api.test.ts`, `api/verify-order.sql` |
| 4. IA Generativa y Protocolo MCP | Estrategia CLI/prompts con Claude Code + MCP | [`Respuestas.md`](Respuestas.md) §4 |
| 5. Performance (JMeter) y Pipeline (YAML) | Métricas SLA (pct95/Error %) y artefactos con `if: always()` | [`Respuestas.md`](Respuestas.md) §5 |

## Parte A — UI con Playwright (POM)

Suite E2E contra [saucedemo.com](https://www.saucedemo.com/) que cubre el flujo crítico de compra. Los selectores usan los atributos estables `data-test` y los specs no contienen selectores directos, solo page objects.

| # | Test | Validación |
|---|------|------------|
| setup | `auth.setup.ts` | Login gráfico **una sola vez** → guarda sesión en `.auth/user.json` |
| 1 | `01-login.spec.ts` | Login con `standard_user` carga el inventario (corre **sin** sesión guardada) |
| 2 | `02-add-to-cart.spec.ts` | Agregar producto muestra el badge del carrito en `1` |
| 3 | `03-checkout-overview.spec.ts` | El producto aparece en el resumen de **Checkout: Overview** |
| 4 | `04-purchase-complete.spec.ts` | **Finish** muestra "Thank you for your order!" |
| 5 | `05-corporate-orders-503.spec.ts` | 503 simulado → la UI muestra la alerta controlada `NYXN-503` |

### Reto 1 — Optimización de Sesión (Storage State)

- El proyecto `setup` (`tests/auth.setup.ts`) hace el login gráfico y persiste cookies + localStorage en `.auth/user.json`; el proyecto `chromium` declara `storageState` + `dependencies: ['setup']`, así **ningún spec repite el login**.
- El setup se **omite** (skip a nivel de archivo, sin abrir navegador) si la sesión guardada sigue vigente — valida la expiración de la cookie `session-username` (saucedemo la emite con vida de 10 min). Si expiró o no existe, se regenera sola.
- `01-login.spec.ts` valida el login en sí, por eso arranca con `storageState` vacío.

### Reto 2 — Mocking de Red (HTTP 503)

El endpoint de órdenes corporativas no existe en el demo público, así que se aplica **Early Testing**: el contrato de la HU se simula completo con `page.route()` bajo el mismo `baseURL`, sin tocar el servidor real.

1. Una ruta sirve la pantalla de órdenes corporativas según el contrato.
2. Otra intercepta `POST /api/orders/corporate` y responde **503** con body de error.
3. `waitForResponse` aserta que la petición real recibió el 503 (no un falso positivo visual).
4. Se valida la alerta controlada de NYXN (`[data-test="nyxn-service-alert"]`, código `NYXN-503`) y que **no** aparece el mensaje de éxito.

## Parte B — API & Data Testing (Jest + Ajv)

Valida `POST /api/v1/orders` (carpeta `api/`, runner independiente de Playwright):

- **201 Created estricto** + **validación de esquema JSON** con Ajv (`api/orders.schema.ts`): campos obligatorios, tipos, patrón `NYXN-\d{4}` en `client_id`.
- Test de contraste: sin token OAuth2 → **401**.
- **Consulta nativa a BD** en [`api/verify-order.sql`](api/verify-order.sql): `SELECT ... FROM orders WHERE order_id = :order_id AND client_id = 'NYXN-2026'` (+ variante `COUNT(*)`, detalle de `order_items` y equivalente NoSQL en MongoDB).
- Sin backend desplegado, el test corre contra un **mock local del contrato** (`api/mock-server.ts`, `node:http` puro). Con `NYXN_API_BASE_URL` y `NYXN_OAUTH_TOKEN` definidos, apunta al backend real **sin cambiar una línea del test**.

## Estructura

```
pages/                       # Page Objects (POM)
  LoginPage.ts ... CheckoutCompletePage.ts
  CorporateOrdersPage.ts     # Pantalla de órdenes corporativas (Reto 2)
fixtures/
  pages.fixture.ts           # Fixtures de page objects + authenticatedInventory
  test-data.ts               # Credenciales, producto y datos de checkout
  corporate-orders.mock.ts   # Contrato mockeado: HTML, endpoint y body 503
tests/
  auth.setup.ts              # Login único → .auth/user.json (Reto 1)
  01-05*.spec.ts             # Escenarios E2E
api/
  orders.api.test.ts         # Parte B: POST /api/v1/orders (Jest)
  orders.schema.ts           # Esquema JSON de la respuesta 201
  mock-server.ts             # Mock local del contrato (Early Testing)
  verify-order.sql           # Consulta nativa SQL/NoSQL a la BD
playwright.config.ts         # baseURL, proyectos setup/chromium, storageState
jest.config.js               # Jest solo para api/ (no se mezcla con Playwright)
Respuestas.md                # Respuestas escritas (bloques 2, 4 y 5)
```

## Instalación

```bash
npm install
npx playwright install chromium
```

## Ejecución

```bash
npm test            # suite E2E completa (Playwright)
npm run test:headed # E2E con navegador visible
npm run test:api    # Parte B: tests de API (Jest)
npm run report      # reporte HTML de Playwright
```

> Para forzar un login nuevo en E2E, borra `.auth/user.json` (también se regenera solo cuando la sesión expira).
