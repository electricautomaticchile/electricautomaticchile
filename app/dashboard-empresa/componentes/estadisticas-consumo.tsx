"use client";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  TrendingUp,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  Activity,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "@/lib/api/apiService";

// Colores para los gráficos
const COLORS = {
  primary: "#ea580c",
  secondary: "#f97316",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gradient: ["#ea580c", "#f97316"],
};

// Interfaces para los datos
interface DatoConsumo {
  periodo: string;
  consumo: number;
  costo?: number;
  eficiencia?: number;
}

interface EstadisticasResumen {
  consumoMensual: number;
  variacionMensual: number;
  consumoAnual: number;
  variacionAnual: number;
  pico: {
    valor: number;
    fecha: string;
    hora: string;
  };
  horarioPico: string;
  eficienciaEnergetica: number;
  costoMensual: number;
  ahorroPotencial: number;
}

interface EstadisticasConsumoProps {
  reducida?: boolean;
}

export function EstadisticasConsumo({
  reducida = false,
}: EstadisticasConsumoProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  const [loading, setLoading] = useState(false);
  const [datosConsumo, setDatosConsumo] = useState<DatoConsumo[]>([]);
  const [resumenEstadisticas, setResumenEstadisticas] =
    useState<EstadisticasResumen>({
      consumoMensual: 4520,
      variacionMensual: -2.8,
      consumoAnual: 54270,
      variacionAnual: 5.2,
      pico: {
        valor: 250.5,
        fecha: "15/11/2023",
        hora: "19:35",
      },
      horarioPico: "18:00 - 21:00",
      eficienciaEnergetica: 87.5,
      costoMensual: 156780,
      ahorroPotencial: 18500,
    });

  // Cargar datos de consumo
  const cargarDatos = async (periodo: string) => {
    setLoading(true);
    try {
      // En un entorno real, estos datos vendrían del backend
      // const datos = await apiService.getEstadisticasConsumo(periodo);

      // Simulación de datos reales con variación
      const generarDatos = (tipo: "diario" | "mensual" | "horario") => {
        switch (tipo) {
          case "diario":
            return Array.from({ length: 30 }, (_, i) => ({
              periodo: `${i + 1}/11`,
              consumo:
                Math.floor(Math.random() * 100) + 120 + (i % 7 === 0 ? -20 : 0), // Domingos menos consumo
              costo: Math.floor(Math.random() * 3000) + 4000,
              eficiencia: Math.floor(Math.random() * 20) + 80,
            }));
          case "mensual":
            return Array.from({ length: 12 }, (_, i) => ({
              periodo: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
              ][i],
              consumo:
                Math.floor(Math.random() * 800) +
                3800 +
                (i > 5 && i < 9 ? 400 : 0), // Invierno mayor consumo
              costo: Math.floor(Math.random() * 30000) + 120000,
              eficiencia: Math.floor(Math.random() * 15) + 82,
            }));
          case "horario":
            return Array.from({ length: 24 }, (_, i) => ({
              periodo: `${i.toString().padStart(2, "0")}:00`,
              consumo:
                Math.floor(Math.random() * 50) +
                (i >= 8 && i <= 18 ? 80 : 30) + // Horario laboral
                (i >= 18 && i <= 21 ? 40 : 0), // Horario pico
              costo: Math.floor(Math.random() * 2000) + 1500,
              eficiencia: Math.floor(Math.random() * 25) + 70,
            }));
          default:
            return [];
        }
      };

      setDatosConsumo(generarDatos("mensual"));

      // Actualizar estadísticas con algo de variación aleatoria
      setResumenEstadisticas((prev) => ({
        ...prev,
        consumoMensual: Math.floor(Math.random() * 500) + 4300,
        variacionMensual: (Math.random() - 0.5) * 10,
        eficienciaEnergetica: Math.floor(Math.random() * 10) + 85,
        costoMensual: Math.floor(Math.random() * 20000) + 150000,
      }));
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(periodoSeleccionado);
  }, [periodoSeleccionado]);

  // Componente personalizado para tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{`Período: ${label}`}</p>
          <p className="text-orange-600">
            {`Consumo: ${payload[0].value.toLocaleString("es-CL")} kWh`}
          </p>
          {payload[0].payload.costo && (
            <p className="text-green-600">
              {`Costo: $${payload[0].payload.costo.toLocaleString("es-CL")}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Consumo Mensual</div>
          <div className="text-2xl font-bold">
            {resumenEstadisticas.consumoMensual.toLocaleString("es-CL")} kWh
          </div>
          <div
            className={`text-xs flex items-center ${
              resumenEstadisticas.variacionMensual >= 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {resumenEstadisticas.variacionMensual >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {resumenEstadisticas.variacionMensual >= 0 ? "+" : ""}
            {resumenEstadisticas.variacionMensual.toFixed(1)}% vs. mes anterior
          </div>
        </div>

        <div className="h-32">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosConsumo.slice(-7)}>
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="periodo" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            <div className="text-gray-500">Pico de consumo</div>
            <div className="font-medium">
              {resumenEstadisticas.pico.valor} kWh
            </div>
          </div>
          <div>
            <div className="text-gray-500">Eficiencia</div>
            <div className="font-medium">
              {resumenEstadisticas.eficienciaEnergetica}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-600" />
          Estadísticas de Consumo
        </h2>

        <div className="flex items-center gap-3">
          <Select
            defaultValue={periodoSeleccionado}
            onValueChange={setPeriodoSeleccionado}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nov-2023">Noviembre 2023</SelectItem>
              <SelectItem value="oct-2023">Octubre 2023</SelectItem>
              <SelectItem value="sep-2023">Septiembre 2023</SelectItem>
              <SelectItem value="ano-2023">Todo 2023</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Consumo Mensual</CardTitle>
            <CardDescription>
              Período actual ({periodoSeleccionado})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {resumenEstadisticas.consumoMensual.toLocaleString("es-CL")}{" "}
              <span className="text-base text-gray-500">kWh</span>
            </div>
            <div
              className={`text-sm flex items-center mt-1 ${
                resumenEstadisticas.variacionMensual >= 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {resumenEstadisticas.variacionMensual >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {resumenEstadisticas.variacionMensual >= 0 ? "+" : ""}
              {resumenEstadisticas.variacionMensual.toFixed(1)}% vs. mes
              anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Costo Mensual</CardTitle>
            <CardDescription>Facturación estimada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${resumenEstadisticas.costoMensual.toLocaleString("es-CL")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Ahorro potencial: $
              {resumenEstadisticas.ahorroPotencial.toLocaleString("es-CL")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pico de Consumo</CardTitle>
            <CardDescription>Valor máximo registrado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {resumenEstadisticas.pico.valor}{" "}
              <span className="text-base text-gray-500">kWh</span>
            </div>
            <div className="text-sm flex flex-col mt-1">
              <span className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {resumenEstadisticas.pico.fecha}
              </span>
              <span className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {resumenEstadisticas.pico.hora} hrs
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eficiencia</CardTitle>
            <CardDescription>Índice de optimización</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {resumenEstadisticas.eficienciaEnergetica}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${resumenEstadisticas.eficienciaEnergetica}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensual" className="mb-6">
        <TabsList>
          <TabsTrigger value="mensual">Consumo Mensual</TabsTrigger>
          <TabsTrigger value="diario">Consumo Diario</TabsTrigger>
          <TabsTrigger value="horario">Consumo por Hora</TabsTrigger>
        </TabsList>

        <TabsContent value="mensual" className="mt-4">
          <div className="h-80 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={datosConsumo}>
                  <defs>
                    <linearGradient
                      id="consumoGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodo" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="consumo"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#consumoGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">
                  Análisis de Tendencia
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  El consumo mensual muestra un patrón estacional típico. Los
                  meses de invierno (Jun-Ago) presentan mayor consumo debido a
                  calefacción. Se recomienda optimizar el uso de sistemas de
                  climatización durante estos períodos.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diario" className="mt-4">
          <div className="h-80 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosConsumo.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodo" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="consumo"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">
                  Patrones Diarios
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Se observa un patrón de mayor consumo durante días laborales
                  (Lun-Vie) y menor consumo los fines de semana. El domingo
                  presenta el menor consumo, aproximadamente 40% inferior al
                  promedio semanal.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="horario" className="mt-4">
          <div className="h-80 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Array.from({ length: 24 }, (_, i) => ({
                    periodo: `${i.toString().padStart(2, "0")}:00`,
                    consumo:
                      Math.floor(Math.random() * 50) +
                      (i >= 8 && i <= 18 ? 80 : 30) +
                      (i >= 18 && i <= 21 ? 40 : 0),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodo" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="consumo"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">
                  Horarios de Mayor Consumo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  El horario de mayor consumo se concentra entre las 18:00 y
                  21:00 horas (horario pico). Se recomienda evitar el uso de
                  equipos de alto consumo durante este período para optimizar
                  costos energéticos.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Inteligentes</CardTitle>
          <CardDescription>
            Basadas en IA y análisis de patrones de consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-4 h-4 rounded-full bg-green-500 mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Optimización de Horarios
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Trasladar equipos de alto consumo fuera del horario pico
                    (18:00-21:00) podría reducir costos en un 15%.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="min-w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Eficiencia Energética
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Su índice de eficiencia actual es{" "}
                    {resumenEstadisticas.eficienciaEnergetica}%. Objetivo
                    recomendado: 92%.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-4 h-4 rounded-full bg-orange-500 mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Ahorro Potencial
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Implementando las mejoras sugeridas podría ahorrar hasta $
                    {resumenEstadisticas.ahorroPotencial.toLocaleString(
                      "es-CL"
                    )}{" "}
                    mensuales.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="min-w-4 h-4 rounded-full bg-purple-500 mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Mantenimiento Predictivo
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Se recomienda revisión de equipos con consumo anómalo en los
                    próximos 15 días.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
