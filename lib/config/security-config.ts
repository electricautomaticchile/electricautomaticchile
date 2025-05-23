/**
 * Configuración centralizada de seguridad para la aplicación
 */

// Configuración de Rate Limiting
export const RATE_LIMIT_CONFIG = {
  // API general
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente más tarde.'
  },
  
  // Autenticación
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 5,
    message: 'Demasiados intentos de login, intenta nuevamente en 15 minutos.'
  },
  
  // Formularios de contacto
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 3,
    message: 'Límite de formularios excedido, intenta nuevamente en 1 hora.'
  },
  
  // Subida de archivos
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 10,
    message: 'Límite de subidas excedido, intenta nuevamente en 1 hora.'
  },
  
  // Endpoints de administración
  admin: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 50,
    message: 'Límite de operaciones administrativas excedido.'
  }
};

// Configuración de validación de archivos
export const FILE_VALIDATION_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ],
  allowedDocumentTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ],
  maxFilenameLength: 255,
  blockedExtensions: [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
    '.vbs', '.js', '.jar', '.class', '.sh', '.ps1'
  ]
};

// Configuración de Content Security Policy
export const CSP_CONFIG = {
  development: {
    'default-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'data:', 'blob:', 'https:'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'media-src': ["'self'", 'https:', 'blob:']
  },
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Requerido por Next.js
      'https://va.vercel-scripts.com',
      'https://vitals.vercel-insights.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Requerido por Tailwind CSS
      'https://fonts.googleapis.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:'
    ],
    'media-src': [
      "'self'",
      'https:',
      'blob:'
    ],
    'connect-src': [
      "'self'",
      'https://api.resend.com',
      'https://*.amazonaws.com',
      'https://vitals.vercel-insights.com'
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  }
};

// Headers de seguridad comunes
export const SECURITY_HEADERS = {
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevenir MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Habilitar protección XSS del navegador
  'X-XSS-Protection': '1; mode=block',
  
  // Política de referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Remover información del servidor
  'Server': '',
  'X-Powered-By': '',
  
  // Política de origen cruzado
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Control de DNS prefetch
  'X-DNS-Prefetch-Control': 'off',
  
  // Prevenir descarga automática
  'X-Download-Options': 'noopen',
  
  // Política de permisos del navegador
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'autoplay=()',
    'encrypted-media=()',
    'fullscreen=(self)',
    'picture-in-picture=()'
  ].join(', ')
};

// Configuración de CORS
export const CORS_CONFIG = {
  development: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  production: {
    origin: [
      'https://electricautomaticchile.com',
      'https://www.electricautomaticchile.com',
      'https://main.d31trp39fgtk7e.amplifyapp.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
};

// Configuración de validación de entrada
export const INPUT_VALIDATION_CONFIG = {
  // Límites de texto
  textLimits: {
    minName: 2,
    maxName: 100,
    minMessage: 10,
    maxMessage: 2000,
    maxEmail: 254,
    maxCompany: 200,
    maxFilename: 255
  },
  
  // Patrones regex
  patterns: {
    safeText: /^[a-zA-ZÀ-ÿ0-9\s\-_.,!?()]+$/,
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    phoneChile: /^(\+56)?[ -]?[2-9][ -]?\d{4}[ -]?\d{4}$|^(\+56)?[ -]?9[ -]?\d{4}[ -]?\d{4}$/,
    alphanumeric: /^[a-zA-Z0-9_-]+$/,
    rut: /^[0-9]{7,8}-[0-9kK]$/,
    mongoId: /^[a-f\d]{24}$/i
  },
  
  // Patrones maliciosos
  maliciousPatterns: [
    // XSS
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<form[^>]*>.*?<\/form>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    
    // SQL Injection
    /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/i,
    /(--|\/\*|\*\/|;|'|"|`)/,
    /(\bor\b|\band\b).*(\s|=|>|<)/i,
    
    // Command Injection
    /(\||&|;|\$\(|\`)/,
    /(rm|cat|ls|ps|kill|sudo|su|chmod|chown|wget|curl)/i,
    
    // Path Traversal
    /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
    /\/etc\/passwd|\/etc\/shadow|\/windows\/system32/i
  ]
};

// Configuración de logging de seguridad
export const SECURITY_LOGGING_CONFIG = {
  // Eventos que requieren logging
  events: {
    rateLimitExceeded: true,
    maliciousContentDetected: true,
    invalidFileUpload: true,
    authenticationFailure: true,
    unauthorizedAccess: true,
    csrfAttempt: true,
    sqlInjectionAttempt: true,
    xssAttempt: true
  },
  
  // Nivel de detalle del logging
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  
  // Información a incluir en logs
  includeUserAgent: true,
  includeIP: true,
  includeReferer: true,
  includeTimestamp: true,
  
  // Exclusiones (datos sensibles que nunca se deben loggear)
  excludeFields: [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'credit_card',
    'ssn',
    'rut'
  ]
};

// Rutas y configuraciones de acceso
export const ACCESS_CONFIG = {
  // Rutas que requieren autenticación
  protectedRoutes: [
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
  ],
  
  // Rutas públicas
  publicRoutes: [
    '/',
    '/auth',
    '/formulario',
    '/acercade',
    '/navservices',
    '/terminosycondiciones',
    '/api/testdb',
    '/api/envioformulario',
    '/api/auth'
  ],
  
  // Rutas de administración que requieren permisos especiales
  adminRoutes: [
    '/dashboard-superadmin',
    '/api/admin'
  ],
  
  // Rutas que deben usar HTTPS en producción
  httpsOnlyRoutes: [
    '/auth',
    '/dashboard-cliente',
    '/dashboard-empresa',
    '/dashboard-superadmin',
    '/api/auth',
    '/api/admin'
  ]
};

// Configuración de timeouts y límites
export const LIMITS_CONFIG = {
  requestTimeout: 30000, // 30 segundos
  maxRequestSize: 50 * 1024 * 1024, // 50MB
  maxJsonPayload: 1024 * 1024, // 1MB para JSON
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
  maxConcurrentConnections: 1000,
  maxFailedAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutos
};

// Configuración específica por entorno
export const getSecurityConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    isProduction,
    csp: isProduction ? CSP_CONFIG.production : CSP_CONFIG.development,
    cors: isProduction ? CORS_CONFIG.production : CORS_CONFIG.development,
    strictTransportSecurity: isProduction ? 'max-age=31536000; includeSubDomains; preload' : null,
    enableHsts: isProduction,
    logLevel: isProduction ? 'error' : 'debug',
    enableDetailedLogging: !isProduction
  };
};

export default {
  RATE_LIMIT_CONFIG,
  FILE_VALIDATION_CONFIG,
  CSP_CONFIG,
  SECURITY_HEADERS,
  CORS_CONFIG,
  INPUT_VALIDATION_CONFIG,
  SECURITY_LOGGING_CONFIG,
  ACCESS_CONFIG,
  LIMITS_CONFIG,
  getSecurityConfig
}; 