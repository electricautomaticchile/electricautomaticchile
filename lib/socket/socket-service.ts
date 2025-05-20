import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

// Mapa para almacenar las conexiones de usuarios
type UserSocketMap = {
  [userId: string]: string; // userId -> socketId
};

// Estado global para gestionar las conexiones de los usuarios
export const userSocketMap: UserSocketMap = {};

// Instancia del servidor de Socket.IO
let io: SocketIOServer;

// Inicializa el servidor de Socket.IO
export const initSocketServer = (server: NetServer) => {
  if (!io) {
    console.log('Inicializando servidor Socket.IO...');
    
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', async (socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId) {
        console.log(`Usuario conectado: ${userId}, Socket ID: ${socket.id}`);
        userSocketMap[userId] = socket.id;
        
        // Emitir evento de conexión exitosa
        socket.emit('connected', { success: true });
        
        // Añadir usuario a la sala para recibir notificaciones generales
        socket.join('general');
        
        // Manejar desconexión
        socket.on('disconnect', () => {
          console.log(`Usuario desconectado: ${userId}`);
          delete userSocketMap[userId];
        });
        
        // Manejar eventos personalizados
        socket.on('join-conversation', (conversationId: string) => {
          socket.join(`conversation:${conversationId}`);
          console.log(`Usuario ${userId} unido a la conversación ${conversationId}`);
        });
        
        socket.on('leave-conversation', (conversationId: string) => {
          socket.leave(`conversation:${conversationId}`);
          console.log(`Usuario ${userId} abandonó la conversación ${conversationId}`);
        });
      } else {
        console.log('Conexión rechazada: No se proporcionó ID de usuario');
        socket.disconnect();
      }
    });
  }
  
  return io;
};

// Enviar notificación a un usuario específico
export const sendNotificationToUser = (userId: string, notification: any) => {
  const socketId = userSocketMap[userId];
  
  if (socketId && io) {
    io.to(socketId).emit('notification', notification);
    return true;
  }
  
  return false;
};

// Enviar mensaje a un usuario específico
export const sendMessageToUser = (userId: string, message: any) => {
  const socketId = userSocketMap[userId];
  
  if (socketId && io) {
    io.to(socketId).emit('message', message);
    return true;
  }
  
  return false;
};

// Enviar mensaje a todos los participantes de una conversación
export const sendMessageToConversation = (conversationId: string, message: any) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit('conversation-message', {
      conversationId,
      message
    });
    return true;
  }
  
  return false;
};

// Enviar notificación a todos los usuarios
export const broadcastNotification = (notification: any) => {
  if (io) {
    io.to('general').emit('broadcast-notification', notification);
    return true;
  }
  
  return false;
};

// Verificar si un usuario está conectado
export const isUserConnected = (userId: string): boolean => {
  return !!userSocketMap[userId];
};

// Obtener todos los usuarios conectados
export const getConnectedUsers = (): string[] => {
  return Object.keys(userSocketMap);
}; 