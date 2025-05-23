import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Mensaje from '@/lib/models/mensaje';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';
import { logger } from '@/lib/utils/logger';

// Definir la ruta como dinámica para evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: "No autorizado" 
      }, { status: 401 });
    }
    
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Obtener datos de la solicitud
    const data = await request.json();
    const messageId = data.messageId;
    
    if (!messageId) {
      return NextResponse.json({ 
        message: "ID de mensaje no proporcionado" 
      }, { status: 400 });
    }
    
    // Validar que el ObjectId es válido
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json({ 
        message: "ID de mensaje inválido" 
      }, { status: 400 });
    }
    
    // Buscar y actualizar el mensaje
    const mensaje = await Mensaje.findById(messageId);
    
    if (!mensaje) {
      return NextResponse.json({ 
        message: "Mensaje no encontrado" 
      }, { status: 404 });
    }
    
    // Verificar que el usuario actual es el receptor del mensaje
    if (mensaje.receptor.toString() !== session.user.id) {
      return NextResponse.json({ 
        message: "No tienes permiso para marcar este mensaje como leído" 
      }, { status: 403 });
    }
    
    // Actualizar a leído y establecer fecha de lectura
    mensaje.leido = true;
    mensaje.fechaLectura = new Date();
    await mensaje.save();
    
    return NextResponse.json({ 
      message: "Mensaje marcado como leído correctamente",
      mensaje
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al marcar mensaje como leído', error);
    
    return NextResponse.json({ 
      message: "Error al marcar mensaje como leído",
      error: error.message 
    }, { status: 500 });
  }
} 