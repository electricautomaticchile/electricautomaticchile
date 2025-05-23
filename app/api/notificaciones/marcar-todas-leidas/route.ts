import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Notificacion from '@/lib/models/notificacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
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
    
    // Actualizar todas las notificaciones del usuario que no estén leídas
    const resultado = await Notificacion.updateMany(
      { 
        destinatario: session.user.id,
        leida: false
      },
      { 
        $set: { leida: true } 
      }
    );
    
    return NextResponse.json({ 
      message: "Todas las notificaciones marcadas como leídas",
      cantidadActualizada: resultado.modifiedCount
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al marcar todas las notificaciones como leídas', error);
    
    return NextResponse.json({ 
      message: "Error al marcar todas las notificaciones como leídas",
      error: error.message 
    }, { status: 500 });
  }
} 