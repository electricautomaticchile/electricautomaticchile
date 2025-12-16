import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Power, Wifi, WifiOff } from "lucide-react";
import { ControlArduinoReducidoProps } from "./types";
import {
  StatusIcon,
  LedStatusBadge,
  ConnectionStatusBadge,
} from "./ControlArduinoIconos";
import { FORMATTERS, STATUS_COLORS } from "./config";

export function ControlArduinoReducido({
  status,
  stats,
  loading,
  onControlLed,
}: ControlArduinoReducidoProps) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header con estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon connected={status.connected} />
              <span className="text-sm font-medium">
                {status.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <LedStatusBadge status={status.led_status} />
          </div>

          {/* Métricas compactas */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Comandos
              </div>
              <div className="text-lg font-bold text-blue-600">
                {stats.total_commands}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center border border-green-200 dark:border-green-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Eficiencia
              </div>
              <div className="text-lg font-bold text-green-600">
                {FORMATTERS.percentage(stats.efficiency_percentage)}
              </div>
            </div>
          </div>

          {/* Controles principales */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onControlLed("on")}
              disabled={!status.connected || loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
            >
              <Power className="h-3 w-3 mr-1" />
              ON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onControlLed("off")}
              disabled={!status.connected || loading}
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              <Power className="h-3 w-3 mr-1" />
              OFF
            </Button>
          </div>

          {/* Estado de conexión detallado */}
          {status.port && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Puerto: {status.port}
            </div>
          )}

          {/* Indicador de actividad */}
          {(status.recent_messages?.length ?? 0) > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-500 dark:text-gray-400">
                {status.recent_messages?.length ?? 0} mensajes
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Versión aún más compacta para widgets pequeños
export function ControlArduinoMini({
  status,
  stats,
  loading,
  onControlLed,
}: ControlArduinoReducidoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      {/* Estado compacto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <StatusIcon connected={status.connected} size="h-3 w-3" />
          <span className="text-xs font-medium">Arduino</span>
        </div>
        <Badge
          variant={status.led_status === "ENCENDIDO" ? "default" : "secondary"}
          className="text-xs py-0 px-1"
        >
          {status.led_status}
        </Badge>
      </div>

      {/* Métricas mini */}
      <div className="grid grid-cols-2 gap-1 text-center">
        <div>
          <div className="text-xs text-gray-500">Cmds</div>
          <div className="text-sm font-bold text-blue-600">
            {stats.total_commands}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Efic</div>
          <div className="text-sm font-bold text-green-600">
            {stats.efficiency_percentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Controles mini */}
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => onControlLed("on")}
          disabled={!status.connected || loading}
          className="flex-1 h-6 text-xs bg-green-600 hover:bg-green-700"
        >
          ON
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onControlLed("off")}
          disabled={!status.connected || loading}
          className="flex-1 h-6 text-xs"
        >
          OFF
        </Button>
      </div>
    </div>
  );
}

// Versión inline para barras laterales
export function ControlArduinoInline({
  status,
  onControlLed,
  loading,
}: {
  status: any;
  onControlLed: (action: string) => Promise<void>;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <StatusIcon connected={status.connected} size="h-4 w-4" />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">Arduino LED</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {status.led_status}
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => onControlLed("toggle")}
          disabled={!status.connected || loading}
          className="h-7 px-2 text-xs"
          variant={status.led_status === "ENCENDIDO" ? "default" : "outline"}
        >
          {status.led_status === "ENCENDIDO" ? "OFF" : "ON"}
        </Button>
      </div>
    </div>
  );
}

// Versión para dashboard rápido con solo lo esencial
export function ControlArduinoEsencial({
  status,
  onControlLed,
  loading,
}: {
  status: any;
  onControlLed: (action: string) => Promise<void>;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status.connected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">LED {status.led_status}</span>
      </div>

      <Button
        size="sm"
        onClick={() => onControlLed("toggle")}
        disabled={!status.connected || loading}
        className="h-6 px-2 text-xs"
      >
        Toggle
      </Button>
    </div>
  );
}

// Componente para mostrar solo el estado sin controles
export function ControlArduinoEstadoSolo({ status }: { status: any }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <StatusIcon connected={status.connected} size="h-4 w-4" />
      <span
        className={
          status.connected
            ? STATUS_COLORS.connected.text
            : STATUS_COLORS.disconnected.text
        }
      >
        {status.connected ? "Conectado" : "Desconectado"}
      </span>
      <span className="text-gray-500">•</span>
      <span>LED {status.led_status}</span>
      {status.port && (
        <>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{status.port}</span>
        </>
      )}
    </div>
  );
}
