import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  ResumenAlertas,
  AlertaSistema,
  EstadosCarga,
  TipoAlerta
} from './types';
import { 
  RESUMEN_ALERTAS_DEFAULT,
  CONFIG_ACTUALIZACION,
  MENSAJES_ALERTA,
  generarAlertaAleatoria
} from './config';

export function useAlertasSistema() {
  // Estados principales
  const [alertaExpandida, setAlertaExpandida] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [estadosCarga, setEstadosCarga] = useState<EstadosCarga>({
    alertas: false,
    accion: false,
    simulacion: false
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

  const { isConnected, sendMessage } = useWebSocket();
  const { toast } = useToast();

  // Filtrar notificaciones basado en criterios
  const notificacionesFiltradas = notifications.filter((notificacion) => {
    const cumpleBusqueda =
      notificacion.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      notificacion.dispositivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
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

  // Manejar expansión/colapso de alertas
  const toggleAlerta = useCallback((id: string) => {
    if (alertaExpandida === id) {
      setAlertaExpandida(null);
    } else {
      setAlertaExpandida(id);
      // Marcar como leída cuando se expande
      markAsRead(id);
    }
  }, [alertaExpandida, markAsRead]);

  // Simular nueva alerta para demostración
  const simularAlerta = useCallback(async () => {
    setEstadosCarga(prev => ({ ...prev, simulacion: true }));
    
    try {
      // Simular delay de generación
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const alertaData = generarAlertaAleatoria();
      
      addNotification(alertaData);

      toast({
        title: "Nueva alerta generada",
        description: alertaData.mensaje,
        variant: alertaData.tipo === "error" ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga(prev => ({ ...prev, simulacion: false }));
    }
  }, [addNotification, toast]);

  // Asignar alerta a técnico
  const asignarAlerta = useCallback(async (alertaId: string) => {
    setEstadosCarga(prev => ({ ...prev, accion: true }));
    
    try {
      // Simular delay de asignación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Alerta asignada",
        description: MENSAJES_ALERTA.asignacionExitosa,
      });

      if (isConnected) {
        sendMessage("assign_alert", {
          alertId: alertaId,
          technicianId: "TECH001",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga(prev => ({ ...prev, accion: false }));
    }
  }, [isConnected, sendMessage, toast]);

  // Resolver alerta
  const resolverAlerta = useCallback(async (alertaId: string) => {
    setEstadosCarga(prev => ({ ...prev, accion: true }));
    
    try {
      // Simular delay de resolución
      await new Promise(resolve => setTimeout(resolve, 500));
      
      markAsRead(alertaId);
      
      toast({
        title: "Alerta resuelta",
        description: MENSAJES_ALERTA.resolucionExitosa,
      });

      if (isConnected) {
        sendMessage("resolve_alert", { alertId: alertaId });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    } finally {
      setEstadosCarga(prev => ({ ...prev, accion: false }));
    }
  }, [markAsRead, isConnected, sendMessage, toast]);

  // Marcar alerta como vista
  const marcarComoVista = useCallback(async (alertaId: string) => {
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
  }, [markAsRead, toast]);

  // Eliminar alerta
  const eliminarAlerta = useCallback(async (alertaId: string) => {
    try {
      removeNotification(alertaId);
      toast({
        title: "Alerta eliminada",
        description: MENSAJES_ALERTA.eliminacionExitosa,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: MENSAJES_ALERTA.errorGeneral,
        variant: "destructive",
      });
    }
  }, [removeNotification, toast]);

  // Marcar todas como leídas
  const marcarTodasLeidas = useCallback(async () => {
    setEstadosCarga(prev => ({ ...prev, accion: true }));
    
    try {
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      setEstadosCarga(prev => ({ ...prev, accion: false }));
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

  // Efecto para actualización automática (opcional)
  useEffect(() => {
    if (!CONFIG_ACTUALIZACION.habilitada) return;

    const interval = setInterval(() => {
      // Aquí se podría hacer polling al servidor para nuevas alertas
      // Por ahora solo es para mantener la conexión WebSocket activa
      console.log("Verificando nuevas alertas...");
    }, CONFIG_ACTUALIZACION.intervalo);

    return () => clearInterval(interval);
  }, []);

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
    isConnected,

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
