import http from 'http';
import { randomUUID } from 'crypto';

/**
 * Mock local del backend de órdenes corporativas según el contrato de la HU
 * (Early Testing: los endpoints finales aún no están desplegados).
 *
 * Implementa POST /api/v1/orders:
 * - Exige Authorization: Bearer <token> (401 si falta).
 * - Responde 201 Created con el recurso creado según el contrato.
 * El mismo test corre contra el backend real definiendo NYXN_API_BASE_URL.
 */
export function startOrdersMockServer(): Promise<{ baseUrl: string; close: () => Promise<void> }> {
  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/api/v1/orders') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 'NYXN-404', message: 'Not Found' }));
      return;
    }

    if (!req.headers.authorization?.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 'NYXN-401', message: 'Missing or invalid OAuth2 token' }));
      return;
    }

    let rawBody = '';
    req.on('data', (chunk) => (rawBody += chunk));
    req.on('end', () => {
      const payload = JSON.parse(rawBody);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          order_id: randomUUID(),
          client_id: payload.client_id,
          items: payload.items,
          status: 'CREATED',
          created_at: new Date().toISOString(),
        }),
      );
    });
  });

  return new Promise((resolve) => {
    // Puerto 0 = el SO asigna un puerto libre (evita colisiones en CI).
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}
