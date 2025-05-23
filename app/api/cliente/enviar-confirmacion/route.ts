import { NextRequest, NextResponse } from 'next/server';
import { sendRegistrationConfirmation } from '@/lib/email/emailService';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
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
    
    // Verificar que los datos requeridos estén presentes
    if (!data.nombre || !data.correo || !data.numeroCliente || !data.password) {
      return NextResponse.json({
        message: "Faltan datos requeridos: nombre, correo, numeroCliente y password son obligatorios."
      }, { status: 400 });
    }
    
    // Enviar correo electrónico de confirmación
    await sendRegistrationConfirmation(
      data.nombre,
      data.correo,
      data.numeroCliente,
      data.password
    );
    
    return NextResponse.json({ 
      message: "Correo de confirmación enviado exitosamente" 
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al enviar correo de confirmación', error);
    
    return NextResponse.json({ 
      message: "Error al enviar correo de confirmación",
      error: error.message 
    }, { status: 500 });
  }
} 