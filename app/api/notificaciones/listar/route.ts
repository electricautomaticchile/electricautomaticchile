import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Notificacion from '@/lib/models/notificacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { logger } from '@/lib/utils/logger';

// Definir la ruta como dinámica para evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
    
    // Obtener parámetros
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Obtener todas las notificaciones del usuario actual
    const notificaciones = await Notificacion.find({ 
      destinatario: session.user.id 
    })
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limit);
    
    // Obtener contadores para el resumen
    const totalNotificaciones = await Notificacion.countDocuments({ 
      destinatario: session.user.id 
    });
    
    const noLeidas = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      leida: false 
    });
    
    const alertas = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'alerta'
    });
    
    const alertasNoLeidas = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'alerta',
      leida: false 
    });
    
    const info = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'info'
    });
    
    const infoNoLeidas = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'info',
      leida: false 
    });
    
    const exito = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'exito'
    });
    
    const exitoNoLeidas = await Notificacion.countDocuments({ 
      destinatario: session.user.id,
      tipo: 'exito',
      leida: false 
    });
    
    // Retornar datos
    return NextResponse.json({ 
      notificaciones,
      resumen: {
        total: totalNotificaciones,
        noLeidas,
        alertas: {
          total: alertas,
          noLeidas: alertasNoLeidas
        },
        info: {
          total: info,
          noLeidas: infoNoLeidas
        },
        exito: {
          total: exito,
          noLeidas: exitoNoLeidas
        }
      },
      pagination: {
        page,
        limit,
        total: totalNotificaciones,
        pages: Math.ceil(totalNotificaciones / limit)
      }
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al listar notificaciones', error);
    
    return NextResponse.json({ 
      message: "Error al listar notificaciones",
      error: error.message 
    }, { status: 500 });
  }
} 