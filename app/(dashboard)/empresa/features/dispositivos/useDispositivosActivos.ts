import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocket, type WSMessage } from "@/lib/websocket/useWebSocket";
import { apiService } from "@/lib/api/apiService";
import { dispositivosService } from "@/lib/api/services/dispositivosService";
import {
  Dispositivo,
  ResumenDispositivos,
  FiltrosDispositivos,
  WebSocketDeviceData,
} from "./types";
import {
  generarDispositivosSimulados,
  AUTO_UPDATE_CONFIG,
  MENSAJES,
} from "./config";

export function useDispositivosActivos() {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [resumenDispositivos, setResumenDispositivos] =
    useState<ResumenDispositivos>({
      total: 0,
      activos: 0,
      inactivos: 0,
      mantenimiento: 0,
      alerta: 0,
      bateriaPromedio: 0,
      senalPromedio: 0,
      consumoTotal: 0,
    });

  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosDispositivos>({
    busqueda: "",
    tabActiva: "todos",
    ordenPor: "nombre",
    ordenDireccion: "asc",
  });

  // Hooks externos
  const { toast } = useToast();
  // const { isConnected, deviceData, sendMessage } = useWebSocket();

  // Calcular resumen de dispositivos
  const calcularResumen = useCallback(
    (dispositivos: Dispositivo[]): ResumenDispositivos => {
      const total = dispositivos.length;
      if (total === 0) {
        return {
          total: 0,
          activos: 0,
          inactivos: 0,
          mantenimiento: 0,
          alerta: 0,
          bateriaPromedio: 0,
          senalPromedio: 0,
          consumoTotal: 0,
        };
      }

      const activos = dispositivos.filter((d) => d.estado === "activo").length;
      const inactivos = dispositivos.filter(
        (d) => d.estado === "inactivo"
      ).length;
      const mantenimiento = dispositivos.filter(
        (d) => d.estado === "mantenimiento"
      ).length;
      const alerta = dispositivos.filter((d) => d.estado === "alerta").length;

      const bateriaPromedio = Math.round(
        dispositivos.reduce((sum, d) => sum + d.bateria, 0) / total
      );

      const senalPromedio = Math.round(
        dispositivos.reduce((sum, d) => sum + (d.senal || 0), 0) / total
      );

      const consumoTotal = dispositivos.reduce(
        (sum, d) => sum + d.consumoActual,
        0
      );

      return {
        total,
        activos,
        inactivos,
        mantenimiento,
        alerta,
        bateriaPromedio,
        senalPromedio,
        consumoTotal,
      };
    },
    []
  );

  // Cargar dispositivos
  const cargarDispositivos = useCallback(async () => {
    setLoading(true);
    try {
      // Llamar a la API real
      const response = await apiService.obtenerDispositivos();

      if (response.success && response.data) {
        // La API devuelve { dispositivos: [], pagination: {} }
        const responseData = response.data as any;
        const dispositivosBackend = Array.isArray(responseData.dispositivos)
          ? (responseData.dispositivos as unknown as Dispositivo[])
          : Array.isArray(responseData)
          ? (responseData as unknown as Dispositivo[])
          : [];

        // Mapear dispositivos del backend al formato esperado por el frontend
        const dispositivosMapeados = dispositivosBackend.map((d: any) => ({
          id: d._id?.toString() || d.id,
          nombre: d.nombre || "Dispositivo sin nombre",
          numeroDispositivo: d.numeroDispositivo || d.id,
          estado: d.estado || "inactivo",
          ubicacion: d.ubicacion || "Sin ubicación",
          consumoActual: d.ultimaLectura?.energia || 0,
          bateria: 100, // Valor por defecto si no está disponible
          senal: 85, // Valor por defecto si no está disponible
          ultimaTransmision: d.ultimaConexion ? new Date(d.ultimaConexion).toLocaleString("es-CL") : "Nunca",
          temperaturaOperacion: d.ultimaLectura?.temperatura || 0,
          cliente: d.cliente || null,
          empresa: d.empresa || null,
          tipoConexion: d.tipoConexion || "wifi",
          firmware: d.firmware || "1.0.0",
        }));

        setDispositivos(dispositivosMapeados as Dispositivo[]);
        const resumen = calcularResumen(dispositivosMapeados);
        setResumenDispositivos(resumen);
      } else {
        // Fallback a simulación si la API falla o devuelve datos inválidos
        const dispositivosSimulados = generarDispositivosSimulados();
        setDispositivos(dispositivosSimulados);

        const resumen = calcularResumen(dispositivosSimulados);
        setResumenDispositivos(resumen);
      }
    } catch (error) {
      
      // Usar datos simulados en caso de error
      const dispositivosSimulados = generarDispositivosSimulados();
      setDispositivos(dispositivosSimulados);
      const resumen = calcularResumen(dispositivosSimulados);
      setResumenDispositivos(resumen);
      
      toast({
        title: "❌ Error de Carga",
        description: MENSAJES.errorCarga,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [calcularResumen, toast]);

  // Filtrar dispositivos
  const dispositivosFiltrados = useCallback(() => {
    return dispositivos.filter((dispositivo) => {
      // Filtro de búsqueda
      const cumpleBusqueda =
        filtros.busqueda === "" ||
        dispositivo.nombre
          .toLowerCase()
          .includes(filtros.busqueda.toLowerCase()) ||
        dispositivo.id.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        dispositivo.ubicacion
          .toLowerCase()
          .includes(filtros.busqueda.toLowerCase());

      // Filtro de tab/estado
      const cumpleTab =
        filtros.tabActiva === "todos" ||
        dispositivo.estado === filtros.tabActiva;

      return cumpleBusqueda && cumpleTab;
    });
  }, [dispositivos, filtros]);

  // Controlar dispositivo
  const controlarDispositivo = useCallback(
    async (id: string, accion: string) => {
      try {
        // Enviar comando vía WebSocket si está conectado
        /* if (isConnected) { // COMENTADO
          sendMessage("device_control", { deviceId: id, action: accion });
        } else { */
        await dispositivosService.controlarDispositivo(id, accion as any);
        // }

        toast({
          title: "✅ Comando Enviado",
          description: `Acción "${accion}" enviada al dispositivo ${id}`,
        });

        // Simular actualización del estado local
        setTimeout(() => {
          setDispositivos((prev) =>
            prev.map((dispositivo) =>
              dispositivo.id === id
                ? {
                    ...dispositivo,
                    ultimaTransmision: new Date().toLocaleString("es-CL"),
                    estado:
                      accion === "shutdown"
                        ? "inactivo"
                        : accion === "restart"
                          ? "activo"
                          : dispositivo.estado,
                  }
                : dispositivo
            )
          );
        }, 1000);
      } catch (error) {
        toast({
          title: "❌ Error de Control",
          description: MENSAJES.errorComando,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Actualizar filtros
  const actualizarFiltros = useCallback(
    (nuevosFiltros: Partial<FiltrosDispositivos>) => {
      setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
    },
    []
  );

  // Cambiar búsqueda
  const cambiarBusqueda = useCallback(
    (busqueda: string) => {
      actualizarFiltros({ busqueda });
    },
    [actualizarFiltros]
  );

  // Cambiar tab activa
  const cambiarTabActiva = useCallback(
    (tabActiva: string) => {
      actualizarFiltros({ tabActiva });
    },
    [actualizarFiltros]
  );

  // Refrescar datos manualmente
  const refrescarDatos = useCallback(async () => {
    await cargarDispositivos();
  }, [cargarDispositivos]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarDispositivos();
  }, [cargarDispositivos]);

  // Efecto para actualización automática - DESACTIVADO
  // Ahora solo se actualiza manualmente con el botón de refrescar
  /* useEffect(() => {
    if (!AUTO_UPDATE_CONFIG.enabled) return;

    const interval = setInterval(() => {
      cargarDispositivos();
    }, AUTO_UPDATE_CONFIG.interval);

    return () => clearInterval(interval);
  }, [cargarDispositivos]); */

  // Efecto para procesar datos de WebSocket en tiempo real
  const handleWsMessage = useCallback((msg: WSMessage) => {
    if (msg.type !== "device_update" || !msg.data) return;
    const data = msg.data as any;
    const deviceId = data.idDispositivo;
    if (!deviceId) return;

    setDispositivos((prev) => {
      let changed = false;
      const updated = prev.map((dispositivo) => {
        if (dispositivo.numeroDispositivo !== deviceId && dispositivo.id !== deviceId) return dispositivo;
        const newConsumo = data.energia ?? dispositivo.consumoActual;
        // Solo actualizar si el valor cambió significativamente (evita re-renders innecesarios)
        if (Math.abs(newConsumo - dispositivo.consumoActual) < 0.0001) return dispositivo;
        changed = true;
        return {
          ...dispositivo,
          consumoActual: newConsumo,
          ultimaTransmision: new Date().toLocaleString("es-CL"),
          estado: "activo" as const,
        };
      });
      return changed ? updated : prev;
    });
  }, []);

  const { connected: wsConnected } = useWebSocket({
    enabled: true,
    onMessage: handleWsMessage,
  });

  // Recalcular resumen cuando cambian los dispositivos
  useEffect(() => {
    const resumen = calcularResumen(dispositivos);
    setResumenDispositivos(resumen);
  }, [dispositivos, calcularResumen]);

  return {
    // Estados
    loading,
    dispositivos: dispositivosFiltrados(),
    dispositivosOriginales: dispositivos,
    resumenDispositivos,
    filtros,
    isWebSocketConnected: wsConnected,

    // Acciones
    cargarDispositivos,
    controlarDispositivo,
    cambiarBusqueda,
    cambiarTabActiva,
    actualizarFiltros,
    refrescarDatos,

    // Métodos de utilidad
    calcularResumen,
  };
}
