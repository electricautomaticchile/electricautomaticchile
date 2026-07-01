import { test, expect } from '@playwright/test';

/**
 * Flujo de autenticación end-to-end. Requiere:
 *   - Frontend corriendo (E2E_BASE_URL)
 *   - Backend accesible (NEXT_PUBLIC_API_URL configurado en el frontend)
 *   - Credenciales válidas por variables de entorno
 *
 * Se saltan automáticamente si no hay credenciales, para no fallar en CI
 * sin configuración.
 */

const empresaEmail = process.env.E2E_EMPRESA_EMAIL;
const empresaPass = process.env.E2E_EMPRESA_PASSWORD;
const clienteRut = process.env.E2E_CLIENTE_RUT;
const clientePass = process.env.E2E_CLIENTE_PASSWORD;

test.describe('Login empresa', () => {
  test.skip(!empresaEmail || !empresaPass, 'faltan E2E_EMPRESA_EMAIL / E2E_EMPRESA_PASSWORD');

  test('login exitoso redirige al dashboard de empresa', async ({ page }) => {
    await page.goto('/empresa-login/');
    await page.getByLabel(/Email/i).fill(empresaEmail!);
    await page.getByLabel(/Contraseña/i).fill(empresaPass!);
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();

    // Tras login, el proxy debe permitir el acceso a /empresa.
    await expect(page).toHaveURL(/\/empresa/, { timeout: 15_000 });
    // La cookie de sesión legible que usa el proxy debe existir.
    const cookies = await page.context().cookies();
    expect(cookies.some((c) => c.name === 'auth_token')).toBeTruthy();
  });

  test('credenciales inválidas muestran error y no redirige', async ({ page }) => {
    await page.goto('/empresa-login/');
    await page.getByLabel(/Email/i).fill('noexiste@example.com');
    await page.getByLabel(/Contraseña/i).fill('claveIncorrecta123');
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/empresa-login/);
  });
});

test.describe('Login cliente', () => {
  test.skip(!clienteRut || !clientePass, 'faltan E2E_CLIENTE_RUT / E2E_CLIENTE_PASSWORD');

  test('login exitoso redirige al dashboard de cliente', async ({ page }) => {
    await page.goto('/cliente-login/');
    await page.getByLabel(/RUT/i).fill(clienteRut!);
    await page.getByLabel(/Contraseña/i).fill(clientePass!);
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();

    await expect(page).toHaveURL(/\/cliente/, { timeout: 15_000 });
  });
});
