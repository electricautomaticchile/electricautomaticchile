import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

// Tipos para el proxy
interface JWTPayload {
  sub: string;
  userId: string;
  userRole: string;
  userType: string;
  empresaId?: string;
  iat: number;
  exp: number;
}

class ProxyLogger {
  private isProduction = process.env.NODE_ENV === "production";

  info(message: string, data?: Record<string, unknown>): void {
    if (!this.isProduction) {
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (!this.isProduction) {
    }
  }
}

const logger = new ProxyLogger();

// Función para verificar JWT
async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    // Decodificar si viene URL-encoded
    const decoded = token.includes('%') ? decodeURIComponent(token) : token;

    if (!process.env.JWT_SECRET) {
      logger.error("JWT_SECRET no está configurado en las variables de entorno");
      throw new Error("Configuración de seguridad faltante");
    }

    if (process.env.JWT_SECRET.length < 32) {
      logger.error("JWT_SECRET debe tener al menos 32 caracteres");
      throw new Error("Configuración de seguridad insuficiente");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(decoded, secret);

    logger.info("JWT verificado exitosamente");
    return payload as unknown as JWTPayload;
  } catch (error) {
    logger.error("Error verificando JWT", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

// Rutas que requieren autenticación
const protectedRoutes = [
  "/cliente",
  "/empresa",
  "/admin",
  "/dashboard",
];

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/cliente-login",
  "/empresa-login",
];

// Función para verificar si una ruta está protegida
function isProtectedRoute(pathname: string): boolean {
  // Si es una ruta pública, no está protegida
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return false;
  }
  
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Función para verificar permisos de acceso
function hasAccess(
  pathname: string,
  userRole: string,
  userType: string
): boolean {
  if (pathname.startsWith("/cliente")) {
    return userType === "cliente" || userRole === "cliente";
  }

  if (pathname.startsWith("/empresa")) {
    return userType === "empresa" || userType === "usuario_empresa" || userRole === "empresa" || userRole?.startsWith("EMPRESA_");
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return userType === "admin" || userType === "superadmin" || userRole === "admin" || userRole === "superadmin";
  }

  return true;
}

// Construye la CSP por-request con un nonce. Reemplaza al header estático de
// next.config.mjs para poder eliminar 'unsafe-inline' de script-src: los scripts
// de Next llevan el nonce y 'strict-dynamic' habilita los que ellos cargan.
function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";
  const connectSrc = [
    "'self'",
    "https://api-electricautomaticchile.com",
    "wss://api-electricautomaticchile.com",
    "https://api.notion.com",
    "https://www.google-analytics.com",
    ...(isDev ? ["http://localhost:4000", "ws://localhost:4000", "ws://localhost:3000"] : []),
  ].join(" ");

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSP con nonce por-request. El nonce va en los headers del request (para que
  // Next lo aplique a sus scripts) y en la respuesta (para que el browser lo
  // haga cumplir).
  const nonce = crypto.randomUUID();
  const csp = buildCSP(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const rendered = () => {
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set("Content-Security-Policy", csp);
    return res;
  };

  if (!isProtectedRoute(pathname)) {
    return rendered();
  }

  logger.info(`Verificando acceso a ruta protegida: ${pathname}`);

  // Obtener el token de las cookies
  const authToken = request.cookies.get("auth_token")?.value;

  logger.info(`Cookie auth_token encontrada: ${authToken ? "SÍ" : "NO"}`);

  if (authToken) {
    logger.info(`Longitud del token: ${authToken.length}`);
    logger.info(`Primeros 50 chars: ${authToken.substring(0, 50)}...`);
  }

  let tokenPayload: JWTPayload | null = null;

  if (authToken) {
    logger.info("Verificando JWT...");
    tokenPayload = await verifyJWT(authToken);
    logger.info(`JWT válido: ${tokenPayload ? "SÍ" : "NO"}`);

    if (tokenPayload) {
      logger.info("Payload JWT", {
        sub: tokenPayload.sub,
        userId: tokenPayload.userId,
        userRole: tokenPayload.userRole,
        userType: tokenPayload.userType,
        empresaId: tokenPayload.empresaId,
      });
    }
  }

  // HIGH-05: Validar que callbackUrl sea ruta relativa (prevenir open redirect)
  if (!tokenPayload) {
    logger.warn(`Acceso denegado - Sin token válido para: ${pathname}`);

    let loginUrl = "/cliente-login";
    if (pathname.startsWith("/empresa")) {
      loginUrl = "/empresa-login";
    }

    const url = new URL(loginUrl, request.url);
    // Solo permitir rutas relativas como callbackUrl
    if (pathname.startsWith('/') && !pathname.startsWith('//')) {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  logger.info("Token válido para usuario", {
    id: tokenPayload.sub,
    userRole: tokenPayload.userRole,
    userType: tokenPayload.userType,
  });

  const userRole = tokenPayload.userRole;
  const tipoUsuario = tokenPayload.userType;

  if (!hasAccess(pathname, userRole, tipoUsuario)) {
    logger.warn(`Acceso denegado - Permisos insuficientes`, {
      pathname,
      userRole,
      tipoUsuario,
    });

    let loginUrl = "/cliente-login";
    if (pathname.startsWith("/empresa")) {
      loginUrl = "/empresa-login";
    }

    const url = new URL(loginUrl, request.url);
    // HIGH-05: Solo rutas relativas
    if (pathname.startsWith('/') && !pathname.startsWith('//')) {
      url.searchParams.set("callbackUrl", pathname);
    }
    url.searchParams.set("error", "insufficient_permissions");
    return NextResponse.redirect(url);
  }

  logger.info(`Acceso permitido a: ${pathname}`);
  return rendered();
}

// HIGH-04: Ampliar matcher para cubrir todas las rutas protegidas
// El middleware corre en todas las páginas (para aplicar la CSP con nonce),
// excepto assets estáticos y rutas /api. El guard de auth solo actúa en rutas
// protegidas (ver isProtectedRoute); el resto solo recibe la CSP.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)",
  ],
};
