/**
 * Configuración de Jest exclusiva para los tests de API (carpeta api/).
 * Los E2E de tests/ siguen siendo de Playwright y no se mezclan aquí.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/api'],
  testMatch: ['**/*.api.test.ts'],
};
