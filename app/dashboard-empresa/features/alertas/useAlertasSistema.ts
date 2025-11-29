import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNotificaciones } from "../../context/NotificacionesContext";
import {
  ResumenAlertas,
  AlertaSistema,
  EstadosCarga,
  TipoAlerta,
} from "./types";
import {
  MENSAJES_ALERTA,
} from "./config";

/**
 * Mapear notificación de MongoDB a formato AlertaSistema
 */
function mapearNotificacion(notif: any): AlertaSistema {
  // Mapear tipo de notificación a tipo de alerta
  const tipoMap: Record<string, TipoAlerta> = {
    error: "error",
    warning: "advertencia",
    info: "informacion",
    success: "exito",
  };

  const fecha = new Date(notif.createdAt);

  return {
    id: notif._id,
    tipo: tipoMap[notif.tipo] || "informacion",
    mensaje: notif.mensaje,
    fecha: fecha.toLocaleDateString("es-CL"),
    hora: fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
    dispositivo: notif.metadata?.dispositivoId || notif.metadata?.nombreDispositivo,
    ubicacion: notif.metadata?.area || notif.metadata?.region || notif.metadata?.comuna,
    importante: notif.prioridad === "urgente" || notif.prioridad === "alta",
    leida: notif.leida,
  };
}

