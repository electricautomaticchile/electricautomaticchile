// app/api/envioformulario/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ContactoFormulario } from '@/lib/models/contacto-formulario';
import { sendContactNotification, sendAutoResponse } from '@/lib/email/emailService';

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
  archivo: z.string().optional(),
  archivoBase64: z.string().optional(),
  archivoTipo: z.string().optional(),
});

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