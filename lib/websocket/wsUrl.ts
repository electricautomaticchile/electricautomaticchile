/**
 * Resolución centralizada de la URL del servicio WebSocket.
 *
 * El WebSocket Hub vive en un servicio independiente (websocket-electric),
 * separado de la API REST. En producción el ALB enruta las rutas `/ws` y
 * `/ws/*` al servicio WS, por lo que el cliente puede usar el mismo dominio
 * que la API.
 *
 * Orden de resolución:
 *   1. NEXT_PUBLIC_WS_URL  → URL explícita del WS (ej: wss://api.dominio.com)
 *   2. NEXT_PUBLIC_API_URL → se reutiliza el dominio de la API (mismo ALB)
 *   3. Fallback de desarrollo local
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
    // Reutilizar el dominio de la API (mismo ALB, distinto path).
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
