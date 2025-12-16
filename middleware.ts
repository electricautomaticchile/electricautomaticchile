import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Tipos para el middleware
interface JWTPayload {
  sub: string;
  userId: string;
  email: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
}

class MiddlewareLogger {
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

const logger = new MiddlewareLogger();

// Función para verificar JWT
async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {


    // Validar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      logger.error(
        "JWT_SECRET no está configurado en las variables de entorno"
      );
      throw new Error("Configuración de seguridad faltante");
    }

    // Validar que el secreto tenga longitud mínima segura
    if (process.env.JWT_SECRET.length < 32) {
      logger.error("JWT_SECRET debe tener al menos 32 caracteres");
      throw new Error("Configuración de seguridad insuficiente");
    }

    logger.info(
      `Verificando JWT con secret de ${process.env.JWT_SECRET.length} caracteres`
    );

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

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
];

// Función para verificar si una ruta está protegida
function isProtectedRoute(pathname: string): boolean {
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
    return userType === "empresa" || userRole === "empresa";
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo procesar rutas protegidas
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
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
        email: tokenPayload.email,
        role: tokenPayload.role,
        type: tokenPayload.type,
      });
    }
  }

  // Si no hay token válido, redirigir al login
  if (!tokenPayload) {
    logger.warn(`Acceso denegado - Sin token válido para: ${pathname}`);

    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  logger.info("Token válido para usuario", {
    id: tokenPayload.sub,
    role: tokenPayload.role,
    type: tokenPayload.type,
  });

  // Verificar permisos específicos por ruta
  const userRole = tokenPayload.role;
  const tipoUsuario = tokenPayload.type;

  if (!hasAccess(pathname, userRole, tipoUsuario)) {
    logger.warn(`Acceso denegado - Permisos insuficientes`, {
      pathname,
      userRole,
      tipoUsuario,
    });

    return NextResponse.redirect(new URL("/acceso-denegado", request.url));
  }

  logger.info(`Acceso permitido a: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cliente/:path*",
    "/empresa/:path*",
  ],
};
