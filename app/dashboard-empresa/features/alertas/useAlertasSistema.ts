import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
// import { useWebSocket } from "@/hooks/useWebSocket"; // COMENTADO
import { apiService } from "@/lib/api/apiService"; // API REAL
import {
  ResumenAlertas,
  AlertaSistema,
  EstadosCarga,
  TipoAlerta,
} from "./types";
import {
  RESUMEN_ALERTAS_DEFAULT,
  CONFIG_ACTUALIZACION,
  MENSAJES_ALERTA,
  generarAlertaAleatoria,
} from "./config";

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

  // Hooks externos
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadImportant,
  } = useNotifications();

  // const { isConnected, sendMessage } = useWebSocket(); // COMENTADO
  const { toast } = useToast();

  // Estado de la empresa actual (obtener del contexto o del usuario)
  const empresaId = "60d5ec49e03e8a2788d3d9d3"; // TODO: Reemplazar con ID de empresa del contexto de autenticación

  // Filtrar notificaciones basado en criterios
  const notificacionesFiltradas = notifications.filter((notificacion) => {
    const cumpleBusqueda =
      notificacion.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      notificacion.dispositivo
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      notificacion.ubicacion?.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleTipo =
      filtroTipo === "todos" || notificacion.tipo === filtroTipo;

    const cumpleEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "leidas" && notificacion.leida) ||
      (filtroEstado === "no_leidas" && !notificacion.leida);

    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

  // Calcular resumen de alertas
  const resumenAlertas: ResumenAlertas = {
    total: notifications.length,
    errorCritico: notifications.filter((n) => n.tipo === "error").length,
    advertencia: notifications.filter((n) => n.tipo === "advertencia").length,
    informacion: notifications.filter((n) => n.tipo === "informacion").length,
    exito: notifications.filter((n) => n.tipo === "exito").length,
    noLeidas: unreadCount,
    importantes: getUnreadImportant().length,
    resueltas: notifications.filter((n) => n.leida).length,
  };

  // Cargar alertas desde el backend
  const cargarAlertas = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, alertas: true }));

    try {
      const response = await apiService.obtenerAlertasPorEmpresa(
        empresaId,
        false
      );

      if (response.success && response.data?.data) {
        // Convertir alertas del backend al formato de notificaciones
        response.data.data.forEach((alerta: any) => {
          addNotification({
            tipo: alerta.tipo,
            mensaje: alerta.mensaje,
            dispositivo: alerta.dispositivo,
            ubicacion: alerta.ubicacion,
            importante: alerta.importante,
          });
        });
      }
    } catch (error) {
      console.error("Error cargando alertas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas",
        variant: "destructive",
      });
    } finally {
      setEstadosCarga((prev) => ({ ...prev, alertas: false }));
    }
  }, [empresaId, addNotification, toast]);

  // Manejar expansión/colapso de alertas
  const toggleAlerta = useCallback(
    (id: string) => {
      if (alertaExpandida === id) {
        setAlertaExpandida(null);
      } else {
        setAlertaExpandida(id);
        // Marcar como leída cuando se expande
        markAsRead(id);
      }
    },
    [alertaExpandida, markAsRead]
  );

  // Simular nueva alerta (usar API real)
  const simularAlerta = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, simulacion: true }));

    try {
      const response = await apiService.simularAlerta();

      if (response.success && response.data?.data) {
        const alerta = response.data.data;

        addNotification({
          tipo: alerta.tipo as TipoAlerta,
          mensaje: alerta.mensaje,
          dispositivo: alerta.dispositivo,
          ubicacion: alerta.ubicacion,
          importante: alerta.importante,
        });

        toast({
          title: "Nueva alerta generada",
          description: alerta.mensaje,
          variant: alerta.tipo === "error" ? "destructive" : "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga((prev) => ({ ...prev, simulacion: false }));
    }
  }, [addNotification, toast]);

  // Asignar alerta a técnico (API real)
  const asignarAlerta = useCallback(
    async (alertaId: string) => {
      setEstadosCarga((prev) => ({ ...prev, accion: true }));

      try {
        const response = await apiService.asignarAlerta(alertaId, "TECH001");

        if (response.success) {
          toast({
            title: "Alerta asignada",
            description: MENSAJES_ALERTA.asignacionExitosa,
          });

          /* if (isConnected) { // COMENTADO
            sendMessage("assign_alert", {
              alertId: alertaId,
              technicianId: "TECH001",
            });
          } */
        }
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
    [toast]
  );

  // Resolver alerta (API real)
  const resolverAlerta = useCallback(
    async (alertaId: string) => {
      setEstadosCarga((prev) => ({ ...prev, accion: true }));

      try {
        const response = await apiService.resolverAlerta(
          alertaId,
          "Resuelta desde dashboard"
        );

        if (response.success) {
          markAsRead(alertaId);

          toast({
            title: "Alerta resuelta",
            description: MENSAJES_ALERTA.resolucionExitosa,
          });

          /* if (isConnected) { // COMENTADO
            sendMessage("resolve_alert", { alertId: alertaId });
          } */
        }
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
    [markAsRead, toast]
  );

  // Marcar alerta como vista
  const marcarComoVista = useCallback(
    async (alertaId: string) => {
      try {
        markAsRead(alertaId);
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
    [markAsRead, toast]
  );

  // Eliminar alerta (API real)
  const eliminarAlerta = useCallback(
    async (alertaId: string) => {
      try {
        const response = await apiService.eliminarAlerta(alertaId);

        if (response.success) {
          removeNotification(alertaId);
          toast({
            title: "Alerta eliminada",
            description: MENSAJES_ALERTA.eliminacionExitosa,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: MENSAJES_ALERTA.errorGeneral,
          variant: "destructive",
        });
      }
    },
    [removeNotification, toast]
  );

  // Marcar todas como leídas
  const marcarTodasLeidas = useCallback(async () => {
    setEstadosCarga((prev) => ({ ...prev, accion: true }));

    try {
      // Simular delay para UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      markAllAsRead();

      toast({
        title: "Todas las alertas marcadas como leídas",
        description: `${resumenAlertas.noLeidas} alertas han sido marcadas como leídas`,
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
  }, [markAllAsRead, toast, resumenAlertas.noLeidas]);

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

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas();
  }, [cargarAlertas]);

  // Efecto para actualización automática
  useEffect(() => {
    if (!CONFIG_ACTUALIZACION.habilitada) return;

    const interval = setInterval(() => {
      cargarAlertas();
    }, CONFIG_ACTUALIZACION.intervalo);

    return () => clearInterval(interval);
  }, [cargarAlertas]);

  // Efecto para limpiar alerta expandida al cambiar filtros
  useEffect(() => {
    setAlertaExpandida(null);
  }, [filtroTipo, filtroEstado, busqueda]);

  return {
    // Estados
    alertaExpandida,
    busqueda,
    filtroTipo,
    filtroEstado,
    estadosCarga,
    notificacionesFiltradas,
    resumenAlertas,
    isConnected: false, // Devolver un valor estático

    // Acciones de alerta
    toggleAlerta,
    simularAlerta,
    asignarAlerta,
    resolverAlerta,
    marcarComoVista,
    eliminarAlerta,
    marcarTodasLeidas,

    // Filtros y búsqueda
    cambiarFiltroTipo,
    cambiarFiltroEstado,
    cambiarBusqueda,
    limpiarFiltros,

    // Utilidades
    clearAll,
    loading: estadosCarga.alertas || estadosCarga.accion,
  };
}
