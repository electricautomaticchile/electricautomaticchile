import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TokenManager } from "@/lib/api/utils/tokenManager";
import { useApi } from "./useApi";

interface NotificacionCliente {
  _id: string;
  id: string;
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

export function useNotificacionesCliente() {
  const [notificaciones, setNotificaciones] = useState<NotificacionCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isRealAuthenticated } = useApi();

  const cargarNotificaciones = useCallback(async () => {
    if (!isRealAuthenticated) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${apiUrl}/api/notificaciones`;
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
        // Normalizar: el backend devuelve "id", el componente usa "_id"
        // También mapear campos del modelo Go al formato esperado por el componente
        const normalized = (data.data || []).map((n: any) => ({
          ...n,
          _id: n._id || n.id,
          id: n.id || n._id,
          prioridad: n.prioridad || n.severidad || "media",
          categoria: n.categoria || "sistema",
          createdAt: n.createdAt || n.fechaCreacion || new Date().toISOString(),
          metadata: n.metadata || n.metadatos,
        }));
        setNotificaciones(normalized);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [isRealAuthenticated]);

  const marcarComoLeida = useCallback(async (notificacionId: string) => {
    if (!isRealAuthenticated) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/${notificacionId}/marcar-leida`, {
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
  }, [isRealAuthenticated]);

  const eliminarNotificacion = useCallback(async (notificacionId: string) => {
    if (!isRealAuthenticated) return;
    
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
  }, [toast, isRealAuthenticated]);

  const marcarTodasComoLeidas = useCallback(async () => {
    if (!isRealAuthenticated) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = TokenManager.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/notificaciones/marcar-todas-leidas`, {
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
  }, [toast, isRealAuthenticated]);

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
