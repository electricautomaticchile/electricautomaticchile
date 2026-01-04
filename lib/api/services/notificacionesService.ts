import { baseService } from "../utils/baseService";

export interface Notificacion {
  id: string;
  destinatarioId: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
}

class NotificacionesService {
  async obtenerNotificaciones(): Promise<{
    success: boolean;
    data?: Notificacion[];
    error?: string;
  }> {
    try {
      const response = await baseService.get<Notificacion[]>("/notificaciones");
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error al obtener notificaciones",
      };
    }
  }

  async marcarComoLeida(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await baseService.put(`/notificaciones/${id}/marcar-leida`, {});
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error al marcar notificación como leída",
      };
    }
  }

  async marcarTodasComoLeidas(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await baseService.put("/notificaciones/marcar-todas-leidas", {});
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error al marcar todas las notificaciones como leídas",
      };
    }
  }

  async eliminarNotificacion(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await baseService.delete(`/notificaciones/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error al eliminar notificación",
      };
    }
  }

  async obtenerEstadisticas(): Promise<{
    success: boolean;
    data?: {
      total: number;
      noLeidas: number;
      porTipo: Record<string, number>;
    };
    error?: string;
  }> {
    try {
      const response = await baseService.get<{
        total: number;
        noLeidas: number;
        porTipo: Record<string, number>;
      }>("/notificaciones/estadisticas");
      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error al obtener estadísticas",
      };
    }
  }
}

export const notificacionesService = new NotificacionesService();
