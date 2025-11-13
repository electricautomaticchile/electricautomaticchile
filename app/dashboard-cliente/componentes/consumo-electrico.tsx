"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useWebSocket } from "@/lib/websocket/useWebSocket";
import type { ActualizacionPotenciaDispositivo } from "@/lib/websocket/tipos";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/hooks/useApi";

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

export function ConsumoElectrico({
  reducida = false,
  clienteId,
}: ConsumoElectricoProps) {
  // Obtener el usuario autenticado
  const { user } = useApi();

  // Usar el ID del usuario autenticado o el clienteId proporcionado
  const idCliente =
    clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");
  const [añoSeleccionado, setAñoSeleccionado] = useState("2023");
  const [mesSeleccionado, setMesSeleccionado] = useState("Noviembre");
  const [datosConsumo, setDatosConsumo] = useState<DatosConsumo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para datos en tiempo real
  const [consumoTiempoReal, setConsumoTiempoReal] = useState<number | null>(
    null
  );
  const [costoTiempoReal, setCostoTiempoReal] = useState<number | null>(null);
  const [ultimaActualizacionTiempoReal, setUltimaActualizacionTiempoReal] =
    useState<Date | null>(null);

  // Hook de WebSocket
  const { estaConectado } = useWebSocket();

  /**
   * Manejar actualizaciones de potencia en tiempo real
   */
  const manejarActualizacionPotencia = useCallback(
    (datos: ActualizacionPotenciaDispositivo) => {
      console.log(
        "[ConsumoElectrico] Actualización de potencia recibida:",
        datos
      );

      // Actualizar consumo en tiempo real (convertir W a kWh)
      const consumoKwh = datos.energia || datos.potenciaActiva / 1000;
      setConsumoTiempoReal(consumoKwh);

      // Actualizar costo en tiempo real
      if (datos.costo !== undefined) {
        setCostoTiempoReal(datos.costo);
      } else if (datosConsumo?.tarifaKwh) {
        // Calcular costo si no viene en los datos
        setCostoTiempoReal(consumoKwh * datosConsumo.tarifaKwh);
      }

      // Actualizar timestamp
      setUltimaActualizacionTiempoReal(new Date(datos.marcaTiempo));

      // Actualizar también los datos de consumo si están disponibles
      if (datosConsumo) {
        setDatosConsumo({
          ...datosConsumo,
          consumoActual: consumoKwh,
          costoEstimado: datos.costo || consumoKwh * datosConsumo.tarifaKwh,
          resumen: datosConsumo.resumen
            ? {
                ...datosConsumo.resumen,
                ultimaActualizacion: datos.marcaTiempo,
              }
            : {
                dispositivosActivos: 0,
                ultimaActualizacion: datos.marcaTiempo,
                tendencia: "Sin datos",
              },
        });
      }
    },
    [datosConsumo]
  );

  // Escuchar eventos de actualización de potencia
  useWebSocket<ActualizacionPotenciaDispositivo>(
    "dispositivo:actualizacion_potencia",
    manejarActualizacionPotencia
  );

  // Cargar datos desde la API
  useEffect(() => {
    const cargarDatosConsumo = async () => {
      // No cargar si no hay un ID de cliente válido
      if (!idCliente) {
        setCargando(false);
        setError("No se pudo identificar al cliente");
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const parametros = {
          periodo: periodoSeleccionado as "mensual" | "diario" | "horario",
          año: parseInt(añoSeleccionado),
          ...(periodoSeleccionado === "diario" && {
            mes: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ].indexOf(mesSeleccionado),
          }),
        };

        const response = await apiService.obtenerEstadisticasConsumoCliente(
          idCliente,
          parametros
        );

        if (response.success && response.data) {
          setDatosConsumo(response.data);
        } else {
          setError(response.message || "Error al cargar datos de consumo");
        }
      } catch (err) {
        console.error("Error cargando datos de consumo:", err);
        setError("Error de conexión al cargar datos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosConsumo();
  }, [idCliente, periodoSeleccionado, añoSeleccionado, mesSeleccionado]);

  // Renderizar gráfico usando los datos de la API
  const renderizarGrafico = () => {
    if (
      !datosConsumo ||
      !datosConsumo.datosGrafico ||
      !datosConsumo.datosGrafico.length
    ) {
      return (
        <div className="h-60 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      );
    }

    const datos = datosConsumo.datosGrafico;
    const maxConsumo = Math.max(...datos.map((d) => d.consumo));

    return (
      <div className="h-60 flex items-end space-x-2 mt-4">
        {datos.map((dato, index) => {
          const altura = maxConsumo > 0 ? (dato.consumo / maxConsumo) * 100 : 0;
          let etiqueta = "";

          if ("mes" in dato) {
            etiqueta = dato.mes.substring(0, 3);
          } else if ("dia" in dato) {
            etiqueta = dato.dia.substring(0, 3);
          } else if ("hora" in dato) {
            etiqueta = dato.hora;
          }

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-orange-500 rounded-t-sm transition-all hover:bg-orange-600"
                style={{ height: `${altura}%` }}
                title={`${etiqueta}: ${dato.consumo} kWh`}
              ></div>
              <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                {etiqueta}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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

  if (!datosConsumo) return null;

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Consumo Eléctrico
            {estaConectado && (
              <Badge
                variant="default"
                className="ml-auto bg-green-500 hover:bg-green-600 text-xs"
              >
                <Wifi className="h-3 w-3 mr-1" />
                En Vivo
              </Badge>
            )}
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
                  : datosConsumo.consumoActual}{" "}
                kWh
              </div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                {datosConsumo.resumen?.tendencia || "Sin datos"}
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
                $
                {(costoTiempoReal !== null
                  ? costoTiempoReal
                  : datosConsumo.costoEstimado || 0
                ).toLocaleString("es-CL")}
              </div>
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {datosConsumo.resumen?.dispositivosActivos || 0} dispositivos
                activos
              </div>
            </div>
          </div>

          <div className="h-28 mt-4">{renderizarGrafico()}</div>

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
              : datosConsumo.resumen?.ultimaActualizacion
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
                : datosConsumo.consumoActual}{" "}
              kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
              {datosConsumo.resumen?.tendencia || "Sin datos"}
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
              $
              {(costoTiempoReal !== null
                ? costoTiempoReal
                : datosConsumo.costoEstimado || 0
              ).toLocaleString("es-CL")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Tarifa: ${datosConsumo.tarifaKwh}/kWh
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
              {datosConsumo.consumoPromedio} kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4 inline mr-1" />
              {datosConsumo.resumen?.dispositivosActivos || 0} dispositivos
              activos
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="mensual"
        className="mb-4"
        onValueChange={setPeriodoSeleccionado}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="mensual">Mensual</TabsTrigger>
            <TabsTrigger value="diario">Diario</TabsTrigger>
            <TabsTrigger value="horario">Por Hora</TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            {periodoSeleccionado === "mensual" && (
              <Select defaultValue="2023" onValueChange={setAñoSeleccionado}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            )}

            {periodoSeleccionado === "diario" && (
              <Select
                defaultValue="Noviembre"
                onValueChange={setMesSeleccionado}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                  ].map((mes) => (
                    <SelectItem key={mes} value={mes}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <TabsContent value={periodoSeleccionado} className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Consumo{" "}
                {periodoSeleccionado === "mensual"
                  ? `Mensual ${añoSeleccionado}`
                  : periodoSeleccionado === "diario"
                    ? `Diario ${mesSeleccionado} ${añoSeleccionado}`
                    : "Por Hora"}
              </CardTitle>
              <CardDescription>
                {periodoSeleccionado === "mensual"
                  ? "Consumo y costos por mes"
                  : periodoSeleccionado === "diario"
                    ? "Consumo por día de la semana"
                    : "Patrón típico de consumo en 24 horas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderizarGrafico()}

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Máximo Consumo</div>
                  <div className="text-xl font-bold">
                    {datosConsumo.consumoMaximo} kWh
                  </div>
                  <div className="text-xs text-gray-500">Período actual</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Promedio</div>
                  <div className="text-xl font-bold">
                    {datosConsumo.consumoPromedio} kWh
                  </div>
                  <div className="text-xs text-gray-500">Período actual</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Mínimo Consumo</div>
                  <div className="text-xl font-bold">
                    {datosConsumo.consumoMinimo} kWh
                  </div>
                  <div className="text-xs text-gray-500">Período actual</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                {datosConsumo.resumen?.tendencia || "Sin datos"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Dispositivos activos:
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {datosConsumo.resumen?.dispositivosActivos || 0}
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
