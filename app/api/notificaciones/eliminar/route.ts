import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Notificacion from '@/lib/models/notificacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';
import { logger } from '@/lib/utils/logger';

// Definir la ruta como dinámica para evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
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
    const notificacionId = data.notificacionId;
    
    if (!notificacionId) {
      return NextResponse.json({ 
        message: "ID de notificación no proporcionado" 
      }, { status: 400 });
    }
    
    // Validar que el ObjectId es válido
    if (!mongoose.Types.ObjectId.isValid(notificacionId)) {
      return NextResponse.json({ 
        message: "ID de notificación inválido" 
      }, { status: 400 });
    }
    
    // Buscar la notificación
    const notificacion = await Notificacion.findById(notificacionId);
    
    if (!notificacion) {
      return NextResponse.json({ 
        message: "Notificación no encontrada" 
      }, { status: 404 });
    }
    
    // Verificar que el usuario actual es el destinatario de la notificación
    if (notificacion.destinatario.toString() !== session.user.id) {
      return NextResponse.json({ 
        message: "No tienes permiso para eliminar esta notificación" 
      }, { status: 403 });
    }
    
    // Eliminar la notificación
    await Notificacion.deleteOne({ _id: notificacionId });
    
    return NextResponse.json({ 
      message: "Notificación eliminada correctamente" 
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al eliminar notificación', error);
    
    return NextResponse.json({ 
      message: "Error al eliminar notificación",
      error: error.message 
    }, { status: 500 });
  }
} 