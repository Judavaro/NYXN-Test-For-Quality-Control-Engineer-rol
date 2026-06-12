-- =====================================================================
-- Verificación nativa en base de datos (API & Data Testing Express)
-- Comprueba que la orden creada vía POST /api/v1/orders quedó persistida
-- con el client_id correcto.
-- :order_id = body.order_id devuelto en la respuesta 201 Created.
-- =====================================================================

-- Opción A (SQL — PostgreSQL/MySQL): consulta por la clave del recurso creado.
-- Resultado esperado: exactamente 1 fila con client_id = 'NYXN-2026'.
SELECT order_id,
       client_id,
       status,
       created_at
FROM   orders
WHERE  order_id = :order_id
  AND  client_id = 'NYXN-2026';

-- Variante de aserción directa (útil en un step automatizado):
-- devuelve 1 si el registro existe con el client_id correcto, 0 si no.
SELECT COUNT(*) AS registro_correcto
FROM   orders
WHERE  order_id = :order_id
  AND  client_id = 'NYXN-2026';

-- Verificación del detalle de la orden (ítems del payload):
SELECT oi.sku,
       oi.quantity
FROM   order_items oi
WHERE  oi.order_id = :order_id;
-- Esperado: 1 fila con sku = 'MCP-SERVER-CORE' y quantity = 2.

-- ---------------------------------------------------------------------
-- Opción B (NoSQL — MongoDB): equivalente si la persistencia es documental.
-- db.orders.findOne({ order_id: "<order_id>", client_id: "NYXN-2026" })
-- Esperado: documento no nulo con status "CREATED" e items
-- [{ sku: "MCP-SERVER-CORE", quantity: 2 }].
-- ---------------------------------------------------------------------
