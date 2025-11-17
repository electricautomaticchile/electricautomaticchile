import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TokenManager } from "@/lib/api/utils/tokenManager";

interface Notificacion {
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
 * Hook para gestionar notificaciones de empresa en tiempo real
 * Conecta con el backend de MongoDB y WebSocket
 */
export function useNotificacionesEmpresa() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    noLeidas: 0,
    porCategoria: {},
    porPrioridad: {},
  });

  const { toast } = useToast();

  // Obtener ID de la empresa del usuario autenticado (desde localStorage o contexto)
  // TODO: Integrar con sistema de autenticación real
  const empresaId = "60d5ec49e03e8a2788d3d9d3"; // ID de empresa demo
  const estaConectado = true; // TODO: Implementar estado de WebSocket real

  /**
   * Cargar notificaciones desde el backend
   */
  const cargarNotificaciones = useCallback(async () => {
    if (!empresaId) {
      console.log("[NotificacionesEmpresa] No hay empresaId, saltando carga");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${apiUrl}/api/notificaciones/listar?limite=100`;
      const token = TokenManager.getToken();
      
      console.log("[NotificacionesEmpresa] Cargando notificaciones desde:", url);
      console.log("[NotificacionesEmpresa] Token presente:", !!token);
      
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

      console.log("[NotificacionesEmpresa] Response status:", response.status);
      
      const data = await response.json();
      console.log("[NotificacionesEmpresa] Response data:", data);

      if (data.success) {
        console.log("[NotificacionesEmpresa] Notificaciones cargadas:", data.data?.length || 0);
        setNotificaciones(data.data || []);
      } else {
        console.error("[NotificacionesEmpresa] Error en respuesta:", data.message);
        toast({
          title: "Error cargando notificaciones",
          description: data.message || "No se pudieron cargar las notificaciones",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[NotificacionesEmpresa] Error cargando notificaciones:", error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [empresaId, toast]);

  /**
   * Cargar estadísticas de notificaciones
   */
  const cargarEstadisticas = useCallback(async () => {
    if (!empresaId) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/estadisticas`, {
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  }, [empresaId]);

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
        // Actualizar estado local
        setNotificaciones((prev) =>
          prev.map((n) =>
            n._id === notificacionId ? { ...n, leida: true, fechaLectura: new Date() } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
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
        // Actualizar estado local
        setNotificaciones((prev) =>
          prev.map((n) => ({ ...n, leida: true, fechaLectura: new Date() }))
        );

        toast({
          title: "✅ Notificaciones marcadas",
          description: `${data.cantidad} notificaciones marcadas como leídas`,
        });
      }
    } catch (error) {
      console.error("Error marcando todas como leídas:", error);
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones",
        variant: "destructive",
      });
    }
  }, [toast]);

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
        // Actualizar estado local
        setNotificaciones((prev) => prev.filter((n) => n._id !== notificacionId));

        toast({
          title: "Notificación eliminada",
          description: "La notificación ha sido eliminada",
        });
      }
    } catch (error) {
      console.error("Error eliminando notificación:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      });
    }
  }, [toast]);

  /**
   * Manejar nueva notificación desde WebSocket
   * TODO: Implementar cuando el WebSocket esté disponible
   */
  const manejarNuevaNotificacion = useCallback((data: Notificacion) => {
    console.log("[NotificacionesEmpresa] Nueva notificación recibida:", data);

    // Agregar al inicio de la lista
    setNotificaciones((prev) => [data, ...prev]);

    // Mostrar toast según prioridad
    const variant = data.tipo === "error" ? "destructive" : "default";
    
    toast({
      title: data.titulo,
      description: data.mensaje,
      variant,
      duration: data.prioridad === "urgente" ? 10000 : 5000,
    });

    // Actualizar estadísticas
    cargarEstadisticas();
  }, [toast, cargarEstadisticas]);

  // TODO: Escuchar eventos de WebSocket para nuevas notificaciones
  // useWebSocket<Notificacion>("notificacion:nueva", manejarNuevaNotificacion);

  // Cargar notificaciones al montar
  useEffect(() => {
    if (empresaId) {
      cargarNotificaciones();
      cargarEstadisticas();
    }
  }, [empresaId, cargarNotificaciones, cargarEstadisticas]);

  // Calcular resumen
  const resumen = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter((n) => !n.leida).length,
    urgentes: notificaciones.filter((n) => n.prioridad === "urgente" && !n.leida).length,
    altas: notificaciones.filter((n) => n.prioridad === "alta" && !n.leida).length,
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
    estadisticas,
    resumen,
    estaConectado,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    recargar: cargarNotificaciones,
  };
}
