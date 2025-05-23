import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { rateLimiter, authRateLimiter, contactRateLimiter, uploadRateLimiter, adminRateLimiter } from './lib/middleware/rate-limiter';
import { securityHeaders, handleCors } from './lib/middleware/security-headers';
import { logger } from './lib/utils/logger';

/**
 * Rutas que requieren autenticación
 */
const PROTECTED_ROUTES = [
  '/dashboard-cliente',
  '/dashboard-empresa', 
  '/dashboard-superadmin',
  '/api/admin',
  '/api/user',
  '/api/cliente',
  '/api/cotizaciones',
  '/api/documentos',
  '/api/devices',
  '/api/mensajes',
  '/api/notificaciones',
  '/api/actividad'
];

/**
 * Rutas públicas que no requieren autenticación
 */
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/formulario',
  '/acercade',
  '/navservices',
  '/terminosycondiciones',
  '/api/testdb',
  '/api/envioformulario',
  '/api/auth'
];

/**
 * Verifica si una ruta requiere autenticación
 */
function requiresAuth(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica si una ruta es pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Aplica rate limiting específico según la ruta
 */
function applyRateLimiting(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  
  // Rate limiting específico por tipo de endpoint
  if (pathname.includes('/api/auth')) {
    return authRateLimiter(request);
  }
  
  if (pathname.includes('/api/envioformulario')) {
    return contactRateLimiter(request);
  }
  
  if (pathname.includes('/api/documentos')) {
    return uploadRateLimiter(request);
  }
  
  if (pathname.includes('/api/admin') || pathname.includes('/api/superadmin')) {
    return adminRateLimiter(request);
  }
  
  if (pathname.startsWith('/api/')) {
    return rateLimiter()(request);
  }
  
  return null;
}

/**
 * Middleware principal de seguridad
 */
async function securityMiddleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  
  // 1. Manejar CORS preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }
  
  // 2. Aplicar rate limiting
  const rateLimitResponse = applyRateLimiting(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // 3. Aplicar headers de seguridad
  const response = securityHeaders(request);
  
  // 4. Validaciones adicionales para rutas específicas
  if (pathname.startsWith('/api/')) {
    // Validar Content-Type para APIs que no sean GET
    if (request.method !== 'GET' && request.method !== 'OPTIONS') {
      const contentType = request.headers.get('content-type');
      
      // Para endpoints que esperan JSON
      if (pathname.includes('/api/') && !pathname.includes('/api/documentos')) {
        if (!contentType || !contentType.includes('application/json')) {
          return NextResponse.json(
            { 
              error: 'Content-Type inválido',
              message: 'Se requiere Content-Type: application/json'
            },
            { status: 400 }
          );
        }
      }
    }
    
    // Validar tamaño de request body
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      const maxSize = pathname.includes('/api/documentos') ? 50 * 1024 * 1024 : 1024 * 1024; // 50MB para docs, 1MB para otros
      
      if (size > maxSize) {
        return NextResponse.json(
          {
            error: 'Request demasiado grande',
            message: `El tamaño máximo permitido es ${maxSize / (1024 * 1024)}MB`
          },
          { status: 413 }
        );
      }
    }
  }
  
  // 5. Logging de seguridad en desarrollo
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Middleware de seguridad: ${request.method} ${pathname}`, {});
  }
  
  return response;
}

/**
 * Middleware de autenticación con next-auth
 */
const authMiddleware = withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    
    // Logging de acceso autenticado
    if (process.env.NODE_ENV === 'development') {
      logger.auth(`Usuario autenticado accediendo a: ${pathname}`, {});
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Permitir acceso a rutas públicas sin token
        if (isPublicRoute(pathname)) {
          return true;
        }
        
        // Requerir token para rutas protegidas
        if (requiresAuth(pathname)) {
          return !!token;
        }
        
        return true;
      }
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    }
  }
);

/**
 * Middleware principal que combina seguridad y autenticación
 */
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Aplicar middleware de seguridad primero
  const securityResponse = await securityMiddleware(request);
  
  // Si el middleware de seguridad retorna una respuesta (error), devolverla inmediatamente
  if (securityResponse.status !== 200 && securityResponse.headers.get('next-url') === null) {
    return securityResponse;
  }
  
  // Si la ruta requiere autenticación, aplicar middleware de auth
  if (requiresAuth(pathname)) {
    return authMiddleware(request as any);
  }
  
  return securityResponse;
}

/**
 * Configuración de matcher para el middleware
 */
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - archivos estáticos (_next/static)
     * - archivos de imagen y otros assets
     * - favicon, robots.txt, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};

// Exportar para testing
export { requiresAuth, isPublicRoute, PROTECTED_ROUTES, PUBLIC_ROUTES }; 