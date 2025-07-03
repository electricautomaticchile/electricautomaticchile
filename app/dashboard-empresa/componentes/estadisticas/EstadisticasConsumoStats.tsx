import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";
import { EstadisticasStatsProps } from "./types";
import { UNIDADES } from "./config";

export function EstadisticasConsumoStats({
  resumen,
  periodoSeleccionado,
  loading,
}: EstadisticasStatsProps) {
  const formatearNumero = (
    valor: number,
    tipo: "consumo" | "costo" | "porcentaje"
  ) => {
    if (tipo === "costo") {
      return `$${valor.toLocaleString("es-CL")}`;
    } else if (tipo === "porcentaje") {
      return `${valor.toFixed(1)}%`;
    } else {
      return `${valor.toLocaleString("es-CL")} ${UNIDADES.consumo}`;
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const estadisticas = [
    {
      titulo: "Consumo Mensual",
      descripcion: `Período actual (${periodoSeleccionado})`,
      valor: resumen.consumoMensual,
      variacion: resumen.variacionMensual,
      tipo: "consumo" as const,
      icon: <Zap className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      titulo: "Costo Mensual",
      descripcion: "Facturación estimada",
      valor: resumen.costoMensual,
      valorSecundario: resumen.ahorroPotencial,
      tipo: "costo" as const,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      titulo: "Pico de Consumo",
      descripcion: "Valor máximo registrado",
      valor: resumen.pico.valor,
      fecha: resumen.pico.fecha,
      hora: resumen.pico.hora,
      tipo: "consumo" as const,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      titulo: "Eficiencia Energética",
      descripcion: "Índice de eficiencia",
      valor: resumen.eficienciaEnergetica,
      tipo: "porcentaje" as const,
      icon: <Target className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas principales de estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        {estadisticas.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-1 h-full ${stat.bgColor.replace("bg-", "bg-gradient-to-b from-")}-500 to-transparent`}
            ></div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {stat.titulo}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
              <CardDescription>{stat.descripcion}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {formatearNumero(stat.valor, stat.tipo)}
              </div>

              {/* Variación mensual para consumo */}
              {stat.variacion !== undefined && (
                <div
                  className={`text-sm flex items-center ${
                    stat.variacion >= 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {stat.variacion >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.variacion >= 0 ? "+" : ""}
                  {stat.variacion.toFixed(1)}% vs. mes anterior
                </div>
              )}

              {/* Ahorro potencial para costo */}
              {stat.valorSecundario !== undefined && (
                <div className="text-sm text-gray-500 mt-1">
                  Ahorro potencial: $
                  {stat.valorSecundario.toLocaleString("es-CL")}
                </div>
              )}

              {/* Fecha y hora para pico */}
              {stat.fecha && stat.hora && (
                <div className="text-sm flex flex-col mt-1 space-y-1">
                  <span className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {stat.fecha}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {stat.hora}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tarjeta de análisis adicional */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Análisis de tendencias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análisis de Tendencias</CardTitle>
            <CardDescription>
              Comparativa período actual vs anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Consumo Anual</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {resumen.consumoAnual.toLocaleString("es-CL")} kWh
                  </div>
                  <div
                    className={`text-sm flex items-center ${
                      resumen.variacionAnual >= 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {resumen.variacionAnual >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {resumen.variacionAnual >= 0 ? "+" : ""}
                    {resumen.variacionAnual.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Horario Pico</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{resumen.horarioPico}</div>
                  <div className="text-sm text-gray-500">Mayor demanda</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores de rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Indicadores de Rendimiento
            </CardTitle>
            <CardDescription>KPIs principales de eficiencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Eficiencia energética */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Eficiencia Energética
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {resumen.eficienciaEnergetica}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${resumen.eficienciaEnergetica}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {resumen.eficienciaEnergetica >= 85
                    ? "Excelente"
                    : resumen.eficienciaEnergetica >= 75
                      ? "Bueno"
                      : resumen.eficienciaEnergetica >= 65
                        ? "Regular"
                        : "Necesita mejora"}
                </div>
              </div>

              {/* Costo por kWh */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Costo por kWh</span>
                  <span className="font-bold text-green-600">
                    $
                    {Math.round(
                      resumen.costoMensual / resumen.consumoMensual
                    ).toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Promedio nacional: $120 CLP/kWh
                </div>
              </div>

              {/* Proyección mensual */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Proyección Próximo Mes
                  </span>
                  <span className="font-bold text-orange-600">
                    {Math.round(
                      resumen.consumoMensual *
                        (1 + resumen.variacionMensual / 100)
                    ).toLocaleString("es-CL")}{" "}
                    kWh
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Basado en tendencia actual
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
