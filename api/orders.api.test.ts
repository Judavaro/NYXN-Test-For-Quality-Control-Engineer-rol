import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import Ajv from 'ajv';
import { orderCreatedSchema } from './orders.schema';
import { startOrdersMockServer } from './mock-server';

/**
 * API & Data Testing Express — POST /api/v1/orders (Jest).
 *
 * Contra el backend real: definir NYXN_API_BASE_URL y NYXN_OAUTH_TOKEN.
 * Sin esas variables, se levanta el mock local del contrato (Early Testing).
 *
 * La verificación nativa en base de datos está en api/verify-order.sql.
 */
const ORDER_PAYLOAD = {
  client_id: 'NYXN-2026',
  items: [{ sku: 'MCP-SERVER-CORE', quantity: 2 }],
};

describe('POST /api/v1/orders — creación de órdenes corporativas', () => {
  let baseUrl: string;
  let token: string;
  let closeMock: (() => Promise<void>) | undefined;

  beforeAll(async () => {
    if (process.env.NYXN_API_BASE_URL) {
      baseUrl = process.env.NYXN_API_BASE_URL;
      token = process.env.NYXN_OAUTH_TOKEN ?? '';
    } else {
      const mock = await startOrdersMockServer();
      baseUrl = mock.baseUrl;
      closeMock = mock.close;
      token = 'mock-oauth2-token';
    }
  });

  afterAll(async () => {
    await closeMock?.();
  });

  test('responde 201 Created y el cuerpo cumple el esquema JSON', async () => {
    const response = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ORDER_PAYLOAD),
    });

    // 1) Estatus estricto: 201 Created (no basta cualquier 2xx).
    expect(response.status).toBe(201);

    // 2) Validación rápida de esquema JSON con Ajv.
    const body = await response.json();
    const ajv = new Ajv();
    const validate = ajv.compile(orderCreatedSchema);
    const isValid = validate(body);
    expect(validate.errors ?? []).toEqual([]);
    expect(isValid).toBe(true);

    // 3) El recurso creado conserva el client_id y los ítems enviados.
    expect(body.client_id).toBe(ORDER_PAYLOAD.client_id);
    expect(body.items).toEqual(ORDER_PAYLOAD.items);

    // 4) Trazabilidad para la verificación en BD (api/verify-order.sql):
    // el order_id devuelto es la clave con la que se consulta el registro.
    expect(body.order_id).toBeTruthy();
  });

  test('rechaza la petición sin token OAuth2 (401 Unauthorized)', async () => {
    const response = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ORDER_PAYLOAD),
    });

    expect(response.status).toBe(401);
  });
});
