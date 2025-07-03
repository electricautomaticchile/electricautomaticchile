import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Power,
  ToggleLeft,
  ToggleRight,
  Wifi,
  WifiOff,
  RefreshCw,
  Zap,
} from "lucide-react";
import { ControlArduinoAccionesProps } from './types';
import { CONTROL_BUTTONS, LAYOUTS } from './config';
import { 
  ActionIcon,
  ToggleIcon,
  ActivityIndicator,
  ConnectionStatusBadge 
} from './ControlArduinoIconos';

export function ControlArduinoAcciones({
  status,
  autoRefresh,
  loading,
  onConnect,
  onDisconnect,
  onControlLed,
  onToggleAutoRefresh
}: ControlArduinoAccionesProps) {

  return (
    <div className="space-y-6">
      {/* Encabezado con estado y configuración */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            Control Arduino LED
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistema de control IoT para LED Arduino
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Auto-refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAutoRefresh}
            className="flex items-center gap-2"
          >
            <ActivityIndicator active={autoRefresh} />
            Auto-refresh
          </Button>

          {/* Botón de conexión/desconexión */}
          {status.connected ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDisconnect}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Desconectar
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onConnect}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              Conectar
            </Button>
          )}
        </div>
      </div>

      {/* Panel de Control Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controles del LED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Control LED
            </CardTitle>
            <CardDescription>
              Controle el LED Arduino remotamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botones Encender/Apagar */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onControlLed("on")}
                disabled={!status.connected || loading}
                className="h-12 bg-green-600 hover:bg-green-700"
                variant="default"
              >
                <Power className="h-4 w-4 mr-2" />
                Encender
              </Button>
              <Button
                onClick={() => onControlLed("off")}
                disabled={!status.connected || loading}
                className="h-12"
                variant="outline"
              >
                <Power className="h-4 w-4 mr-2" />
                Apagar
              </Button>
            </div>

            {/* Botón Toggle */}
            <Button
              onClick={() => onControlLed("toggle")}
              disabled={!status.connected || loading}
              className="w-full h-12"
              variant="secondary"
            >
              <ToggleIcon status={status.led_status} size="h-4 w-4" />
              <span className="ml-2">Toggle LED</span>
            </Button>

            {/* Estado de los controles */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Estado del control:</span>
                <ConnectionStatusBadge connected={status.connected} />
              </div>
              {!status.connected && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  ⚠️ Conecte el Arduino para habilitar los controles
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Configuración y acciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado de Auto-refresh */}
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <ActivityIndicator active={autoRefresh} />
                <span className="text-sm font-medium">Auto-refresh</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAutoRefresh}
              >
                {autoRefresh ? "Desactivar" : "Activar"}
              </Button>
            </div>

            {/* Información de conexión */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Conexión</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Estado: {status.connected ? "✅ Conectado" : "❌ Desconectado"}</div>
                <div>Puerto: {status.port || "No detectado"}</div>
                <div>Servidor: Flask (localhost:5000)</div>
              </div>
            </div>

            {/* Botón de reconexión rápida */}
            <Button
              variant="outline"
              className="w-full"
              onClick={status.connected ? onDisconnect : onConnect}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ActionIcon action={status.connected ? "disconnect" : "connect"} />
              )}
              <span className="ml-2">
                {status.connected ? "Reconectar" : "Intentar Conexión"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente reducido para versión compacta
export function ControlArduinoAccionesReducido({
  status,
  loading,
  onControlLed
}: {
  status: any;
  loading: boolean;
  onControlLed: (action: string) => Promise<void>;
}) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onControlLed("on")}
        disabled={!status.connected || loading}
        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      >
        <Power className="h-3 w-3 mr-1" />
        ON
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onControlLed("off")}
        disabled={!status.connected || loading}
        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
      >
        <Power className="h-3 w-3 mr-1" />
        OFF
      </Button>
    </div>
  );
}

// Componente solo para header de acciones
export function ControlArduinoHeader({
  status,
  autoRefresh,
  loading,
  onConnect,
  onDisconnect,
  onToggleAutoRefresh
}: Omit<ControlArduinoAccionesProps, 'onControlLed'>) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-orange-600" />
          Control Arduino LED
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sistema de control IoT para LED Arduino
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAutoRefresh}
        >
          <ActivityIndicator active={autoRefresh} size="h-4 w-4" />
          <span className="ml-2">Auto-refresh</span>
        </Button>

        {status.connected ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDisconnect}
            disabled={loading}
          >
            <WifiOff className="h-4 w-4 mr-2" />
            Desconectar
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onConnect}
            disabled={loading}
          >
            <Wifi className="h-4 w-4 mr-2" />
            Conectar
          </Button>
        )}
      </div>
    </div>
  );
}
