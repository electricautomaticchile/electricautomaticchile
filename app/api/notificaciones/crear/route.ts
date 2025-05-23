import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Notificacion from '@/lib/models/notificacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { sendNotificationToUser, isUserConnected } from '@/lib/socket/socket-service';

// Definir la ruta como dinámica para evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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
    
    // Validar datos requeridos
    const { tipo, titulo, descripcion, destinatario, prioridad } = data;
    
    if (!tipo || !titulo || !descripcion || !destinatario) {
      return NextResponse.json({ 
        message: "Faltan campos requeridos" 
      }, { status: 400 });
    }
    
    // Crear la notificación
    const nuevaNotificacion = new Notificacion({
      tipo,
      titulo,
      descripcion,
      destinatario,
      prioridad: prioridad || 'media',
      creador: session.user.id,
      fecha: new Date(),
      leida: false,
      enlace: data.enlace,
      accion: data.accion
    });
    
    // Guardar en la base de datos
    await nuevaNotificacion.save();
    
    // Enviar en tiempo real si el usuario está conectado
    if (isUserConnected(destinatario)) {
      sendNotificationToUser(destinatario, {
        id: nuevaNotificacion._id,
        tipo,
        titulo,
        descripcion,
        fecha: new Date(),
        prioridad: prioridad || 'media'
      });
    }
    
    return NextResponse.json({ 
      message: "Notificación creada correctamente",
      notificacion: nuevaNotificacion
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error al crear notificación:', error);
    
    return NextResponse.json({ 
      message: "Error al crear la notificación",
      error: error.message 
    }, { status: 500 });
  }
} 