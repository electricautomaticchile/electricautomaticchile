"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Activity, BarChart3 } from "lucide-react";
import { ControlArduinoProps } from './types';
import { useControlArduino } from './useControlArduino';
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
    isLoading
  } = useControlArduino();

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
      <ControlArduinoHeader
        status={status}
        autoRefresh={autoRefresh}
        loading={loading.connection}
        onConnect={connectArduino}
        onDisconnect={disconnectArduino}
        onToggleAutoRefresh={toggleAutoRefresh}
      />

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
