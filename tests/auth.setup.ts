import fs from 'fs';
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CREDENTIALS } from '../fixtures/test-data';
import { STORAGE_STATE } from '../playwright.config';

/** Margen de seguridad para que la cookie no expire a mitad de la corrida. Algo base. */
const EXPIRY_MARGIN_SECONDS = 60;

/**
 * La sesión guardada es reutilizable solo si la cookie "session-username"
 * sigue vigente (saucedemo la emite con una vida de 10 minutos).
 */
function hasValidSession(): boolean {
  if (!fs.existsSync(STORAGE_STATE)) {
    return false;
  }
  try {
    const state = JSON.parse(fs.readFileSync(STORAGE_STATE, 'utf-8'));
    const session = state.cookies?.find(
      (cookie: { name: string }) => cookie.name === 'session-username',
    );
    return !!session && session.expires > Date.now() / 1000 + EXPIRY_MARGIN_SECONDS;
  } catch {
    return false;
  }
}

/**
 * Realiza el login gráfico y guarda la sesión (cookies + localStorage) en
 * STORAGE_STATE. El proyecto "chromium" depende de este setup y reutiliza
 * ese estado, evitando repetir el login en cada spec.
 *
 * Si STORAGE_STATE ya existe con una sesión vigente (de una corrida anterior),
 * el login se omite y se reutiliza. Si el archivo no existe o la cookie
 * expiró, se vuelve a autenticar y se regenera.
 */

setup.skip(
  hasValidSession(),
  'La sesión guardada en .auth/user.json sigue vigente; se reutiliza.',
);

setup('autenticar y guardar Storage State', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
  await inventoryPage.expectLoaded();

  await page.context().storageState({ path: STORAGE_STATE });
});
