// Hook temporal para reemplazar funcionalidades de socket

interface Notificacion {
  id: string;
  tipo: 'info' | 'alerta' | 'warning';
  titulo: string;
  descripcion: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
}

interface Mensaje {
  id: string;
  emisorNombre: string;
  contenido: string;
  fecha: Date;
  leido: boolean;
}

export const useSocket = () => {
  return {
    socket: null,
    connected: false,
    notifications: [] as Notificacion[],
    unreadNotificationsCount: 0,
    messages: [] as Mensaje[],
    unreadMessagesCount: 0,
    markNotificationAsRead: () => {},
    markMessageAsRead: () => {},
    joinConversation: () => {},
    leaveConversation: () => {},
  };
}; 