export function useAlertasSistema() {
  // Estados principales
  const [alertaExpandida, setAlertaExpandida] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [estadosCarga, setEstadosCarga] = useState<EstadosCarga>({
    alertas: false,
    accion: false,
    simulacion: false,
  });

  // Hook de notificaciones en tiempo real
  const {
    notificaciones,
    loading: loadingNotificaciones,
    resumen: resumenNotificaciones,
    estaConectado,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    recargar,
  } = useNotificaciones();

  const { toast } = useToast();

  // Mapear notificaciones de MongoDB a formato AlertaSistema
  const alertasMapeadas = useMemo(
    () => notificaciones.map(mapearNotificacion),
    [notificaciones]
  );

  // Filtrar alertas basado en criterios
  const notificacionesFiltradas = useMemo(() => {
    return alertasMapeadas.filter((alerta) => {
      const cumpleBusqueda =
        alerta.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
        alerta.dispositivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        alerta.ubicacion?.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleTipo = filtroTipo === "todos" || alerta.tipo === filtroTipo;

      const cumpleEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "leidas" && alerta.leida) ||
        (filtroEstado === "no_leidas" && !alerta.leida);

      return cumpleBusqueda && cumpleTipo && cumpleEstado;
    });
  }, [alertasMapeadas, busqueda, filtroTipo, filtroEstado]);

  // Calcular resumen de alertas
  const resumenAlertas: ResumenAlertas = useMemo(() => {
    return {
      total: alertasMapeadas.length,
      errorCritico: alertasMapeadas.filter((n) => n.tipo === "error").length,
      advertencia: alertasMapeadas.filter((n) => n.tipo === "advertencia").length,
      informacion: alertasMapeadas.filter((n) => n.tipo === "informacion").length,
      exito: alertasMapeadas.filter((n) => n.tipo === "exito").length,
      noLeidas: alertasMapeadas.filter((n) => !n.leida).length,
      importantes: alertasMapeadas.filter((n) => n.importante && !n.leida).length,
      resueltas: alertasMapeadas.filter((n) => n.leida).length,
    };
  }, [alertasMapeadas]);

  // Recargar alertas (usa el hook de notificaciones)
  const cargarAlertas = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, alertas: true }));
    try {
      await recargar();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron recargar las alertas",
        variant: "destructive",
      });
    } finally {
      setEstadosCarga((prev) => ({ ...prev, alertas: false }));
    }
  }, [recargar, toast]);

  // Manejar expansión/colapso de alertas
  const toggleAlerta = useCallback(
    (id: string) => {
      if (alertaExpandida === id) {
        setAlertaExpandida(null);
      } else {
        setAlertaExpandida(id);
        // Marcar como leída cuando se expande
        marcarComoLeida(id);
      }
    },
    [alertaExpandida, marcarComoLeida]
  );

  // Simular nueva alerta (para testing)
  const simularAlerta = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, simulacion: true }));

    try {
      // Recargar notificaciones para obtener las más recientes
      await recargar();

      toast({
        title: "Alertas actualizadas",
        description: "Se han cargado las últimas notificaciones",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga((prev) => ({ ...prev, simulacion: false }));
    }
  }, [recargar, toast]);

  // Asignar alerta a técnico
  const asignarAlerta = useCallback(
    async (alertaId: string) => {
      setEstadosCarga((prev) => ({ ...prev, accion: true }));

      try {
        // Marcar como leída al asignar
        await marcarComoLeida(alertaId);

        toast({
          title: "Alerta asignada",
          description: MENSAJES_ALERTA.asignacionExitosa,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: MENSAJES_ALERTA.errorGeneral,
          variant: "destructive",
        });
      } finally {
        setEstadosCarga((prev) => ({ ...prev, accion: false }));
      }
    },
    [marcarComoLeida, toast]
  );

  // Resolver alerta
  const resolverAlerta = useCallback(
    async (alertaId: string) => {
      setEstadosCarga((prev) => ({ ...prev, accion: true }));

      try {
        await marcarComoLeida(alertaId);

        toast({
          title: "Alerta resuelta",
          description: MENSAJES_ALERTA.resolucionExitosa,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: MENSAJES_ALERTA.errorGeneral,
          variant: "destructive",
        });
      } finally {
        setEstadosCarga((prev) => ({ ...prev, accion: false }));
      }
    },
    [marcarComoLeida, toast]
  );

  // Marcar alerta como vista
  const marcarComoVista = useCallback(
    async (alertaId: string) => {
      try {
        await marcarComoLeida(alertaId);
        toast({
          title: "Alerta marcada como vista",
          description: "La alerta ha sido marcada como leída",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: MENSAJES_ALERTA.errorGeneral,
          variant: "destructive",
        });
      }
    },
    [marcarComoLeida, toast]
  );

  // Eliminar alerta
  const eliminarAlerta = useCallback(
    async (alertaId: string) => {
      try {
        await eliminarNotificacion(alertaId);
      } catch (error) {
        toast({
          title: "Error",
          description: MENSAJES_ALERTA.errorGeneral,
          variant: "destructive",
        });
      }
    },
    [eliminarNotificacion, toast]
  );

  // Marcar todas como leídas
  const marcarTodasLeidas = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, accion: true }));

    try {
      await marcarTodasComoLeidas();
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga((prev) => ({ ...prev, accion: false }));
    }
  }, [marcarTodasComoLeidas, toast]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltroTipo("todos");
    setFiltroEstado("todos");
    setBusqueda("");
  }, []);

  // Manejar cambios de filtros
  const cambiarFiltroTipo = useCallback((tipo: string) => {
    setFiltroTipo(tipo);
  }, []);

  const cambiarFiltroEstado = useCallback((estado: string) => {
    setFiltroEstado(estado);
  }, []);

  const cambiarBusqueda = useCallback((termino: string) => {
    setBusqueda(termino);
  }, []);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(async () => {
    // Por ahora solo recarga, en el futuro podría eliminar todas
    await recargar();
  }, [recargar]);

  // Efecto para limpiar alerta expandida al cambiar filtros
  useEffect(() => {
    setAlertaExpandida(null);
  }, [filtroTipo, filtroEstado, busqueda]);

  return {
    // Estados
    alertas: notificacionesFiltradas,
    resumenAlertas,
    alertaExpandida,
    estadosCarga: {
      ...estadosCarga,
      alertas: loadingNotificaciones,
    },
    filtros: {
      busqueda,
      tipo: filtroTipo,
      estado: filtroEstado,
    },

    // Acciones principales
    cargarAlertas,
    simularAlerta,
    asignarAlerta,
    resolverAlerta,
    marcarComoVista,
    eliminarAlerta,
    marcarTodasLeidas,
    clearAll,

    // Navegación y filtros
    toggleAlerta,
    limpiarFiltros,
    cambiarFiltroTipo,
    cambiarFiltroEstado,
    cambiarBusqueda,

    // Estado de conexión WebSocket
    isConnected: estaConectado,
  };
}
