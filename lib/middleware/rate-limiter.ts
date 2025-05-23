import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

// Configuración de rate limits por tipo de endpoint
const RATE_LIMITS = {
  // API general
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // 100 requests por ventana
  },
  // Autenticación
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5, // 5 intentos de login por ventana
  },
  // Formularios de contacto
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 3, // 3 formularios por hora
  },
  // Subida de archivos
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 10, // 10 uploads por hora
  },
  // Endpoints críticos de admin
  admin: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 50, // 50 requests por hora
  }
};

// Cache para almacenar contadores por IP
const rateLimitCache = new LRUCache<string, { count: number; resetTime: number }>({
  max: 10000, // Máximo 10k IPs en memoria
  ttl: 24 * 60 * 60 * 1000, // TTL de 24 horas
});

/**
 * Obtiene la IP real del cliente considerando proxies y CDNs
 */
function getRealClientIP(request: NextRequest): string {
  // Headers de proxy más comunes
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // X-Real-IP (Nginx)
  if (xRealIP) {
    return xRealIP;
  }
  
  // X-Forwarded-For (puede contener múltiples IPs)
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    return ips[0]; // Primera IP es la del cliente original
  }
  
  // IP remota directa
  return request.ip || 'unknown';
}

/**
 * Determina el tipo de rate limit basado en la ruta
 */
function getRateLimitType(pathname: string): keyof typeof RATE_LIMITS {
  if (pathname.includes('/api/auth')) return 'auth';
  if (pathname.includes('/api/envioformulario')) return 'contact';
  if (pathname.includes('/api/documentos')) return 'upload';
  if (pathname.includes('/api/admin') || pathname.includes('/api/superadmin')) return 'admin';
  if (pathname.startsWith('/api/')) return 'api';
  
  return 'api'; // Default
}

/**
 * Middleware principal de rate limiting
 */
export function rateLimiter(type?: keyof typeof RATE_LIMITS) {
  return (request: NextRequest): NextResponse | null => {
    const clientIP = getRealClientIP(request);
    const pathname = request.nextUrl.pathname;
    
    // Determinar tipo de rate limit
    const limitType = type || getRateLimitType(pathname);
    const config = RATE_LIMITS[limitType];
    
    // Crear clave única para el cache
    const cacheKey = `${clientIP}:${limitType}`;
    const now = Date.now();
    
    // Obtener datos del cache
    const cached = rateLimitCache.get(cacheKey);
    
    if (!cached || now > cached.resetTime) {
      // Primera solicitud o ventana expirada
      rateLimitCache.set(cacheKey, {
        count: 1,
        resetTime: now + config.windowMs
      });
      
      return addRateLimitHeaders(NextResponse.next(), {
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      });
    }
    
    if (cached.count >= config.maxRequests) {
      // Límite excedido
      console.warn(`Rate limit excedido para IP ${clientIP} en endpoint ${limitType}`);
      
      return addRateLimitHeaders(
        NextResponse.json(
          {
            error: 'Demasiadas solicitudes',
            message: `Has excedido el límite de ${config.maxRequests} solicitudes por ${config.windowMs / 60000} minutos. Intenta nuevamente más tarde.`,
            retryAfter: Math.ceil((cached.resetTime - now) / 1000)
          },
          { status: 429 }
        ),
        {
          limit: config.maxRequests,
          remaining: 0,
          resetTime: cached.resetTime
        }
      );
    }
    
    // Incrementar contador
    cached.count++;
    rateLimitCache.set(cacheKey, cached);
    
    return addRateLimitHeaders(NextResponse.next(), {
      limit: config.maxRequests,
      remaining: config.maxRequests - cached.count,
      resetTime: cached.resetTime
    });
  };
}

/**
 * Añade headers informativos de rate limiting
 */
function addRateLimitHeaders(
  response: NextResponse,
  info: { limit: number; remaining: number; resetTime: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', info.limit.toString());
  response.headers.set('X-RateLimit-Remaining', info.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000).toString());
  
  return response;
}

/**
 * Rate limiter específico para autenticación
 */
export const authRateLimiter = rateLimiter('auth');

/**
 * Rate limiter específico para formularios de contacto
 */
export const contactRateLimiter = rateLimiter('contact');

/**
 * Rate limiter específico para uploads
 */
export const uploadRateLimiter = rateLimiter('upload');

/**
 * Rate limiter específico para endpoints de admin
 */
export const adminRateLimiter = rateLimiter('admin');

/**
 * Rate limiter general para APIs
 */
export const apiRateLimiter = rateLimiter('api');

// Exportar configuración para tests
export { RATE_LIMITS }; 