import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { apiService } from "@/lib/api/apiService";
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
  const { isConnected, deviceData, sendMessage } = useWebSocket();

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
      // En un entorno real, estos datos vendrían del backend
      // const datos = await apiService.getDispositivos();

      // Simulación de delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dispositivosSimulados = generarDispositivosSimulados();
      setDispositivos(dispositivosSimulados);

      const resumen = calcularResumen(dispositivosSimulados);
      setResumenDispositivos(resumen);
    } catch (error) {
      console.error("Error cargando dispositivos:", error);
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
        if (isConnected) {
          sendMessage("device_control", { deviceId: id, action: accion });
        } else {
          // Simular envío de comando vía API REST
          // await apiService.controlarDispositivo(id, accion);
        }

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
        console.error("Error controlando dispositivo:", error);
        toast({
          title: "❌ Error de Control",
          description: MENSAJES.errorComando,
          variant: "destructive",
        });
      }
    },
    [isConnected, sendMessage, toast]
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

  // Efecto para actualización automática
  useEffect(() => {
    if (!AUTO_UPDATE_CONFIG.enabled) return;

    const interval = setInterval(() => {
      cargarDispositivos();
    }, AUTO_UPDATE_CONFIG.interval);

    return () => clearInterval(interval);
  }, [cargarDispositivos]);

  // Efecto para procesar datos de WebSocket
  useEffect(() => {
    if (!deviceData) return;

    const data = deviceData as WebSocketDeviceData;

    setDispositivos((prev) =>
      prev.map((dispositivo) =>
        dispositivo.id === data.dispositivoId
          ? {
              ...dispositivo,
              consumoActual: data.data?.consumo || dispositivo.consumoActual,
              bateria: data.data?.bateria || dispositivo.bateria,
              ultimaTransmision: new Date().toLocaleString("es-CL"),
              estado: "activo",
              temperaturaOperacion:
                data.data?.temperatura || dispositivo.temperaturaOperacion,
              senal: data.data?.senal || dispositivo.senal,
            }
          : dispositivo
      )
    );

    // Recalcular resumen después de actualización WebSocket
    setDispositivos((current) => {
      const resumen = calcularResumen(current);
      setResumenDispositivos(resumen);
      return current;
    });
  }, [deviceData, calcularResumen]);

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
    isWebSocketConnected: isConnected,

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
