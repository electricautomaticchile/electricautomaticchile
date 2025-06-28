import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Función para verificar el token JWT
async function verifyJWT(token: string) {
  try {
    // Validar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      console.error(
        "🚨 CRÍTICO: JWT_SECRET no está configurado en las variables de entorno"
      );
      throw new Error("Configuración de seguridad faltante");
    }

    // Validar que el secreto tenga longitud mínima segura
    if (process.env.JWT_SECRET.length < 32) {
      console.error("🚨 CRÍTICO: JWT_SECRET debe tener al menos 32 caracteres");
      throw new Error("Configuración de seguridad insuficiente");
    }

    console.log(
      `🔐 Verificando JWT con secret de ${process.env.JWT_SECRET.length} caracteres`
    );

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);
    console.log(`✅ JWT verificado exitosamente`);
    return payload;
  } catch (error) {
    console.error("❌ Error verificando JWT:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) || "No token",
    });
    return null;
  }
}

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  "/dashboard-superadmin",
  "/dashboard-cliente",
  "/dashboard-empresa",
];

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/formulario",
  "/acercade",
  "/terminosycondiciones",
  "/navservices",
  "/debug-api",
];

// Este middleware se ejecuta antes de manejar las solicitudes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rutas de archivos estáticos y API internas de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Permitir rutas públicas
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 🔒 AUTENTICACIÓN ACTIVADA - Verificar rutas protegidas
  const isDashboardRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isDashboardRoute) {
    console.log(`🔒 Verificando acceso a ruta protegida: ${pathname}`);

    // Obtener el token de las cookies
    const authToken = request.cookies.get("auth_token")?.value;

    // DEBUG: Mostrar información sobre cookies
    console.log(`🍪 Cookie auth_token encontrada: ${authToken ? "SÍ" : "NO"}`);
    if (authToken) {
      console.log(`🍪 Longitud del token: ${authToken.length}`);
      console.log(`🍪 Primeros 50 chars: ${authToken.substring(0, 50)}...`);
    }

    let tokenPayload = null;

    if (authToken) {
      console.log(`🔍 Verificando JWT...`);
      tokenPayload = await verifyJWT(authToken);
      console.log(`🔍 JWT válido: ${tokenPayload ? "SÍ" : "NO"}`);
      if (tokenPayload) {
        console.log(`🔍 Payload JWT:`, {
          sub: tokenPayload.sub,
          userId: tokenPayload.userId,
          role: tokenPayload.role,
          tipoUsuario: tokenPayload.tipoUsuario,
        });
      }
    }

    // Si no hay token válido, redirigir al login
    if (!tokenPayload) {
      console.log(`🚫 Acceso denegado - Sin token válido para: ${pathname}`);
      const url = new URL("/auth/login", request.url);
      // Guardar la URL original como callbackUrl
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    console.log(`✅ Token válido para usuario:`, {
      id: tokenPayload.sub,
      role: tokenPayload.role,
      tipoUsuario: tokenPayload.tipoUsuario,
    });

    const userRole = tokenPayload.role as string;
    const tipoUsuario = tokenPayload.tipoUsuario as string;

    // 🛡️ CONTROL DE ACCESO POR ROLES
    if (pathname.startsWith("/dashboard-superadmin")) {
      // Solo admins y superadmins pueden acceder
      if (
        tipoUsuario !== "admin" &&
        userRole !== "admin" &&
        userRole !== "superadmin"
      ) {
        console.log(
          `🚫 Acceso denegado al superadmin dashboard - Rol: ${userRole}, Tipo: ${tipoUsuario}`
        );
        // Redirigir al dashboard correspondiente según su rol
        const redirectUrl =
          tipoUsuario === "cliente"
            ? "/dashboard-cliente"
            : "/dashboard-empresa";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } else if (pathname.startsWith("/dashboard-cliente")) {
      // Solo clientes pueden acceder
      if (tipoUsuario !== "cliente" && userRole !== "cliente") {
        console.log(
          `🚫 Acceso denegado al cliente dashboard - Rol: ${userRole}, Tipo: ${tipoUsuario}`
        );
        // Redirigir al dashboard correspondiente según su rol
        const redirectUrl =
          tipoUsuario === "admin" || userRole === "admin"
            ? "/dashboard-superadmin"
            : "/dashboard-empresa";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } else if (pathname.startsWith("/dashboard-empresa")) {
      // Solo empresas pueden acceder
      if (tipoUsuario !== "empresa" && userRole !== "empresa") {
        console.log(
          `🚫 Acceso denegado al empresa dashboard - Rol: ${userRole}, Tipo: ${tipoUsuario}`
        );
        // Redirigir al dashboard correspondiente según su rol
        const redirectUrl =
          tipoUsuario === "admin" || userRole === "admin"
            ? "/dashboard-superadmin"
            : "/dashboard-cliente";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    console.log(`✅ Acceso permitido a: ${pathname}`);
  }

  // Procesar normalmente todas las demás rutas
  return NextResponse.next();
}

// Configurar en qué rutas se aplicará el middleware
export const config = {
  // Aplicar a rutas específicas, excluyendo archivos estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
