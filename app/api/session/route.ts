// path: app/api/session/route.ts
//
// Route handler same-origin para gestionar la cookie de sesión que usa el
// middleware de Next (proxy.ts) para proteger rutas.
//
// Contexto: el frontend (electricautomaticchile.com) y la API
// (api-electricautomaticchile.com) están en dominios distintos, así que la
// cookie HttpOnly que emite el backend NO es visible para el middleware de
// Next. Antes se resolvía guardando el JWT con `document.cookie` (legible por
// JS → vulnerable a XSS). Aquí lo endurecemos: el navegador envía el token a
// este endpoint del propio dominio y se re-emite como cookie **HttpOnly +
// Secure + SameSite=Lax**, ilegible para JavaScript. El middleware server-side
// sí puede leerla.
//
// Las llamadas a la API siguen autenticándose con la cookie HttpOnly cross-site
// del backend (withCredentials), este endpoint solo alimenta el guard de rutas.

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

const COOKIE_NAME = "auth_token";
const MAX_AGE = 24 * 60 * 60; // 24h, igual que el max-age previo

async function tokenEsValido(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return false;
  try {
    const decoded = token.includes("%") ? decodeURIComponent(token) : token;
    await jwtVerify(decoded, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

// POST /api/session — establece la cookie de sesión HttpOnly tras el login.
export async function POST(request: NextRequest) {
  let token: unknown;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (typeof token !== "string" || token.length === 0) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  // Solo persistimos tokens con firma válida (evita fijar basura como cookie).
  if (!(await tokenEsValido(token))) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, { ...cookieOptions(), maxAge: MAX_AGE });
  return res;
}

// DELETE /api/session — limpia la cookie de sesión al cerrar sesión.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}
