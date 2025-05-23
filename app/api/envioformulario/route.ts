// app/api/envioformulario/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ContactoFormulario } from '@/lib/models/contacto-formulario';
import { sendContactNotification, sendAutoResponse } from '@/lib/email/emailService';
import Notificacion from '@/lib/models/notificacion';
import { broadcastNotification } from '@/lib/socket/socket-service';
import mongoose from 'mongoose';
import { contactRateLimiter } from '@/lib/middleware/rate-limiter';
import { validateInput } from '@/lib/validation/input-validator';
import { logger } from '@/lib/utils/logger';

// Esquema de validación específico para el formulario de contacto
const contactFormSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  email: z.string()
    .email('Formato de email inválido')
    .max(254, 'El email es demasiado largo'),
  
  telefono: z.string()
    .regex(/^(\+56)?[ -]?[2-9][ -]?\d{4}[ -]?\d{4}$|^(\+56)?[ -]?9[ -]?\d{4}[ -]?\d{4}$/, 
           'Formato de teléfono chileno inválido')
    .optional(),
  
  empresa: z.string()
    .max(200, 'El nombre de la empresa es demasiado largo')
    .optional(),
  
  mensaje: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede tener más de 2000 caracteres'),
  
  tipoServicio: z.enum(['instalacion', 'mantenimiento', 'consulta', 'otro']),
  
  terminosAceptados: z.boolean()
    .refine(val => val === true, 'Debe aceptar los términos y condiciones'),
});

// Definir una interfaz para los usuarios administradores
interface AdminUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: string;
}

// Función para encontrar usuarios administradores
async function findAdminUsers(): Promise<AdminUser[]> {
  try {
    // Verificar que la conexión esté lista
    if (mongoose.connection.readyState !== 1) {
      logger.database('warn', 'La conexión a MongoDB no está lista');
      return [];
    }
    
    // Obtener todos los administradores
    const db = mongoose.connection.db;
    if (!db) {
      logger.database('warn', 'No se pudo acceder a la base de datos');
      return [];
    }
    
    const users = await db.collection('users').find({ role: 'admin' }).toArray();
    return users as AdminUser[];
  } catch (error) {
    logger.database('error', 'Error al buscar administradores', { error });
    return [];
  }
}

// Función para sanitizar texto
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Eliminar etiquetas HTML
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Eliminar caracteres de control
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

// Función para detectar patrones maliciosos
function containsMaliciousPatterns(text: string): boolean {
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b)/i,
    /(--|\/\*|\*\/|;)/,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(text.toLowerCase()));
}

