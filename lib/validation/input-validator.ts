import { z } from 'zod';

/**
 * Patrones de validación comunes
 */
const VALIDATION_PATTERNS = {
  // Solo letras, números, espacios, guiones y algunos caracteres especiales básicos
  safeText: /^[a-zA-ZÀ-ÿ0-9\s\-_.,!?()]+$/,
  
  // Email RFC 5322 compliant
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Teléfono chileno
  phoneChile: /^(\+56)?[ -]?[2-9][ -]?\d{4}[ -]?\d{4}$|^(\+56)?[ -]?9[ -]?\d{4}[ -]?\d{4}$/,
  
  // Solo números
  numeric: /^\d+$/,
  
  // Alphanumeric con algunos caracteres especiales seguros
  alphanumericSafe: /^[a-zA-Z0-9_-]+$/,
  
  // URL segura
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  
  // RUT chileno
  rut: /^[0-9]{7,8}-[0-9kK]$/,
  
  // Fecha ISO
  isoDate: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
};

/**
 * Lista de palabras y patrones peligrosos para detectar ataques
 */
const DANGEROUS_PATTERNS = [
  // SQL Injection
  /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/i,
  /(--|\/\*|\*\/|;|'|"|`)/,
  /(\bor\b|\band\b).*(\s|=|>|<)/i,
  
  // XSS
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  /<form[^>]*>.*?<\/form>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi, // onevent handlers
  
  // Command Injection
  /(\||&|;|\$\(|\`)/,
  /(rm|cat|ls|ps|kill|sudo|su|chmod|chown|wget|curl)/i,
  
  // Path Traversal
  /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
  /\/etc\/passwd|\/etc\/shadow|\/windows\/system32/i,
  
  // LDAP Injection
  /(\*|\(|\)|\\|\/|\+|=|<|>|;|,|")/,
];

/**
 * Función para sanitizar texto eliminando caracteres peligrosos
 */
function sanitizeText(input: string): string {
  return input
    // Eliminar etiquetas HTML
    .replace(/<[^>]*>/g, '')
    // Eliminar caracteres de control
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Normalizar espacios en blanco
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Función para detectar patrones peligrosos
 */
function containsDangerousPatterns(input: string): boolean {
  const lowercaseInput = input.toLowerCase();
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(lowercaseInput));
}

/**
 * Esquemas de validación base
 */
export const BaseSchemas = {
  // Texto seguro básico
  safeString: z.string()
    .min(1, 'El campo no puede estar vacío')
    .max(1000, 'El texto es demasiado largo')
    .refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    )
    .transform(sanitizeText),

  // Email
  email: z.string()
    .min(1, 'El email es requerido')
    .max(254, 'El email es demasiado largo')
    .regex(VALIDATION_PATTERNS.email, 'Formato de email inválido')
    .transform(val => val.toLowerCase().trim()),

  // Teléfono chileno
  phoneChile: z.string()
    .regex(VALIDATION_PATTERNS.phoneChile, 'Formato de teléfono chileno inválido')
    .transform(val => val.replace(/[\s-]/g, '')),

  // URL segura
  url: z.string()
    .regex(VALIDATION_PATTERNS.url, 'URL inválida')
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return ['http:', 'https:'].includes(url.protocol);
        } catch {
          return false;
        }
      },
      'URL debe usar HTTP o HTTPS'
    ),

  // RUT chileno
  rut: z.string()
    .regex(VALIDATION_PATTERNS.rut, 'Formato de RUT inválido')
    .refine(validateRutChecksum, 'RUT inválido'),

  // Número positivo
  positiveNumber: z.number()
    .min(0, 'El número debe ser positivo')
    .max(999999999, 'El número es demasiado grande'),

  // ID de base de datos
  mongoId: z.string()
    .regex(/^[a-f\d]{24}$/i, 'ID de base de datos inválido'),

  // Fecha
  date: z.string()
    .regex(VALIDATION_PATTERNS.isoDate, 'Formato de fecha inválido')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      'Fecha inválida'
    ),

  // Texto básico sin transformaciones (para usar con min/max adicionales)
  basicSafeString: z.string()
    .refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    )
    .transform(sanitizeText),
};

/**
 * Validador de RUT chileno con dígito verificador
 */
function validateRutChecksum(rut: string): boolean {
  const [number, checkDigit] = rut.split('-');
  const rutNumber = parseInt(number, 10);
  
  let sum = 0;
  let multiplier = 2;
  
  // Calcular suma ponderada
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const calculatedCheckDigit = remainder < 2 ? remainder.toString() : (11 - remainder === 10 ? 'k' : (11 - remainder).toString());
  
  return calculatedCheckDigit.toLowerCase() === checkDigit.toLowerCase();
}

/**
 * Esquemas específicos para formularios
 */
export const FormSchemas = {
  // Formulario de contacto
  contactForm: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ).transform(sanitizeText),
    email: BaseSchemas.email,
    telefono: BaseSchemas.phoneChile.optional(),
    empresa: z.string().max(200).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
    mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000).refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ).transform(sanitizeText),
    tipoServicio: z.enum(['instalacion', 'mantenimiento', 'consulta', 'otro']),
    terminosAceptados: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
  }),

  // Login
  loginForm: z.object({
    email: BaseSchemas.email,
    password: z.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128, 'La contraseña es demasiado larga')
      .refine(
        (val) => !containsDangerousPatterns(val),
        'La contraseña contiene caracteres no permitidos'
      ),
    rememberMe: z.boolean().optional(),
  }),

  // Registro de usuario
  registerForm: z.object({
    nombre: z.string().min(2).max(100).refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ).transform(sanitizeText),
    apellido: z.string().min(2).max(100).refine(
      (val) => !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ).transform(sanitizeText),
    email: BaseSchemas.email,
    telefono: BaseSchemas.phoneChile,
    rut: BaseSchemas.rut,
    empresa: z.string().max(200).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
    password: z.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128, 'La contraseña es demasiado larga')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/\d/, 'Debe contener al menos un número')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string(),
    terminosAceptados: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  ),

  // Actualización de perfil
  profileUpdate: z.object({
    nombre: z.string().min(2).max(100).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
    apellido: z.string().min(2).max(100).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
    telefono: BaseSchemas.phoneChile.optional(),
    empresa: z.string().max(200).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
  }),

  // Subida de documentos
  documentUpload: z.object({
    tipoDocumento: z.enum(['factura', 'contrato', 'reporte', 'imagen', 'otro']),
    descripcion: z.string().max(500).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El texto contiene caracteres no permitidos'
    ),
    etiquetas: z.array(z.string().max(50).refine(
      (val) => !containsDangerousPatterns(val),
      'Las etiquetas contienen caracteres no permitidos'
    )).max(10).optional(),
    privado: z.boolean().default(false),
  }),
};

/**
 * Esquemas para parámetros de URL y query strings
 */
export const UrlSchemas = {
  // Parámetros de paginación
  pagination: z.object({
    page: z.coerce.number().min(1).max(1000).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().max(100).optional().refine(
      (val) => !val || !containsDangerousPatterns(val),
      'El término de búsqueda contiene caracteres no permitidos'
    ),
    sortBy: z.enum(['fecha', 'nombre', 'estado', 'tipo']).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),

  // ID de recurso
  resourceId: z.object({
    id: BaseSchemas.mongoId,
  }),

  // Filtros de búsqueda
  searchFilters: z.object({
    tipo: z.enum(['cliente', 'empresa', 'dispositivo', 'reporte']).optional(),
    estado: z.enum(['activo', 'inactivo', 'pendiente', 'completado']).optional(),
    fechaDesde: BaseSchemas.date.optional(),
    fechaHasta: BaseSchemas.date.optional(),
  }),
};

/**
 * Función principal de validación con manejo de errores
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Error interno de validación'],
    };
  }
}

/**
 * Middleware para validar request bodies en APIs
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown): Promise<{ isValid: boolean; validatedData?: T; errors?: string[] }> => {
    const validation = validateInput(schema, data);
    
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }
    
    return {
      isValid: true,
      validatedData: validation.data,
    };
  };
}

/**
 * Función para validar archivos subidos
 */
export function validateFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxNameLength?: number;
} = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB por defecto
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
    maxNameLength = 255,
  } = options;

  const errors: string[] = [];

  // Validar tamaño
  if (file.size > maxSize) {
    errors.push(`El archivo es demasiado grande. Máximo permitido: ${maxSize / (1024 * 1024)}MB`);
  }

  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
  }

  // Validar nombre
  if (file.name.length > maxNameLength) {
    errors.push(`El nombre del archivo es demasiado largo. Máximo: ${maxNameLength} caracteres`);
  }

  // Validar caracteres peligrosos en el nombre
  if (containsDangerousPatterns(file.name)) {
    errors.push('El nombre del archivo contiene caracteres no permitidos');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Exportar utilidades
export { sanitizeText, containsDangerousPatterns, VALIDATION_PATTERNS }; 