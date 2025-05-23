import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

/**
 * Configuración de headers de seguridad por entorno
 */
const SECURITY_CONFIG = {
  development: {
    contentSecurityPolicy: "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: https:; img-src 'self' data: https: blob:; media-src 'self' https: blob:;",
    strictTransportSecurity: null, // No HTTPS en desarrollo
  },
  production: {
    contentSecurityPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https: blob:",
      "connect-src 'self' https://api.resend.com https://*.amazonaws.com https://vitals.vercel-insights.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  }
};

/**
 * Headers de seguridad que se aplican en todos los entornos
 */
const COMMON_SECURITY_HEADERS = {
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevenir MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Habilitar protección XSS del navegador
  'X-XSS-Protection': '1; mode=block',
  
  // Política de referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Controlar qué características del navegador pueden ser usadas
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  
  // Remover información del servidor
  'Server': '',
  'X-Powered-By': '',
  
  // Política de origen cruzado
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Cache control por defecto
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  
  // Información de seguridad adicional
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen'
};

/**
 * Headers específicos para rutas de API
 */
const API_SECURITY_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive, notranslate, noimageindex',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

/**
 * Headers específicos para rutas públicas
 */
const PUBLIC_SECURITY_HEADERS = {
  'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  'Cache-Control': 'public, max-age=31536000, immutable',
};

/**
 * Headers específicos para archivos estáticos
 */
const STATIC_SECURITY_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'X-Content-Type-Options': 'nosniff',
};

/**
 * Determina el tipo de ruta para aplicar headers específicos
 */
function getRouteType(pathname: string): 'api' | 'static' | 'public' {
  if (pathname.startsWith('/api/')) return 'api';
  if (pathname.startsWith('/_next/') || pathname.includes('.')) return 'static';
  return 'public';
}

/**
 * Middleware principal de headers de seguridad
 */
export function securityHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const routeType = getRouteType(pathname);
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Headers comunes para todas las rutas
  Object.entries(COMMON_SECURITY_HEADERS).forEach(([key, value]) => {
    if (value) response.headers.set(key, value);
  });
  
  // Content Security Policy basado en el entorno
  const config = isProduction ? SECURITY_CONFIG.production : SECURITY_CONFIG.development;
  if (config.contentSecurityPolicy) {
    response.headers.set('Content-Security-Policy', config.contentSecurityPolicy);
  }
  
  // Strict Transport Security solo en producción
  if (config.strictTransportSecurity) {
    response.headers.set('Strict-Transport-Security', config.strictTransportSecurity);
  }
  
  // Headers específicos por tipo de ruta
  switch (routeType) {
    case 'api':
      Object.entries(API_SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // CORS headers para APIs
      response.headers.set('Access-Control-Allow-Origin', isProduction ? 'https://electricautomaticchile.com' : '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      break;
      
    case 'static':
      Object.entries(STATIC_SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      break;
      
    case 'public':
      Object.entries(PUBLIC_SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      break;
  }
  
  // Logging de seguridad en desarrollo
  if (!isProduction) {
    logger.debug(`Headers de seguridad aplicados para: ${pathname} (${routeType})`);
  }
  
  return response;
}

/**
 * Middleware específico para manejar preflight requests (OPTIONS)
 */
export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.headers.set('Access-Control-Allow-Origin', isProduction ? 'https://electricautomaticchile.com' : '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }
  
  return null;
}

/**
 * Valida que las configuraciones de seguridad sean correctas
 */
export function validateSecurityConfig(): boolean {
  const requiredHeaders = ['X-Frame-Options', 'X-Content-Type-Options', 'X-XSS-Protection'];
  
  for (const header of requiredHeaders) {
    if (!COMMON_SECURITY_HEADERS[header as keyof typeof COMMON_SECURITY_HEADERS]) {
      console.error(`❌ Header de seguridad requerido faltante: ${header}`);
      return false;
    }
  }
  
  console.log('✅ Configuración de headers de seguridad validada');
  return true;
}

// Exportar configuraciones para testing
export { SECURITY_CONFIG, COMMON_SECURITY_HEADERS, API_SECURITY_HEADERS }; 