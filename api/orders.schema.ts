/**
 * Esquema JSON (contrato) de la respuesta 201 Created de POST /api/v1/orders.
 * Se valida con Ajv: tipos, campos obligatorios y formatos mínimos.
 */
export const orderCreatedSchema = {
  type: 'object',
  required: ['order_id', 'client_id', 'status', 'items', 'created_at'],
  properties: {
    order_id: { type: 'string', minLength: 1 },
    client_id: { type: 'string', pattern: '^NYXN-\\d{4}$' },
    status: { type: 'string', enum: ['CREATED'] },
    created_at: { type: 'string', minLength: 1 },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['sku', 'quantity'],
        properties: {
          sku: { type: 'string', minLength: 1 },
          quantity: { type: 'integer', minimum: 1 },
        },
      },
    },
  },
} as const;
