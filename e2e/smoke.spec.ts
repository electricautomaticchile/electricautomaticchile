import { test, expect } from '@playwright/test';

/**
 * Smoke tests: no requieren credenciales ni backend con datos.
 * Validan que las páginas públicas cargan y que las rutas protegidas
 * redirigen al login cuando no hay sesión.
 */

test.describe('Smoke — páginas públicas', () => {
  test('la landing carga', async ({ page }) => {
    const resp = await page.goto('/');
    expect(resp?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/); // tiene algún título
  });

  test('el login de cliente carga y muestra el formulario', async ({ page }) => {
    await page.goto('/cliente-login/');
    await expect(page.getByLabel(/RUT/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();
  });

  test('el login de empresa carga y muestra el formulario', async ({ page }) => {
    await page.goto('/empresa-login/');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();
  });
});

test.describe('Smoke — protección de rutas (sin sesión)', () => {
  test('ruta /cliente redirige a login', async ({ page }) => {
    await page.goto('/cliente/');
    await expect(page).toHaveURL(/cliente-login/);
  });

  test('ruta /empresa redirige a login', async ({ page }) => {
    await page.goto('/empresa/');
    await expect(page).toHaveURL(/empresa-login/);
  });
});
