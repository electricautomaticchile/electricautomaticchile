/**
 * Resolución centralizada de la URL del servicio WebSocket.
 *
 * El WebSocket Hub vive en un servicio independiente (websocket-electric),
 * desplegado por separado de la API REST (en Render, dominio propio).
 *
 * Orden de resolución:
 *   1. NEXT_PUBLIC_WS_URL  → URL explícita del WS
 *                            (ej: wss://websocket-electric.onrender.com)
 *   2. NEXT_PUBLIC_API_URL → fallback: reutiliza el dominio de la API
 *   3. Fallback de desarrollo local (puerto 8081)
 *
 * El path del endpoint de conexión es siempre `/ws/connect`.
 */

export const WS_CONNECT_PATH = '/ws/connect';

/** Base del WS en esquema http(s), sin el path de conexión. */
export function getWebSocketBase(): string {
  const explicit = process.env.NEXT_PUBLIC_WS_URL;
  if (explicit) {
    return explicit.replace(/\/+$/, '');
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    // Fallback: reutilizar el dominio de la API.
    return apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }

  // Desarrollo local: servicio WS en el puerto 8081.
  return 'http://localhost:8081';
}

/**
 * URL completa de conexión WebSocket en esquema ws(s)://.../ws/connect.
 * Convierte http→ws y https→wss automáticamente.
 */
export function getWebSocketUrl(): string {
  const base = getWebSocketBase();
  const wsBase = base.replace(/^http/, 'ws');
  return `${wsBase}${WS_CONNECT_PATH}`;
}
