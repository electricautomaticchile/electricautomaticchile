import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Download, BarChart3, Power, Clock, TrendingUp } from "lucide-react";
import { ControlArduinoStatsProps } from './types';
import { STATS_CONFIG, EXPORT_OPTIONS, FORMATTERS } from './config';
import { StatsIcon, ExportIcon } from './ControlArduinoIconos';

export function ControlArduinoStats({
  stats,
  status,
  loading = false,
  onExportData
}: ControlArduinoStatsProps) {

  const formatStatValue = (key: string, value: number) => {
    const config = STATS_CONFIG.find(s => s.key === key);
    if (config?.formatter) {
      return config.formatter(value);
    }
    return value;
  };

  const getStatSuffix = (key: string) => {
    const config = STATS_CONFIG.find(s => s.key === key);
    return config?.suffix || "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Comandos */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Comandos
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total_commands}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Comandos enviados
            </p>
          </CardContent>
        </Card>

        {/* Comandos de Encendido */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Power className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Encendidos
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.on_commands}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              LED encendido
            </p>
          </CardContent>
        </Card>

        {/* Tiempo Promedio */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Tiempo Promedio
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {formatStatValue('avg_duration', stats.avg_duration)}{getStatSuffix('avg_duration')}
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Por sesión
            </p>
          </CardContent>
        </Card>

        {/* Eficiencia */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Eficiencia
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatStatValue('efficiency_percentage', stats.efficiency_percentage)}{getStatSuffix('efficiency_percentage')}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Del sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas Detalladas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Comandos Totales:</span>
                <span className="text-lg font-bold text-blue-600">{stats.total_commands}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Comandos ON:</span>
                <span className="text-lg font-bold text-green-600">{stats.on_commands}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Comandos OFF:</span>
                <span className="text-lg font-bold text-red-600">
                  {stats.total_commands - stats.on_commands}
                </span>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Tiempo Total:</span>
                <span className="text-lg font-bold text-orange-600">
                  {FORMATTERS.duration(stats.total_duration)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Promedio/Comando:</span>
                <span className="text-lg font-bold text-orange-600">
                  {FORMATTERS.duration(stats.avg_duration)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-sm font-medium">Eficiencia:</span>
                <span className="text-lg font-bold text-purple-600">
                  {FORMATTERS.percentage(stats.efficiency_percentage)}
                </span>
              </div>
            </div>
          </div>

          {/* Barra de progreso para eficiencia */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Eficiencia del Sistema</span>
              <span>{FORMATTERS.percentage(stats.efficiency_percentage)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, stats.efficiency_percentage))}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportación de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Datos
            </div>
            <span className="text-sm font-normal text-gray-500">
              {status.connected ? "✅ Disponible" : "❌ Arduino desconectado"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Descargue los datos históricos del Arduino en diferentes formatos y períodos.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {EXPORT_OPTIONS.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => onExportData(option.format, option.days)}
                  className="flex items-center gap-2"
                  disabled={!status.connected}
                >
                  <ExportIcon format={option.format} />
                  {option.label}
                </Button>
              ))}
            </div>

            {!status.connected && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ⚠️ Conecte el Arduino para habilitar la exportación de datos
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente compacto solo con métricas principales
export function ControlArduinoStatsReducido({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">Comandos</div>
        <div className="text-lg font-bold text-blue-600">
          {stats.total_commands}
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">Eficiencia</div>
        <div className="text-lg font-bold text-green-600">
          {FORMATTERS.percentage(stats.efficiency_percentage)}
        </div>
      </div>
    </div>
  );
}

// Componente solo para métricas rápidas
export function ControlArduinoMetricasRapidas({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-4 gap-1 text-center">
      <div>
        <div className="text-xs text-gray-500">Total</div>
        <div className="font-bold text-blue-600">{stats.total_commands}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">ON</div>
        <div className="font-bold text-green-600">{stats.on_commands}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Tiempo</div>
        <div className="font-bold text-orange-600">
          {Math.round(stats.avg_duration)}s
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Efic.</div>
        <div className="font-bold text-purple-600">
          {stats.efficiency_percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
