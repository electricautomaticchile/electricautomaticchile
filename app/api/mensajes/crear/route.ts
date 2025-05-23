import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Mensaje from '@/lib/models/mensaje';
import Conversacion from '@/lib/models/conversacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { sendMessageToUser, isUserConnected, sendMessageToConversation } from '@/lib/socket/socket-service';
import mongoose from 'mongoose';
import { logger } from '@/lib/utils/logger';

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
    
    // Validar datos requeridos para crear un mensaje
    const { receptor, asunto, contenido, conversacionId, mensajeOriginalId } = data;
    
    if (!receptor || !contenido) {
      return NextResponse.json({ 
        message: "Faltan datos requeridos. Se necesita receptor y contenido." 
      }, { status: 400 });
    }
    
    let conversacion;
    
    // Si no hay conversación, crear una nueva
    if (!conversacionId) {
      // Crear una nueva conversación
      conversacion = new Conversacion({
        participantes: [session.user.id, receptor],
        asunto: asunto || "Nueva conversación",
        ultimoMensaje: new Date(),
        creador: session.user.id,
        archivada: false,
        activa: true
      });
      
      await conversacion.save();
    } else {
      // Verificar que la conversación existe
      if (!mongoose.Types.ObjectId.isValid(conversacionId)) {
        return NextResponse.json({ 
          message: "ID de conversación inválido" 
        }, { status: 400 });
      }
      
      conversacion = await Conversacion.findById(conversacionId);
      
      if (!conversacion) {
        return NextResponse.json({ 
          message: "Conversación no encontrada" 
        }, { status: 404 });
      }
      
      // Verificar que el usuario actual es parte de la conversación
      if (!conversacion.participantes.includes(new mongoose.Types.ObjectId(session.user.id))) {
        return NextResponse.json({ 
          message: "No tienes permiso para enviar mensajes en esta conversación" 
        }, { status: 403 });
      }
      
      // Actualizar fecha de último mensaje
      conversacion.ultimoMensaje = new Date();
      await conversacion.save();
    }
    
    // Crear el mensaje
    const mensaje = new Mensaje({
      emisor: session.user.id,
      receptor,
      asunto: asunto || conversacion.asunto,
      contenido,
      leido: false,
      fechaEnvio: new Date(),
      conversacionId: conversacion._id,
      esRespuesta: !!mensajeOriginalId,
      mensajeOriginal: mensajeOriginalId || undefined,
      adjuntos: data.adjuntos || []
    });
    
    await mensaje.save();
    
    // Enviar en tiempo real si el usuario está conectado
    if (isUserConnected(receptor)) {
      sendMessageToUser(receptor, {
        id: mensaje._id,
        emisor: session.user.id,
        emisorNombre: session.user.name,
        asunto: asunto || conversacion.asunto,
        contenido,
        fecha: new Date()
      });
    }
    
    // Notificar a todos los participantes de la conversación
    sendMessageToConversation(conversacion._id.toString(), {
      id: mensaje._id,
      emisor: session.user.id,
      emisorNombre: session.user.name,
      contenido,
      fecha: new Date()
    });
    
    return NextResponse.json({ 
      message: "Mensaje enviado correctamente",
      mensaje,
      conversacion
    }, { status: 201 });
    
  } catch (error: any) {
    logger.error('Error al crear mensaje', error);
    
    return NextResponse.json({ 
      message: "Error al crear mensaje",
      error: error.message 
    }, { status: 500 });
  }
} 