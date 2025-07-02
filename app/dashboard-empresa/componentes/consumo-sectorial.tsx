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
  Lightbulb,
  Building,
  CalendarDays,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { reportesService } from "@/lib/api/services/reportesService";
import { toast } from "@/components/ui/use-toast";

// Colores para los gráficos
const SECTOR_COLORS = [
  "#ea580c", // Naranja principal
  "#f97316", // Naranja secundario
  "#22c55e", // Verde
  "#3b82f6", // Azul
  "#f59e0b", // Amarillo
  "#8b5cf6", // Púrpura
  "#ef4444", // Rojo
  "#06b6d4", // Cyan
];

const AREA_COLORS = [
  "#1e40af", // Azul oscuro
  "#ea580c", // Naranja
  "#059669", // Verde esmeralda
  "#7c3aed", // Púrpura
  "#dc2626", // Rojo
];

const HORARIO_COLORS = [
  "#312e81", // Índigo oscuro (madrugada)
  "#1e40af", // Azul (mañana)
  "#059669", // Verde (media mañana)
  "#f59e0b", // Amarillo (almuerzo)
  "#ea580c", // Naranja (tarde)
  "#dc2626", // Rojo (noche)
];

// Interfaces
interface DatoSector {
  nombre: string;
  consumo: number;
  porcentaje: number;
  costo: number;
  tendencia: number;
  color: string;
}

interface ConsumoSectorialProps {
  reducida?: boolean;
}

