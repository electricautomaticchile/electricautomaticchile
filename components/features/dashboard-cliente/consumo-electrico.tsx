"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart2,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { apiService } from "@/lib/api/apiService";
import { baseService } from "@/lib/api/utils/baseService";
import { Badge } from "@/components/ui/badge";
import { useApi } from '@/hooks/useApi';
import { HistorialConsumoReal } from "./historial-consumo-real";

interface ConsumoElectricoProps {
  reducida?: boolean;
  clienteId?: string; // Se obtendría del contexto de usuario autenticado
}

interface DatosConsumo {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  consumoActual: number;
  costoEstimado: number;
  consumoPromedio: number;
  consumoMaximo: number;
  consumoMinimo: number;
  tarifaKwh: number;
  datosGrafico?: any[];
  resumen?: {
    dispositivosActivos: number;
    ultimaActualizacion: string;
    tendencia: string;
  };
}

/**
 * Formatear costo en pesos chilenos
 */
const formatearCostoCLP = (costo: number): string => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(costo);
};

export function ConsumoElectrico({
  reducida = false,
  clienteId,
}: ConsumoElectricoProps) {
  const { user, isRealAuthenticated } = useApi();

  const idCliente =
    clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;
  const [datosConsumo, setDatosConsumo] = useState<DatosConsumo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositivoAsignado, setDispositivoAsignado] =
    useState<string>("arduino_uno");

  const [consumoTiempoReal, setConsumoTiempoReal] = useState<number | null>(
    null
  );
  const [costoTiempoReal, setCostoTiempoReal] = useState<number | null>(null);
  const [ultimaActualizacionTiempoReal, setUltimaActualizacionTiempoReal] =
    useState<Date | null>(null);
  const [estaConectado, setEstaConectado] = useState(false);

  useEffect(() => {
    if (!idCliente || !isRealAuthenticated) return;

    const cargarDatosTiempoReal = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/cliente/resumen`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success && data.data?.estadisticas) {
          const stats = data.data.estadisticas;
          setConsumoTiempoReal(stats.consumoMensual || 0);
          setCostoTiempoReal(stats.costoMensual || 0);
          setUltimaActualizacionTiempoReal(new Date());
          setEstaConectado(true);
        }
      } catch (err) {
        setEstaConectado(false);
      }
    };

    cargarDatosTiempoReal();
    const interval = setInterval(cargarDatosTiempoReal, 5000);

    return () => clearInterval(interval);
  }, [idCliente, isRealAuthenticated]);

  useEffect(() => {
    const obtenerDispositivoAsignado = async () => {
      if (!idCliente || !isRealAuthenticated) return;

      try {
        const response = await baseService.get<{
          dispositivoId: string;
          clienteNombre: string;
        }>("/clientes/mi-dispositivo");

        if (response.success && response.data) {
          setDispositivoAsignado(response.data.dispositivoId);
        }
      } catch (err) {
        // Mantener el valor por defecto "arduino_uno"
      }
    };

    obtenerDispositivoAsignado();
  }, [idCliente, isRealAuthenticated]);

  useEffect(() => {
    const cargarDatosConsumo = async () => {
      if (!idCliente || !isRealAuthenticated) {
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/cliente/resumen`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.success && data.data) {
          setDatosConsumo({
            periodo: "mensual",
            fechaInicio: new Date().toISOString(),
            fechaFin: new Date().toISOString(),
            consumoActual: data.data.estadisticas?.consumoMensual || 0,
            costoEstimado: data.data.estadisticas?.costoMensual || 0,
            consumoPromedio: data.data.estadisticas?.consumoMensual || 0,
            consumoMaximo: 0,
            consumoMinimo: 0,
            tarifaKwh: 185,
            resumen: {
              dispositivosActivos: data.data.estadisticas?.dispositivosActivos || 0,
              ultimaActualizacion: new Date().toISOString(),
              tendencia: "Estable",
            },
          });
        } else {
          setError("No hay datos de consumo disponibles");
        }
      } catch (err) {
        setError("Error al cargar datos de consumo");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosConsumo();
  }, [idCliente, isRealAuthenticated]);



  // Loading state
  if (cargando) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600 animate-pulse" />
            Consumo Eléctrico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Error al cargar datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Reintentar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Permitir mostrar datos en tiempo real incluso si datosConsumo no está cargado
  const datosParaMostrar = datosConsumo || {
    consumoActual: consumoTiempoReal || 0,
    costoEstimado: costoTiempoReal || 0,
    consumoPromedio: 0,
    tarifaKwh: 185,
    resumen: {
      dispositivosActivos: 0,
      ultimaActualizacion: ultimaActualizacionTiempoReal?.toISOString() || new Date().toISOString(),
      tendencia: consumoTiempoReal !== null ? "Datos en tiempo real" : "Sin datos",
    },
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Consumo Eléctrico
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {dispositivoAsignado}
              </Badge>
              {estaConectado ? (
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 text-xs"
                >
                  <Wifi className="h-3 w-3 mr-1" />
                  En Vivo
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Desconectado
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Consumo actual y estadísticas en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center justify-between">
                Consumo Actual
                {estaConectado && consumoTiempoReal !== null && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
              <div className="text-2xl font-bold">
                {consumoTiempoReal !== null
                  ? consumoTiempoReal.toFixed(2)
                  : datosParaMostrar.consumoActual}{" "}
                kWh
              </div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                {estaConectado && consumoTiempoReal !== null 
                  ? (datosConsumo?.resumen?.tendencia || "Datos en vivo")
                  : (datosParaMostrar.resumen?.tendencia || "Sin datos")}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center justify-between">
                Costo Estimado
                {estaConectado && costoTiempoReal !== null && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
              <div className="text-2xl font-bold">
                {formatearCostoCLP(
                  costoTiempoReal !== null
                    ? costoTiempoReal
                    : datosParaMostrar.costoEstimado || 0
                )}
              </div>
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {datosParaMostrar.resumen?.dispositivosActivos || 0} dispositivos
                activos
              </div>
            </div>
          </div>

          {estaConectado && ultimaActualizacionTiempoReal && (
            <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Última actualización:{" "}
              {ultimaActualizacionTiempoReal.toLocaleTimeString("es-CL")}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Zap className="h-8 w-8 text-orange-600" />
            Consumo Eléctrico
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoreo en tiempo real de su consumo energético
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Indicador de tiempo real */}
          {estaConectado ? (
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1"
            >
              <Wifi className="h-4 w-4 mr-1" />
              Tiempo Real
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <WifiOff className="h-4 w-4 mr-1" />
              Offline
            </Badge>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Última actualización:{" "}
            {ultimaActualizacionTiempoReal
              ? ultimaActualizacionTiempoReal.toLocaleTimeString("es-CL")
              : datosConsumo?.resumen?.ultimaActualizacion
                ? new Date(
                    datosConsumo.resumen.ultimaActualizacion
                  ).toLocaleTimeString("es-CL")
                : "Sin datos"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Consumo Actual
              {estaConectado && consumoTiempoReal !== null && (
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {consumoTiempoReal !== null
                ? consumoTiempoReal.toFixed(2)
                : datosParaMostrar.consumoActual}{" "}
              kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
              {estaConectado && consumoTiempoReal !== null 
                ? (datosConsumo?.resumen?.tendencia || "Datos en vivo")
                : (datosParaMostrar.resumen?.tendencia || "Sin datos")}
            </div>
            {estaConectado && consumoTiempoReal !== null && (
              <div className="text-xs text-green-600 mt-1">
                Actualizado en tiempo real
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Costo Estimado
              {estaConectado && costoTiempoReal !== null && (
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {formatearCostoCLP(
                costoTiempoReal !== null
                  ? costoTiempoReal
                  : datosParaMostrar.costoEstimado || 0
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Tarifa: ${datosParaMostrar.tarifaKwh}/kWh
            </div>
            {estaConectado && costoTiempoReal !== null && (
              <div className="text-xs text-green-600 mt-1">
                Calculado en tiempo real
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Consumo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {datosParaMostrar.consumoPromedio} kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4 inline mr-1" />
              {datosParaMostrar.resumen?.dispositivosActivos || 0} dispositivos
              activos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Consumo Real */}
      <HistorialConsumoReal clienteId={idCliente} />

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-blue-200 dark:border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-white">
            <BarChart2 className="h-5 w-5 text-orange-600" />
            Análisis Inteligente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Tendencia:
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {datosParaMostrar.resumen?.tendencia || "Sin datos"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Dispositivos activos:
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {datosParaMostrar.resumen?.dispositivosActivos || 0}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Los datos se actualizan automáticamente desde sus dispositivos IoT
              conectados.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
