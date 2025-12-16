import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TokenManager } from "@/lib/api/utils/tokenManager";

interface NotificacionCliente {
  _id: string;
  titulo: string;
  mensaje: string;
  tipo: "info" | "success" | "warning" | "error";
  prioridad: "baja" | "media" | "alta" | "urgente";
  categoria: "consumo" | "facturacion" | "dispositivo" | "mantenimiento" | "sistema";
  leida: boolean;
  fechaLectura?: Date;
  accion?: {
    texto: string;
    url: string;
    tipo: "link" | "button";
  };
  metadata?: any;
  createdAt: Date;
}

/**
 * Hook para gestionar notificaciones de cliente
 * Tipos de notificaciones:
 * - Dispositivo desconectado
 * - Fallas en el sistema
 * - Boletas vencidas (3+)
 * - Reporte quincenal de consumo
 */
export function useNotificacionesCliente() {
  const [notificaciones, setNotificaciones] = useState<NotificacionCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Cargar notificaciones desde el backend
   */
  const cargarNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${apiUrl}/api/notificaciones/listar?limite=50`;
      const token = TokenManager.getToken();
      
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones(data.data || []);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar notificación como leída
   */
  const marcarComoLeida = useCallback(async (notificacionId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/${notificacionId}/leer`, {
        method: "PUT",
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones((prev) =>
          prev.map((n) =>
            n._id === notificacionId ? { ...n, leida: true, fechaLectura: new Date() } : n
          )
        );
      }
    } catch (error) {
    }
  }, []);

  /**
   * Eliminar notificación
   */
  const eliminarNotificacion = useCallback(async (notificacionId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/${notificacionId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones((prev) => prev.filter((n) => n._id !== notificacionId));
        toast({
          title: "Notificación eliminada",
          description: "La notificación ha sido eliminada",
        });
      }
    } catch (error) {
    }
  }, [toast]);

  /**
   * Marcar todas como leídas
   */
  const marcarTodasComoLeidas = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/leer-todas`, {
        method: "PUT",
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones((prev) =>
          prev.map((n) => ({ ...n, leida: true, fechaLectura: new Date() }))
        );
        toast({
          title: "✅ Notificaciones marcadas",
          description: `Todas las notificaciones han sido marcadas como leídas`,
        });
      }
    } catch (error) {
    }
  }, [toast]);

  // Cargar notificaciones al montar
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Calcular resumen
  const resumen = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter((n) => !n.leida).length,
    urgentes: notificaciones.filter((n) => n.prioridad === "urgente" && !n.leida).length,
    porTipo: {
      error: notificaciones.filter((n) => n.tipo === "error").length,
      warning: notificaciones.filter((n) => n.tipo === "warning").length,
      info: notificaciones.filter((n) => n.tipo === "info").length,
      success: notificaciones.filter((n) => n.tipo === "success").length,
    },
    porCategoria: {
      consumo: notificaciones.filter((n) => n.categoria === "consumo").length,
      facturacion: notificaciones.filter((n) => n.categoria === "facturacion").length,
      dispositivo: notificaciones.filter((n) => n.categoria === "dispositivo").length,
      mantenimiento: notificaciones.filter((n) => n.categoria === "mantenimiento").length,
      sistema: notificaciones.filter((n) => n.categoria === "sistema").length,
    },
  };

  return {
    notificaciones,
    loading,
    resumen,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    recargar: cargarNotificaciones,
  };
}