export function ConsumoSectorial({ reducida = false }: ConsumoSectorialProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  const [loading, setLoading] = useState(false);
  const [datosSectores, setDatosSectores] = useState<DatoSector[]>([]);
  const [datosAreas, setDatosAreas] = useState<DatoSector[]>([]);
  const [datosFranjasHorarias, setDatosFranjasHorarias] = useState<
    DatoSector[]
  >([]);
  const [estadoExportacion, setEstadoExportacion] = useState<{
    estado: "idle" | "generando" | "descargando" | "completado" | "error";
    progreso: { step: string; percentage: number; message: string };
    mostrarModal: boolean;
  }>({
    estado: "idle",
    progreso: { step: "", percentage: 0, message: "" },
    mostrarModal: false,
  });
  const [tipoExportacionActual, setTipoExportacionActual] = useState<
    "equipamiento" | "area" | "horario"
  >("equipamiento");

  // Cargar datos simulados con variación
  const cargarDatos = async (periodo: string) => {
    setLoading(true);
    try {
      // Simulación de datos de sectores con variación realista
      const sectores = [
        { nombre: "Iluminación", base: 2450, variacion: 0.15 },
        { nombre: "Climatización", base: 2100, variacion: 0.25 },
        { nombre: "Equipos de oficina", base: 1750, variacion: 0.1 },
        { nombre: "Servidores", base: 1400, variacion: 0.05 },
        { nombre: "Cocina/Comedor", base: 700, variacion: 0.2 },
        { nombre: "Otros", base: 350, variacion: 0.3 },
      ];

      const areas = [
        { nombre: "Piso 1 - Recepción", base: 1050, variacion: 0.1 },
        { nombre: "Piso 2 - Oficinas", base: 2450, variacion: 0.15 },
        { nombre: "Piso 3 - Administración", base: 1750, variacion: 0.12 },
        { nombre: "Piso 4 - Desarrollo", base: 1925, variacion: 0.18 },
        { nombre: "Piso 5 - Gerencia", base: 1575, variacion: 0.08 },
      ];

      const franjas = [
        { nombre: "00:00 - 06:00", base: 875, variacion: 0.2 },
        { nombre: "06:00 - 09:00", base: 1225, variacion: 0.25 },
        { nombre: "09:00 - 12:00", base: 2100, variacion: 0.15 },
        { nombre: "12:00 - 14:00", base: 1400, variacion: 0.2 },
        { nombre: "14:00 - 18:00", base: 2275, variacion: 0.18 },
        { nombre: "18:00 - 00:00", base: 875, variacion: 0.22 },
      ];

      // Generar datos con variación
      const generarDatos = (datos: any[], colores: string[]) => {
        const total = datos.reduce((sum, item) => sum + item.base, 0);
        return datos.map((item, index) => {
          const variacion = (Math.random() - 0.5) * 2 * item.variacion;
          const consumo = Math.floor(item.base * (1 + variacion));
          const porcentaje = Math.round((consumo / total) * 100);
          return {
            nombre: item.nombre,
            consumo,
            porcentaje,
            costo: Math.floor(consumo * (30 + Math.random() * 10)), // Costo por kWh variable
            tendencia: (Math.random() - 0.5) * 20, // Tendencia en %
            color: colores[index % colores.length],
          };
        });
      };

      setDatosSectores(generarDatos(sectores, SECTOR_COLORS));
      setDatosAreas(generarDatos(areas, AREA_COLORS));
      setDatosFranjasHorarias(generarDatos(franjas, HORARIO_COLORS));
    } catch (error) {
      console.error("Error cargando datos de consumo sectorial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(periodoSeleccionado);
  }, [periodoSeleccionado]);

  // Funciones para manejar exportación
  const handleExportarConsumoSectorial = async (
    subtipo: "equipamiento" | "area" | "horario",
    formato: "excel" | "csv" = "excel"
  ) => {
    try {
      setTipoExportacionActual(subtipo);
      setEstadoExportacion({
        estado: "generando",
        progreso: {
          step: "init",
          percentage: 0,
          message: "Iniciando exportación...",
        },
        mostrarModal: true,
      });

      const config = {
        formato,
        filtros: {
          periodo: periodoSeleccionado,
          subtipo,
        },
        titulo: `Consumo Sectorial por ${subtipo.charAt(0).toUpperCase() + subtipo.slice(1)}`,
      };

      await reportesService.descargarReporteConsumoSectorial(
        subtipo,
        config,
        (progreso) => {
          setEstadoExportacion((prev) => ({
            ...prev,
            estado: "descargando",
            progreso,
          }));
        }
      );

      setEstadoExportacion((prev) => ({
        ...prev,
        estado: "completado",
        progreso: {
          step: "complete",
          percentage: 100,
          message: "Consumo sectorial exportado exitosamente",
        },
      }));

      toast({
        title: "✅ Exportación Exitosa",
        description: `El consumo sectorial por ${subtipo} ha sido descargado correctamente.`,
      });

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
      }, 2000);
    } catch (error) {
      console.error("Error exportando consumo sectorial:", error);
      setEstadoExportacion({
        estado: "error",
        progreso: {
          step: "error",
          percentage: 0,
          message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
        },
        mostrarModal: true,
      });

      toast({
        title: "❌ Error en Exportación",
        description:
          "No se pudo exportar el consumo sectorial. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  const cerrarModalExportacion = () => {
    setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
  };

  // Tooltip personalizado para gráficos de pie
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{data.nombre}</p>
          <p className="text-orange-600">{`Consumo: ${data.consumo.toLocaleString("es-CL")} kWh`}</p>
          <p className="text-green-600">{`Costo: $${data.costo.toLocaleString("es-CL")}`}</p>
          <p className="text-gray-600">{`Porcentaje: ${data.porcentaje}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para gráficos de barras
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-orange-600">{`Consumo: ${payload[0].value.toLocaleString("es-CL")} kWh`}</p>
          <p className="text-green-600">{`Costo: $${data.costo.toLocaleString("es-CL")}`}</p>
          <p
            className={`text-sm ${data.tendencia >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {`Tendencia: ${data.tendencia >= 0 ? "+" : ""}${data.tendencia.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Formatear consumo en kWh
  const formatearConsumo = (valor: number) => {
    return `${valor.toLocaleString("es-CL")} kWh`;
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Mayor consumo</div>
            <div className="text-lg font-bold text-blue-600">
              {datosSectores.length > 0
                ? datosSectores[0].nombre
                : "Iluminación"}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Menor consumo</div>
            <div className="text-lg font-bold text-green-600">
              {datosSectores.length > 0
                ? datosSectores[datosSectores.length - 1].nombre
                : "Otros"}
            </div>
          </div>
        </div>

        <div className="h-24">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosSectores.slice(0, 4)}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="consumo"
                >
                  {datosSectores.slice(0, 4).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2">
          {datosSectores.slice(0, 3).map((sector, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sector.color }}
                ></div>
                <span className="text-sm">{sector.nombre}</span>
              </div>
              <div className="text-sm font-medium">{sector.porcentaje}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-orange-600" />
          Consumo por Sector
        </h2>

        <div className="flex items-center gap-3">
          <Select
            defaultValue={periodoSeleccionado}
            onValueChange={setPeriodoSeleccionado}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nov-2023">Noviembre 2023</SelectItem>
              <SelectItem value="oct-2023">Octubre 2023</SelectItem>
              <SelectItem value="sep-2023">Septiembre 2023</SelectItem>
              <SelectItem value="ano-2023">Todo 2023</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportarConsumoSectorial("equipamiento", "excel")
              }
              disabled={
                estadoExportacion.estado === "generando" ||
                estadoExportacion.estado === "descargando"
              }
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Equipamiento
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportarConsumoSectorial("area", "excel")}
              disabled={
                estadoExportacion.estado === "generando" ||
                estadoExportacion.estado === "descargando"
              }
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Área
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportarConsumoSectorial("horario", "excel")}
              disabled={
                estadoExportacion.estado === "generando" ||
                estadoExportacion.estado === "descargando"
              }
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Horario
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="sectores">
        <TabsList className="w-full">
          <TabsTrigger value="sectores" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Por Equipamiento
          </TabsTrigger>
          <TabsTrigger value="areas" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Por Área
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Por Horario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sectores" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Equipamiento</CardTitle>
                <CardDescription>
                  Porcentaje de consumo por tipo de equipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datosSectores}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ nombre, porcentaje }) =>
                            `${nombre}: ${porcentaje}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="consumo"
                        >
                          {datosSectores.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Desglose Detallado</CardTitle>
                <CardDescription>Consumo y costos por sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datosSectores.map((sector, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: sector.color }}
                          ></div>
                          <span className="font-medium">{sector.nombre}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatearConsumo(sector.consumo)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${sector.costo.toLocaleString("es-CL")}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${sector.porcentaje}%`,
                            backgroundColor: sector.color,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {sector.porcentaje}% del total
                        </span>
                        <span
                          className={`text-xs flex items-center ${
                            sector.tendencia >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {sector.tendencia >= 0 ? "+" : ""}
                          {sector.tendencia.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                  Recomendaciones por Equipamiento
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>
                        <strong>Iluminación:</strong> Migrar a LED inteligente
                        con sensores de movimiento podría reducir consumo en
                        25%.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>
                        <strong>Climatización:</strong> Programar temperaturas
                        por zonas podría ahorrar hasta 18% en energía.
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>
                        <strong>Equipos de oficina:</strong> Activar modo ahorro
                        de energía en todos los equipos fuera de horario
                        laboral.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>
                        <strong>Servidores:</strong> Considerar virtualización
                        para optimizar el uso de recursos computacionales.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="areas" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consumo por Área</CardTitle>
                <CardDescription>
                  Distribución de consumo por piso/área
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={datosAreas} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis
                          dataKey="nombre"
                          type="category"
                          stroke="#64748b"
                          width={120}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar
                          dataKey="consumo"
                          fill="#ea580c"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis por Área</CardTitle>
                <CardDescription>
                  Eficiencia energética por ubicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datosAreas.map((area, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{area.nombre}</span>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatearConsumo(area.consumo)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${area.costo.toLocaleString("es-CL")}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${area.porcentaje}%`,
                            backgroundColor: area.color,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {area.porcentaje}% del total
                        </span>
                        <span
                          className={`text-xs flex items-center ${
                            area.tendencia >= 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {area.tendencia >= 0 ? "+" : ""}
                          {area.tendencia.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Análisis de Eficiencia por Área
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>Piso 2 - Oficinas:</strong> Mayor consumo por m²
                        debido a alta densidad de estaciones de trabajo.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>Piso 4 - Desarrollo:</strong> Consumo elevado
                        justificado por equipos especializados 24/7.
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>Piso 1 - Recepción:</strong> Oportunidad de
                        optimización en sistemas de iluminación decorativa.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>Piso 5 - Gerencia:</strong> Eficiencia óptima
                        gracias a sistemas automatizados recientes.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="horarios" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consumo por Horario</CardTitle>
                <CardDescription>
                  Distribución de consumo por franja horaria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={datosFranjasHorarias}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="nombre" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar
                          dataKey="consumo"
                          fill="#ea580c"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patrones Horarios</CardTitle>
                <CardDescription>
                  Análisis de consumo por franja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datosFranjasHorarias.map((franja, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{franja.nombre}</span>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatearConsumo(franja.consumo)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${franja.costo.toLocaleString("es-CL")}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${franja.porcentaje}%`,
                            backgroundColor: franja.color,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {franja.porcentaje}% del total
                        </span>
                        <span
                          className={`text-xs flex items-center ${
                            franja.tendencia >= 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {franja.tendencia >= 0 ? "+" : ""}
                          {franja.tendencia.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  Optimización Horaria
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>
                        <strong>Horario pico (14:00-18:00):</strong> Programar
                        cargas no críticas fuera de esta franja.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>
                        <strong>Valle nocturno (00:00-06:00):</strong>{" "}
                        Aprovechar para procesos de mantenimiento y respaldos.
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>
                        <strong>Horario almuerzo (12:00-14:00):</strong>{" "}
                        Oportunidad de reducir climatización en oficinas.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>
                        <strong>Gestión inteligente:</strong> Implementar
                        sistemas de control automático por franjas horarias.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de progreso de exportación */}
      {estadoExportacion.mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Exportando Consumo Sectorial por{" "}
              {tipoExportacionActual.charAt(0).toUpperCase() +
                tipoExportacionActual.slice(1)}
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{estadoExportacion.progreso.message}</span>
                <span>{estadoExportacion.progreso.percentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${estadoExportacion.progreso.percentage}%` }}
                />
              </div>

              {estadoExportacion.estado === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                  {estadoExportacion.progreso.message}
                </div>
              )}

              {estadoExportacion.estado === "completado" && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded">
                  ✅ Consumo sectorial exportado exitosamente
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={cerrarModalExportacion}
                  disabled={
                    estadoExportacion.estado === "generando" ||
                    estadoExportacion.estado === "descargando"
                  }
                >
                  {estadoExportacion.estado === "completado"
                    ? "Cerrar"
                    : "Cancelar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
