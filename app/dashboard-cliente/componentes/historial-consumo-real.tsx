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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BarChart,
  Download,
  FilterX,
  LineChart,
  Calendar,
  Info,
  Loader2,
  DollarSign,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart as BarChartRecharts,
  CartesianGrid,
  Legend,
  Line,
  LineChart as LineChartRecharts,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { historialConsumoService, type HistorialAgregado } from "@/lib/api/historialConsumoService";
import { useApi } from "@/lib/hooks/useApi";

interface HistorialConsumoRealProps {
  reducida?: boolean;
  clienteId?: string;
}

export function HistorialConsumoReal({ reducida = false, clienteId }: HistorialConsumoRealProps) {
  const { user } = useApi();
  const idCliente = clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;

  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<"hora" | "dia" | "mes">("hora");
  const [tipoGrafico, setTipoGrafico] = useState<"linea" | "barra">("linea");
  const [datosMostrados, setDatosMostrados] = useState<"energia" | "costo">("energia");
  const [datosHistoricos, setDatosHistoricos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const [ultimoValor, setUltimoValor] = useState<any>(null);

  // Cargar datos del historial
  useEffect(() => {
    if (!idCliente) return;

    const cargarHistorial = async () => {
      setCargando(true);
      setError(null);

      try {
        // Calcular fechas según el período
        const hasta = new Date();
        let desde = new Date();
        
        switch (periodoSeleccionado) {
          case "hora":
            desde = new Date(hasta.getTime() - 24 * 60 * 60 * 1000); // Últimas 24 horas
            break;
          case "dia":
            desde = new Date(hasta.getTime() - 30 * 24 * 60 * 60 * 1000); // Últimos 30 días
            break;
          case "mes":
            desde = new Date(hasta.getTime() - 12 * 30 * 24 * 60 * 60 * 1000); // Últimos 12 meses
            break;
        }

        // Obtener datos agregados
        const response = await historialConsumoService.obtenerHistorial(idCliente, {
          desde,
          hasta,
          agregacion: periodoSeleccionado,
          limite: 100,
        });

        // Obtener último valor registrado (sin agregación)
        const ultimoResponse = await historialConsumoService.obtenerHistorial(idCliente, {
          desde: new Date(Date.now() - 60000), // Último minuto
          hasta: new Date(),
          limite: 1,
        });

        if (response.success && response.data) {
          // Transformar datos para el gráfico
          const datosTransformados = (response.data as HistorialAgregado[])
            .map((item) => ({
              fecha: item._id.periodo,
              energia: Math.max(0, item.energiaTotal || 0),
              costo: Math.max(0, item.costoTotal || 0),
              potenciaPromedio: item.potenciaPromedio || 0,
              potenciaMaxima: item.potenciaMaxima || 0,
              voltaje: item.voltaje || 0,
              corriente: item.corriente || 0,
              energiaInicial: item.energiaInicial || 0,
              energiaFinal: item.energiaFinal || 0,
            }))
            .reverse();

          // Agregar el último valor como punto actual
          if (ultimoResponse.success && ultimoResponse.data && ultimoResponse.data.length > 0) {
            const ultimo = ultimoResponse.data[0] as any;
            setUltimoValor({
              energia: ultimo.energia || 0,
              costo: ultimo.costo || 0,
              potencia: ultimo.potenciaActiva || 0,
              voltaje: ultimo.voltaje || 0,
              corriente: ultimo.corriente || 0,
              timestamp: ultimo.timestamp,
            });

            // Agregar como punto "Ahora" en el gráfico
            datosTransformados.push({
              fecha: "Ahora",
              energia: ultimo.energia || 0,
              costo: ultimo.costo || 0,
              potenciaPromedio: ultimo.potenciaActiva || 0,
              potenciaMaxima: ultimo.potenciaActiva || 0,
              voltaje: ultimo.voltaje || 0,
              corriente: ultimo.corriente || 0,
              energiaInicial: ultimo.energia || 0,
              energiaFinal: ultimo.energia || 0,
            });
          }

          console.log("📊 Datos transformados:", {
            total: datosTransformados.length,
            ultimoValor: ultimoValor,
            energiaTotal: datosTransformados.reduce((sum, d) => sum + d.energia, 0),
            costoTotal: datosTransformados.reduce((sum, d) => sum + d.costo, 0),
          });
          setDatosHistoricos(datosTransformados);
          setUltimaActualizacion(new Date());
        }
      } catch (err: any) {
        console.error("Error cargando historial:", err);
        setError(err.message || "Error al cargar historial");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
    
    // Recargar cada 60 segundos (1 minuto) para evitar parpadeos molestos
    const intervalo = setInterval(cargarHistorial, 60000);
    return () => clearInterval(intervalo);
  }, [idCliente, periodoSeleccionado]);

  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // Calcular estadísticas
  const energiaTotal = datosHistoricos.reduce((sum, d) => sum + (d.energia || 0), 0);
  const costoTotal = datosHistoricos.reduce((sum, d) => sum + (d.costo || 0), 0);
  const energiaPromedio = datosHistoricos.length > 0 ? energiaTotal / datosHistoricos.length : 0;
  const potenciaMaxima = Math.max(...datosHistoricos.map(d => d.potenciaMaxima || 0), 0);
  const potenciaPromedio = datosHistoricos.length > 0 
    ? datosHistoricos.reduce((sum, d) => sum + (d.potenciaPromedio || 0), 0) / datosHistoricos.length 
    : 0;
  const voltajePromedio = datosHistoricos.length > 0
    ? datosHistoricos.reduce((sum, d) => sum + (d.voltaje || 0), 0) / datosHistoricos.length
    : 0;
  const corrientePromedio = datosHistoricos.length > 0
    ? datosHistoricos.reduce((sum, d) => sum + (d.corriente || 0), 0) / datosHistoricos.length
    : 0;

  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Historial de Consumo
          </CardTitle>
          <CardDescription>Consumo de energía en el tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="h-[180px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <div className="h-[180px] flex items-center justify-center text-red-600">
              {error}
            </div>
          ) : (
            <>
              <div className="h-[180px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChartRecharts
                    data={datosHistoricos.slice(-12)}
                    margin={{ top: 5, right: 10, left: 0, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="fecha"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={30}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Energía"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energia"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={true}
                      activeDot={{ r: 6 }}
                    />
                  </LineChartRecharts>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                  <span className="block text-gray-500 dark:text-gray-400">
                    Energía Promedio
                  </span>
                  <span className="font-medium">
                    {energiaPromedio.toFixed(2)} kWh
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400">
                    Energía Total
                  </span>
                  <span className="font-medium">{energiaTotal.toFixed(2)} kWh</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Clock className="h-7 w-7 text-orange-600" />
            Historial de Consumo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis de su consumo eléctrico a lo largo del tiempo
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={tipoGrafico === "linea" ? "default" : "outline"}
            size="sm"
            onClick={() => setTipoGrafico("linea")}
            className={
              tipoGrafico === "linea" ? "bg-orange-600 hover:bg-orange-700" : ""
            }
          >
            <LineChart className="h-4 w-4 mr-1" />
            Línea
          </Button>
          <Button
            variant={tipoGrafico === "barra" ? "default" : "outline"}
            size="sm"
            onClick={() => setTipoGrafico("barra")}
            className={
              tipoGrafico === "barra" ? "bg-orange-600 hover:bg-orange-700" : ""
            }
          >
            <BarChart className="h-4 w-4 mr-1" />
            Barras
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Consumo Histórico
                <span className="inline-flex items-center gap-1 text-xs font-normal text-green-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  LIVE
                </span>
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>Último valor registrado + agregación por hora</span>
                {ultimaActualizacion && (
                  <span className="text-xs text-gray-500">
                    Actualizado: {ultimaActualizacion.toLocaleTimeString("es-CL")}
                  </span>
                )}
              </CardDescription>
            </div>

            <div className="flex gap-3">
              <Select
                value={periodoSeleccionado}
                onValueChange={(v) => setPeriodoSeleccionado(v as "hora" | "dia" | "mes")}
              >
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hora">Por Hora (24h)</SelectItem>
                  <SelectItem value="dia">Por Día (30d)</SelectItem>
                  <SelectItem value="mes">Por Mes (12m)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={datosMostrados}
                onValueChange={(v) => setDatosMostrados(v as "energia" | "costo")}
              >
                <SelectTrigger className="w-[140px]">
                  <FilterX className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Datos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energia">Energía (kWh)</SelectItem>
                  <SelectItem value="costo">Costo ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {cargando && datosHistoricos.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center text-red-600">
              <p>{error}</p>
            </div>
          ) : datosHistoricos.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No hay datos disponibles para este período</p>
                <p className="text-sm mt-2">Los datos se capturan cada 5 segundos</p>
              </div>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === "linea" ? (
                  <LineChartRecharts
                    data={datosHistoricos}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" tickLine={false} />
                    <YAxis
                      tickLine={false}
                      tickFormatter={(value) =>
                        datosMostrados === "energia"
                          ? `${value.toFixed(1)}`
                          : `${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        datosMostrados === "energia"
                          ? `${value.toFixed(2)} kWh`
                          : formatoMoneda(value),
                        datosMostrados === "energia" ? "Energía" : "Costo",
                      ]}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={datosMostrados}
                      name={
                        datosMostrados === "energia"
                          ? "Energía (kWh)"
                          : "Costo ($)"
                      }
                      stroke="#f97316"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChartRecharts>
                ) : (
                  <BarChartRecharts
                    data={datosHistoricos}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="fecha" tickLine={false} />
                    <YAxis
                      tickLine={false}
                      tickFormatter={(value) =>
                        datosMostrados === "energia"
                          ? `${value.toFixed(1)}`
                          : `${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        datosMostrados === "energia"
                          ? `${value.toFixed(2)} kWh`
                          : formatoMoneda(value),
                        datosMostrados === "energia" ? "Energía" : "Costo",
                      ]}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey={datosMostrados}
                      name={
                        datosMostrados === "energia"
                          ? "Energía (kWh)"
                          : "Costo ($)"
                      }
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChartRecharts>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Energía Actual
                  {ultimoValor && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </p>
                <h3 className="text-xl font-bold">
                  {ultimoValor ? ultimoValor.energia.toFixed(3) : energiaTotal.toFixed(3)} kWh
                </h3>
                <p className="text-xs text-gray-400">
                  Período: {energiaTotal.toFixed(3)} kWh
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Costo Actual
                  {ultimoValor && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </p>
                <h3 className="text-xl font-bold">
                  {ultimoValor ? formatoMoneda(ultimoValor.costo) : formatoMoneda(costoTotal)}
                </h3>
                <p className="text-xs text-gray-400">
                  Período: {formatoMoneda(costoTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Potencia Promedio
                </p>
                <h3 className="text-xl font-bold">
                  {potenciaPromedio.toFixed(1)} W
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Voltaje / Corriente
                </p>
                <h3 className="text-xl font-bold">
                  {voltajePromedio.toFixed(0)}V / {corrientePromedio.toFixed(2)}A
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Datos en Tiempo Real
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Los datos se capturan automáticamente cada 5 segundos desde sus dispositivos IoT.
                El gráfico muestra el consumo de energía (kWh) y costo ($) acumulado en cada período.
                Los valores de voltaje ({voltajePromedio.toFixed(0)}V) y corriente ({corrientePromedio.toFixed(2)}A) son constantes del dispositivo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
