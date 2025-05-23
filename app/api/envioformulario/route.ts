// app/api/envioformulario/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ContactoFormulario } from '@/lib/models/contacto-formulario';
import { sendContactNotification, sendAutoResponse } from '@/lib/email/emailService';
import Notificacion from '@/lib/models/notificacion';
import { broadcastNotification } from '@/lib/socket/socket-service';
import mongoose from 'mongoose';

// Esquema de validación con Zod
const contactFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  servicio: z.enum([
    "cotizacion_reposicion", 
    "cotizacion_monitoreo", 
    "cotizacion_mantenimiento", 
    "cotizacion_completa"
  ], {
    required_error: "Debe seleccionar un tipo de cotización",
    invalid_type_error: "Tipo de cotización no válido"
  }),
  plazo: z.enum(['urgente', 'pronto', 'normal', 'planificacion']).optional(),
  mensaje: z.string().min(5, "Los detalles deben tener al menos 5 caracteres"),
  archivoUrl: z.string().optional(), // URL del archivo subido a S3
  archivo: z.string().optional(), // Nombre del archivo
  archivoBase64: z.string().optional(), // Contenido del archivo en base64 para adjuntar al correo
  archivoTipo: z.string().optional(), // Tipo MIME del archivo
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
      console.log('La conexión a MongoDB no está lista');
      return [];
    }
    
    // Obtener todos los administradores
    const db = mongoose.connection.db;
    if (!db) {
      console.log('No se pudo acceder a la base de datos');
      return [];
    }
    
    const users = await db.collection('users').find({ role: 'admin' }).toArray();
    return users as AdminUser[];
  } catch (error) {
    console.error('Error al buscar administradores:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos de la solicitud
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
        message: "Error al procesar los datos enviados. Formato incorrecto." 
      }, { status: 400 });
    }
    
    // Validar los datos con Zod
    try {
      contactFormSchema.parse(data);
    } catch (validationError: any) {
      if (validationError.errors) {
        return NextResponse.json({ 
          message: "Error de validación", 
          errors: validationError.errors 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        message: "Error de validación en los datos enviados"
      }, { status: 400 });
    }

    // Conectar a MongoDB
    await connectToDatabase();

    // Crear nuevo documento
    const newForm = new ContactoFormulario({
      ...data,
      estado: 'pendiente',
      fecha: new Date(),
    });

    // Guardar en la base de datos
    const result = await newForm.save();

    // Enviar notificación por correo electrónico al administrador
    try {
      await sendContactNotification(data);
    } catch (emailError) {
      // No interrumpimos el flujo si falla el correo
    }
    
    // Enviar respuesta automática al usuario
    try {
      await sendAutoResponse(data.nombre, data.email);
    } catch (emailError) {
      // No interrumpimos el flujo si falla el correo
    }
    
    // Crear notificación en el sistema para todos los administradores
    try {
      // Obtener los administradores
      const adminUsers = await findAdminUsers();
      
      if (adminUsers.length > 0) {
        // Determinar la prioridad según el plazo
        let prioridad = 'media';
        if (data.plazo === 'urgente') prioridad = 'alta';
        
        // Crear una notificación para cada administrador
        for (const admin of adminUsers) {
          const nuevaNotificacion = new Notificacion({
            tipo: 'info',
            titulo: 'Nueva solicitud de cotización',
            descripcion: `${data.nombre} ha solicitado una cotización para ${formatServicio(data.servicio)}${data.plazo ? ` con plazo ${formatPlazo(data.plazo)}` : ''}`,
            destinatario: admin._id,
            prioridad: prioridad,
            fecha: new Date(),
            leida: false,
            enlace: `/dashboard-superadmin/cotizaciones`
          });
          
          await nuevaNotificacion.save();
        }
        
        // Enviar notificación en tiempo real a todos los administradores
        broadcastNotification({
          id: new mongoose.Types.ObjectId().toString(),
          tipo: 'info',
          titulo: 'Nueva solicitud de cotización',
          descripcion: `${data.nombre} ha solicitado una cotización para ${formatServicio(data.servicio)}${data.plazo ? ` con plazo ${formatPlazo(data.plazo)}` : ''}`,
          fecha: new Date(),
          prioridad: data.plazo === 'urgente' ? 'alta' : 'media'
        });
      }
    } catch (notifError) {
      console.error('Error al crear notificación de nueva cotización:', notifError);
      // No interrumpimos el flujo si falla la notificación
    }

    // Respuesta exitosa (incluso si el correo falló)
    return NextResponse.json({ 
      message: "Formulario enviado exitosamente", 
      id: result._id,
      emailSent: true
    }, { status: 201 });
    
  } catch (error: any) {
    // Determinar si es un error de conexión a MongoDB
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({ 
        message: "Error de conexión a la base de datos. Por favor, intente nuevamente más tarde." 
      }, { status: 503 });
    }
    
    // Otros errores
    return NextResponse.json({ 
      message: "Error al procesar el formulario", 
      error: error.message 
    }, { status: 500 });
  }
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