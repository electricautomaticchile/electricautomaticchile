import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Mensaje from '@/lib/models/mensaje';
import Conversacion from '@/lib/models/conversacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';

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
    
    // Obtener parámetros de la solicitud
    const { searchParams } = new URL(request.url);
    const conversacionId = searchParams.get('conversacionId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Si se proporciona un ID de conversación, listar mensajes de esa conversación
    if (conversacionId) {
      // Validar que el ObjectId es válido
      if (!mongoose.Types.ObjectId.isValid(conversacionId)) {
        return NextResponse.json({ 
          message: "ID de conversación inválido" 
        }, { status: 400 });
      }
      
      // Verificar que la conversación existe
      const conversacion = await Conversacion.findById(conversacionId);
      
      if (!conversacion) {
        return NextResponse.json({ 
          message: "Conversación no encontrada" 
        }, { status: 404 });
      }
      
      // Verificar que el usuario actual es parte de la conversación
      if (!conversacion.participantes.some((p: mongoose.Types.ObjectId) => p.toString() === session.user.id)) {
        return NextResponse.json({ 
          message: "No tienes acceso a esta conversación" 
        }, { status: 403 });
      }
      
      // Obtener los mensajes de la conversación
      const mensajes = await Mensaje.find({ conversacionId })
        .sort({ fechaEnvio: -1 })
        .skip(skip)
        .limit(limit)
        .populate('emisor', 'nombre email');
      
      const totalMensajes = await Mensaje.countDocuments({ conversacionId });
      
      return NextResponse.json({ 
        mensajes,
        pagination: {
          total: totalMensajes,
          page,
          limit,
          pages: Math.ceil(totalMensajes / limit)
        }
      }, { status: 200 });
    } 
    // Si no hay conversacionId, listar todas las conversaciones del usuario
    else {
      // Encontrar todas las conversaciones donde el usuario es participante
      const conversaciones = await Conversacion.find({
        participantes: session.user.id,
        activa: true
      })
        .sort({ ultimoMensaje: -1 })
        .skip(skip)
        .limit(limit)
        .populate('participantes', 'nombre email');
      
      // Para cada conversación, obtener el último mensaje
      const conversacionesConMensajes = await Promise.all(
        conversaciones.map(async (conv) => {
          const ultimoMensaje = await Mensaje.findOne({ conversacionId: conv._id })
            .sort({ fechaEnvio: -1 })
            .limit(1)
            .populate('emisor', 'nombre email');
          
          // Contar mensajes no leídos
          const noLeidos = await Mensaje.countDocuments({
            conversacionId: conv._id,
            receptor: session.user.id,
            leido: false
          });
          
          return {
            ...conv.toObject(),
            ultimoMensaje,
            noLeidos
          };
        })
      );
      
      const totalConversaciones = await Conversacion.countDocuments({
        participantes: session.user.id,
        activa: true
      });
      
      return NextResponse.json({ 
        conversaciones: conversacionesConMensajes,
        pagination: {
          total: totalConversaciones,
          page,
          limit,
          pages: Math.ceil(totalConversaciones / limit)
        }
      }, { status: 200 });
    }
    
  } catch (error: any) {
    console.error('Error al listar mensajes:', error);
    
    return NextResponse.json({ 
      message: "Error al obtener los mensajes",
      error: error.message 
    }, { status: 500 });
  }
} 