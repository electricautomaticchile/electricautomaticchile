import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertTriangle,
  Battery,
  Wifi,
  Zap,
} from "lucide-react";
import { DispositivosStatsProps } from "./types";

export function DispositivosActivosStats({
  resumen,
  loading,
}: DispositivosStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const estadisticas = [
    {
      titulo: "Total Dispositivos",
      valor: resumen.total,
      icon: <Zap className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      titulo: "Dispositivos Activos",
      valor: resumen.activos,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      titulo: "En Mantenimiento",
      valor: resumen.mantenimiento,
      icon: <RotateCw className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      titulo: "Con Alertas",
      valor: resumen.alerta,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estadisticas.map((stat, index) => (
          <Card key={index} className={`border ${stat.borderColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.titulo}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.valor}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tarjetas de métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Batería Promedio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Battery className="h-4 w-4 text-blue-600" />
              Batería Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {resumen.bateriaPromedio}%
                </span>
                <Badge
                  variant={
                    resumen.bateriaPromedio >= 70 ? "default" : "destructive"
                  }
                >
                  {resumen.bateriaPromedio >= 70 ? "Bueno" : "Bajo"}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    resumen.bateriaPromedio >= 80
                      ? "bg-green-600"
                      : resumen.bateriaPromedio >= 50
                        ? "bg-blue-600"
                        : resumen.bateriaPromedio >= 20
                          ? "bg-amber-600"
                          : "bg-red-600"
                  }`}
                  style={{ width: `${resumen.bateriaPromedio}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calidad de Señal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              Señal Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {resumen.senalPromedio}%
                </span>
                <Badge
                  variant={
                    resumen.senalPromedio >= 70 ? "default" : "secondary"
                  }
                >
                  {resumen.senalPromedio >= 80
                    ? "Excelente"
                    : resumen.senalPromedio >= 60
                      ? "Buena"
                      : resumen.senalPromedio >= 40
                        ? "Regular"
                        : "Mala"}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    resumen.senalPromedio >= 80
                      ? "bg-green-600"
                      : resumen.senalPromedio >= 60
                        ? "bg-blue-600"
                        : resumen.senalPromedio >= 40
                          ? "bg-amber-600"
                          : "bg-red-600"
                  }`}
                  style={{ width: `${resumen.senalPromedio}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumo Total */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Consumo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {resumen.consumoTotal.toLocaleString("es-CL")}
                </span>
                <span className="text-sm text-gray-500">kWh</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Promedio: {Math.round(resumen.consumoTotal / resumen.total)} kWh
                por dispositivo
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado general del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado General del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distribución de estados */}
            <div>
              <h4 className="font-medium mb-3">Distribución de Estados</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Activos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {resumen.activos}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full"
                        style={{
                          width: `${(resumen.activos / resumen.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Alertas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {resumen.alerta}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-amber-600 h-1.5 rounded-full"
                        style={{
                          width: `${(resumen.alerta / resumen.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Mantenimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {resumen.mantenimiento}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(resumen.mantenimiento / resumen.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Inactivos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {resumen.inactivos}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gray-500 h-1.5 rounded-full"
                        style={{
                          width: `${(resumen.inactivos / resumen.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores de salud */}
            <div>
              <h4 className="font-medium mb-3">Indicadores de Salud</h4>
              <div className="space-y-3">
                {/* Porcentaje de disponibilidad */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Disponibilidad</span>
                    <span className="text-sm font-bold text-green-600">
                      {Math.round((resumen.activos / resumen.total) * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {resumen.activos} de {resumen.total} dispositivos operativos
                  </div>
                </div>

                {/* Estado de alertas */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Alertas Activas</span>
                    <span
                      className={`text-sm font-bold ${resumen.alerta > 0 ? "text-amber-600" : "text-green-600"}`}
                    >
                      {resumen.alerta}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {resumen.alerta === 0
                      ? "Sin alertas críticas"
                      : "Requieren atención"}
                  </div>
                </div>

                {/* Eficiencia energética */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Eficiencia</span>
                    <span className="text-sm font-bold text-blue-600">
                      {resumen.bateriaPromedio >= 70
                        ? "Óptima"
                        : "Requiere atención"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Basado en batería y conectividad
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
