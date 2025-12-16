import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertTriangle,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import { AlertasSistemaStatsProps } from './types';
import { COLORES_ALERTA, DESCRIPCIONES_TIPO } from './config';

export function AlertasSistemaStats({ 
  resumen, 
  loading 
}: AlertasSistemaStatsProps) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const estadisticas = [
    {
      tipo: "error",
      titulo: "Críticas",
      valor: resumen.errorCritico,
      descripcion: DESCRIPCIONES_TIPO.error,
      icon: <AlertTriangle className="h-5 w-5" />,
      colores: COLORES_ALERTA.error
    },
    {
      tipo: "advertencia", 
      titulo: "Advertencias",
      valor: resumen.advertencia,
      descripcion: DESCRIPCIONES_TIPO.advertencia,
      icon: <AlertTriangle className="h-5 w-5" />,
      colores: COLORES_ALERTA.advertencia
    },
    {
      tipo: "informacion",
      titulo: "Información", 
      valor: resumen.informacion,
      descripcion: DESCRIPCIONES_TIPO.informacion,
      icon: <BellRing className="h-5 w-5" />,
      colores: COLORES_ALERTA.informacion
    },
    {
      tipo: "exito",
      titulo: "Éxito",
      valor: resumen.exito, 
      descripcion: DESCRIPCIONES_TIPO.exito,
      icon: <CheckCircle2 className="h-5 w-5" />,
      colores: COLORES_ALERTA.exito
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas principales de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estadisticas.map((stat) => (
          <Card 
            key={stat.tipo}
            className={`${stat.colores.bg} ${stat.colores.border}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={stat.colores.icon}>
                  {stat.icon}
                </div>
                <span className={stat.colores.text}>
                  {stat.titulo}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.colores.icon} mb-1`}>
                {stat.valor}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.descripcion}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alertas no leídas */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800 dark:text-orange-300">
                No Leídas
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {resumen.noLeidas}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Requieren revisión
            </p>
            <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
              {resumen.importantes} importantes
            </div>
          </CardContent>
        </Card>

        {/* Alertas resueltas */}
        <Card className="bg-gray-50 dark:bg-gray-900/10 border-gray-100 dark:border-gray-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gray-600" />
              <span className="text-gray-800 dark:text-gray-300">
                Resueltas
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {resumen.resueltas}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Este mes
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${resumen.total > 0 ? (resumen.resueltas / resumen.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {resumen.total > 0 
                  ? `${Math.round((resumen.resueltas / resumen.total) * 100)}% del total`
                  : "Sin datos"
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de alertas */}
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-300">
                Total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {resumen.total}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alertas activas
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-red-600">Críticas</span>
                <span className="font-medium">{resumen.errorCritico}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-amber-600">Advertencias</span>
                <span className="font-medium">{resumen.advertencia}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
