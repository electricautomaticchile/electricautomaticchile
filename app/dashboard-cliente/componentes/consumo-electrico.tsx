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
import {
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
import { apiService } from "@/lib/api/apiService";

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
  datosGrafico: any[];
  resumen: {
    dispositivosActivos: number;
    ultimaActualizacion: string;
    tendencia: string;
  };
}

export function ConsumoElectrico({
  reducida = false,
  clienteId = "default-client-id",
}: ConsumoElectricoProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");
  const [añoSeleccionado, setAñoSeleccionado] = useState("2023");
  const [mesSeleccionado, setMesSeleccionado] = useState("Noviembre");
  const [datosConsumo, setDatosConsumo] = useState<DatosConsumo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos desde la API
  useEffect(() => {
    const cargarDatosConsumo = async () => {
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
          clienteId,
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
  }, [clienteId, periodoSeleccionado, añoSeleccionado, mesSeleccionado]);

  // Renderizar gráfico usando los datos de la API
  const renderizarGrafico = () => {
    if (!datosConsumo || !datosConsumo.datosGrafico.length) {
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
          </CardTitle>
          <CardDescription>
            Consumo actual y estadísticas en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Consumo Actual</div>
              <div className="text-2xl font-bold">
                {datosConsumo.consumoActual} kWh
              </div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                {datosConsumo.resumen.tendencia}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Costo Estimado</div>
              <div className="text-2xl font-bold">
                ${datosConsumo.costoEstimado.toLocaleString("es-CL")}
              </div>
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {datosConsumo.resumen.dispositivosActivos} dispositivos activos
              </div>
            </div>
          </div>

          <div className="h-28 mt-4">{renderizarGrafico()}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-orange-600" />
          Consumo Eléctrico
        </h2>
        <div className="ml-auto text-sm text-gray-500">
          Última actualización:{" "}
          {new Date(
            datosConsumo.resumen.ultimaActualizacion
          ).toLocaleTimeString("es-CL")}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Consumo Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {datosConsumo.consumoActual} kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
              {datosConsumo.resumen.tendencia}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Costo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              ${datosConsumo.costoEstimado.toLocaleString("es-CL")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Tarifa: ${datosConsumo.tarifaKwh}/kWh
            </div>
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
              {datosConsumo.resumen.dispositivosActivos} dispositivos activos
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

      <div className="mt-6 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-orange-600" />
          Análisis Inteligente
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Tendencia:</span>
            <span>{datosConsumo.resumen.tendencia}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Dispositivos activos:</span>
            <span>{datosConsumo.resumen.dispositivosActivos}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Los datos se actualizan automáticamente desde sus dispositivos IoT
            conectados.
          </div>
        </div>
      </div>
    </div>
  );
}
