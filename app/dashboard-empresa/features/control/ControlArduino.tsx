"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Activity, BarChart3, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ControlArduinoProps } from './types';
import { useControlArduinoWebSocket } from './useControlArduinoWebSocket';
import { ControlArduinoHeader } from './ControlArduinoAcciones';
import { ControlArduinoEstado } from './ControlArduinoEstado';
import { ControlArduinoAcciones } from './ControlArduinoAcciones';
import { ControlArduinoStats } from './ControlArduinoStats';
import { ControlArduinoReducido } from './ControlArduinoReducido';

export function ControlArduino({ reducida = false }: ControlArduinoProps) {
  const {
    status,
    stats,
    loading,
    autoRefresh,
    connectArduino,
    disconnectArduino,
    controlLed,
    exportData,
    toggleAutoRefresh,
    isLoading,
    webSocketConectado,
  } = useControlArduinoWebSocket();

  // Versión reducida para el dashboard principal
  if (reducida) {
    return (
      <ControlArduinoReducido
        status={status}
        stats={stats}
        loading={isLoading}
        onControlLed={controlLed}
      />
    );
  }

  // Versión completa
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header con controles principales */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <ControlArduinoHeader
            status={status}
            autoRefresh={autoRefresh}
            loading={loading.connection}
            onConnect={connectArduino}
            onDisconnect={disconnectArduino}
            onToggleAutoRefresh={toggleAutoRefresh}
          />
        </div>
        {/* Indicador de WebSocket */}
        {webSocketConectado && (
          <Badge variant="outline" className="ml-4 flex items-center gap-1">
            <Wifi className="h-3 w-3 text-green-500" />
            <span className="text-xs">Tiempo Real</span>
          </Badge>
        )}
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Control
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estado
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        {/* Tab de Control */}
        <TabsContent value="control" className="space-y-6">
          <ControlArduinoAcciones
            status={status}
            autoRefresh={autoRefresh}
            loading={loading.control}
            onConnect={connectArduino}
            onDisconnect={disconnectArduino}
            onControlLed={controlLed}
            onToggleAutoRefresh={toggleAutoRefresh}
          />
        </TabsContent>

        {/* Tab de Estado */}
        <TabsContent value="status" className="space-y-6">
          <ControlArduinoEstado
            status={status}
            loading={loading.connection}
          />
        </TabsContent>

        {/* Tab de Estadísticas */}
        <TabsContent value="stats" className="space-y-6">
          <ControlArduinoStats
            stats={stats}
            status={status}
            loading={loading.stats}
            onExportData={exportData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