export async function POST(request: NextRequest) {
  try {
    // 1. Aplicar rate limiting
    const rateLimitResponse = contactRateLimiter(request);
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    // 2. Validar headers de seguridad
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({
        message: "Content-Type debe ser application/json"
      }, { status: 400 });
    }

    // 3. Obtener y validar tamaño del request
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 1024 * 1024) { // 1MB límite
      return NextResponse.json({
        message: "Request demasiado grande"
      }, { status: 413 });
    }

    // 4. Obtener los datos de la solicitud
    const rawData = await request.text();
    
    if (!rawData || rawData.trim() === '') {
      return NextResponse.json({ 
        message: "No se recibieron datos en la solicitud" 
      }, { status: 400 });
    }

    let data;
    try {
      data = JSON.parse(rawData);
    } catch (parseError) {
      return NextResponse.json({ 
        message: "Error al procesar los datos enviados. Formato JSON inválido." 
      }, { status: 400 });
    }

    // 5. Validar estructura y contenido con Zod
    const validation = validateInput(contactFormSchema, data);
    if (!validation.success) {
      return NextResponse.json({ 
        message: "Error de validación", 
        errors: validation.errors 
      }, { status: 400 });
    }

    const validatedData = validation.data!;

    // 6. Sanitizar y validar contenido contra patrones maliciosos
    const sanitizedData = {
      ...validatedData,
      nombre: sanitizeText(validatedData.nombre),
      empresa: validatedData.empresa ? sanitizeText(validatedData.empresa) : undefined,
      mensaje: sanitizeText(validatedData.mensaje),
      email: validatedData.email.toLowerCase().trim(),
      telefono: validatedData.telefono?.replace(/[\s-]/g, ''),
    };

    // Verificar patrones maliciosos
    const textFields = [sanitizedData.nombre, sanitizedData.empresa, sanitizedData.mensaje].filter(Boolean);
    if (textFields.some(field => containsMaliciousPatterns(field!))) {
      logger.security(`Intento de inyección detectado desde IP: ${request.ip || 'unknown'}`);
      return NextResponse.json({
        message: "Contenido no permitido detectado"
      }, { status: 400 });
    }

    // 7. Conectar a MongoDB con timeout
    try {
      await connectToDatabase();
    } catch (dbError) {
      logger.database('error', 'Error de conexión a MongoDB', { dbError });
      return NextResponse.json({ 
        message: "Error de conexión a la base de datos. Por favor, intente nuevamente más tarde." 
      }, { status: 503 });
    }

    // 8. Crear nuevo documento con metadatos de seguridad
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    const newForm = new ContactoFormulario({
      nombre: sanitizedData.nombre,
      email: sanitizedData.email,
      telefono: sanitizedData.telefono,
      empresa: sanitizedData.empresa,
      mensaje: sanitizedData.mensaje,
      servicio: sanitizedData.tipoServicio,
      estado: 'pendiente',
      fecha: new Date(),
      metadatos: {
        ip: clientIP,
        userAgent: request.headers.get('user-agent') || 'unknown',
        origin: request.headers.get('origin') || 'unknown',
        timestamp: new Date(),
      }
    });

    // 9. Guardar en la base de datos con manejo de errores
    let result;
    try {
      result = await newForm.save();
    } catch (saveError: any) {
      logger.error('Error al guardar formulario', saveError);
      
      if (saveError.code === 11000) {
        return NextResponse.json({
          message: "Formulario duplicado detectado"
        }, { status: 409 });
      }
      
      return NextResponse.json({
        message: "Error al guardar el formulario"
      }, { status: 500 });
    }

    // 10. Enviar notificaciones (no críticas)
    try {
      await sendContactNotification(result);
    } catch (emailError) {
      logger.warn('Error al enviar notificación de contacto', { emailError });
      // No interrumpir el flujo si falla el correo
    }
    
    try {
      await sendAutoResponse(sanitizedData.nombre, sanitizedData.email);
    } catch (emailError) {
      logger.warn('Error al enviar respuesta automática', { emailError });
      // No interrumpir el flujo si falla el correo
    }

    // 11. Logging de seguridad
    logger.success(`Formulario procesado exitosamente - ID: ${result._id}, IP: ${clientIP}`);

    // 12. Respuesta exitosa con headers de seguridad
    return NextResponse.json(
      { 
        message: "Formulario enviado exitosamente",
        id: result._id,
        timestamp: new Date().toISOString()
      },
      { 
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        }
      }
    );
    
  } catch (error: any) {
    // Logging de errores de seguridad
    logger.error('Error crítico en formulario de contacto', {
      error: error.message,
      stack: error.stack,
      ip: request.ip || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    // Determinar tipo de error para respuesta apropiada
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({ 
        message: "Error de conexión a la base de datos. Por favor, intente nuevamente más tarde." 
      }, { status: 503 });
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        message: "Error de validación de datos"
      }, { status: 400 });
    }
    
    // Error genérico sin exponer detalles internos
    return NextResponse.json({ 
      message: "Error interno del servidor" 
    }, { status: 500 });
  }
}

// Manejar métodos HTTP no permitidos
export async function GET() {
  return NextResponse.json(
    { message: "Método no permitido" },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: "Método no permitido" },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Método no permitido" },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

// Función para formatear el servicio
function formatServicio(servicio: string): string {
  if (servicio === 'cotizacion_reposicion') return 'Sistema de Reposición';
  if (servicio === 'cotizacion_monitoreo') return 'Sistema de Monitoreo';
  if (servicio === 'cotizacion_mantenimiento') return 'Mantenimiento';
  if (servicio === 'cotizacion_completa') return 'Solución Integral';
  return servicio.replace('cotizacion_', '').split('_').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Función para formatear el plazo
function formatPlazo(plazo: string): string {
  if (plazo === 'urgente') return 'urgente (1-2 días)';
  if (plazo === 'pronto') return 'pronto (3-7 días)';
  if (plazo === 'normal') return 'normal (1-2 semanas)';
  if (plazo === 'planificacion') return 'en planificación (1 mes o más)';
  return plazo;
}