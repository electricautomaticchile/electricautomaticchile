import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Activity, Wifi, WifiOff, Lightbulb } from "lucide-react";
import { ControlArduinoEstadoProps } from './types';
import { 
  LedVisualIndicator,
  LedStatusBadge,
  ConnectionStatusBadge,
  PhysicalButtonBadge,
  StatusIcon 
} from './ControlArduinoIconos';
import { STATUS_COLORS, VALIDATORS } from './config';

export function ControlArduinoEstado({ 
  status, 
  loading = false 
}: ControlArduinoEstadoProps) {

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasPhysicalActivity = status.recent_messages.some(msg => 
    VALIDATORS.isPhysicalButton(msg)
  );

  return (
    <div className="space-y-6">
      {/* Estado Visual Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Estado Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LED Visual */}
          <LedVisualIndicator status={status.led_status} />

          {/* Badges de Estado */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <LedStatusBadge status={status.led_status} />
              <PhysicalButtonBadge show={hasPhysicalActivity} />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <StatusIcon connected={status.connected} />
              <span className={status.connected ? STATUS_COLORS.connected.text : STATUS_COLORS.disconnected.text}>
                {status.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>

            {status.port && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Puerto: {status.port}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema Detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conexión */}
            <div className={`p-4 rounded-lg ${status.connected ? STATUS_COLORS.connected.bg : STATUS_COLORS.disconnected.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon connected={status.connected} size="h-5 w-5" />
                <span className="font-medium">Conexión</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {status.connected ? "Activa" : "Inactiva"}
              </p>
              {status.connected && status.port && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {status.port}
                </p>
              )}
            </div>

            {/* LED */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <span className="font-medium">LED</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {status.led_status}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  status.led_status === "ENCENDIDO" ? "bg-green-500" : "bg-gray-400"
                }`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {status.led_status === "ENCENDIDO" ? "Encendido" : "Apagado"}
                </span>
              </div>
            </div>

            {/* Puerto */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Puerto</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {status.port || "No detectado"}
              </p>
              {status.connected && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Comunicando</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensajes Recientes */}
      {status.recent_messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mensajes Recientes</span>
              <span className="text-sm font-normal text-gray-500">
                {status.recent_messages.length} mensajes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg space-y-1 max-h-48 overflow-y-auto">
              {status.recent_messages.map((message, index) => {
                const isPhysical = VALIDATORS.isPhysicalButton(message);
                return (
                  <div
                    key={index}
                    className={`text-sm font-mono rounded px-2 py-1 ${
                      isPhysical
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500 font-semibold"
                        : "text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {isPhysical && "🔘 "}
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      [{new Date().toLocaleTimeString('es-CL')}]
                    </span>
                    {message}
                  </div>
                );
              })}
            </div>
            
            {/* Indicador de actividad en tiempo real */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Monitoreo en tiempo real activo</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Resumido para Vista Rápida */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                status.connected ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}>
                <StatusIcon connected={status.connected} size="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Arduino {status.connected ? "Conectado" : "Desconectado"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  LED: {status.led_status}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium">
                {status.recent_messages.length} mensajes
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {hasPhysicalActivity ? "Actividad física detectada" : "Solo control remoto"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente compacto solo para el estado visual principal
export function ControlArduinoEstadoCompacto({ status }: { status: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <LedVisualIndicator status={status.led_status} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <LedStatusBadge status={status.led_status} />
          <ConnectionStatusBadge connected={status.connected} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {status.port ? `Puerto: ${status.port}` : "Puerto no detectado"}
        </p>
      </div>
    </div>
  );
}
