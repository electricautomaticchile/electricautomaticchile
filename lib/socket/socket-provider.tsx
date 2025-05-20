'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
  notifications: any[];
  unreadNotificationsCount: number;
  messages: any[];
  unreadMessagesCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  notifications: [],
  unreadNotificationsCount: 0,
  messages: [],
  unreadMessagesCount: 0,
  markNotificationAsRead: () => {},
  markMessageAsRead: () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Inicializar socket.io
  useEffect(() => {
    if (session?.user?.id) {
      // Crear una nueva conexión
      const socketInstance = io({
        path: '/api/socket',
        query: {
          userId: session.user.id
        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      // Guardar la instancia
      setSocket(socketInstance);
      
      // Eventos de conexión
      socketInstance.on('connect', () => {
        console.log('Socket conectado');
        setConnected(true);
      });
      
      socketInstance.on('disconnect', () => {
        console.log('Socket desconectado');
        setConnected(false);
      });
      
      socketInstance.on('connected', (data) => {
        console.log('Conexión confirmada:', data);
      });
      
      // Eventos de notificaciones y mensajes
      socketInstance.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
      });
      
      socketInstance.on('message', (data) => {
        setMessages(prev => [data, ...prev]);
      });
      
      socketInstance.on('conversation-message', (data) => {
        console.log('Nuevo mensaje en conversación:', data);
        // Actualizar UI según sea necesario
      });
      
      // Limpiar al desmontar
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session?.user?.id]);
  
  // Función para marcar notificación como leída
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notificaciones/marcar-leida', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });
      
      if (response.ok) {
        // Actualizar estado local
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, leida: true } 
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };
  
  // Función para marcar mensaje como leído
  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/mensajes/marcar-leido', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });
      
      if (response.ok) {
        // Actualizar estado local
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, leido: true } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
    }
  };
  
  // Función para unirse a una conversación
  const joinConversation = (conversationId: string) => {
    if (socket && connected) {
      socket.emit('join-conversation', conversationId);
    }
  };
  
  // Función para salir de una conversación
  const leaveConversation = (conversationId: string) => {
    if (socket && connected) {
      socket.emit('leave-conversation', conversationId);
    }
  };
  
  // Calcular contadores
  const unreadNotificationsCount = notifications.filter(n => !n.leida).length;
  const unreadMessagesCount = messages.filter(m => !m.leido).length;
  
  return (
    <SocketContext.Provider 
      value={{
        socket,
        connected,
        notifications,
        unreadNotificationsCount,
        messages,
        unreadMessagesCount,
        markNotificationAsRead,
        markMessageAsRead,
        joinConversation,
        leaveConversation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}; 