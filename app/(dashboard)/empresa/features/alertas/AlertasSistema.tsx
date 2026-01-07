"use client";

import { AlertasSistemaProps } from './types';
import { useAlertasSistema } from './useAlertasSistema';
import { AlertasSistemaStats } from './AlertasSistemaStats';
import { AlertasSistemaAcciones } from './AlertasSistemaAcciones';
import { AlertasSistemaFiltros } from './AlertasSistemaFiltros';
import { AlertasSistemaLista } from './AlertasSistemaLista';
import { AlertasSistemaReducido } from './AlertasSistemaReducido';
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { ExportService } from "@/lib/api/services/exportService";
import { useToast } from "@/components/ui/use-toast";

export function AlertasSistema({ reducida = false }: AlertasSistemaProps) {
  const { toast } = useToast();
  const {
    alertas,
    alertaExpandida,
    resumenAlertas,
    estadosCarga,
    filtros,
    isConnected,

    toggleAlerta,
    simularAlerta,
    asignarAlerta,
    resolverAlerta,
    marcarComoVista,
    eliminarAlerta,
    marcarTodasLeidas,

    cambiarFiltroTipo,
    cambiarFiltroEstado,
    cambiarBusqueda,

    clearAll,
  } = useAlertasSistema();

  const { busqueda, tipo: filtroTipo, estado: filtroEstado } = filtros;
  const loading = estadosCarga.alertas || estadosCarga.accion;

  const handleExportarExcel = async () => {
    try {
      await ExportService.exportarAlertasExcel();
      toast({
        title: "Exportación exitosa",
        description: "El archivo Excel se ha descargado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  if (reducida) {
    return (
      <AlertasSistemaReducido
        alertas={alertas}
        resumen={resumenAlertas}
        loading={loading}
      />
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <AlertasSistemaAcciones
          isConnected={isConnected}
          busqueda={busqueda}
          onBusquedaChange={cambiarBusqueda}
          onSimularAlerta={simularAlerta}
          onMarcarTodasLeidas={marcarTodasLeidas}
          resumenAlertas={resumenAlertas}
          loading={loading}
          onExportarExcel={handleExportarExcel}
        />

        <AlertasSistemaStats
          resumen={resumenAlertas}
          loading={loading}
        />

        <AlertasSistemaFiltros
          filtroTipo={filtroTipo}
          filtroEstado={filtroEstado}
          onFiltroTipoChange={cambiarFiltroTipo}
          onFiltroEstadoChange={cambiarFiltroEstado}
          resumenAlertas={resumenAlertas}
        />

        <AlertasSistemaLista
          alertas={alertas}
          alertaExpandida={alertaExpandida}
          loading={loading}
          onToggleAlerta={toggleAlerta}
          onAsignarAlerta={asignarAlerta}
          onResolverAlerta={resolverAlerta}
          onMarcarComoVista={marcarComoVista}
          onEliminarAlerta={eliminarAlerta}
          busqueda={busqueda}
        />

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {alertas.length} de {resumenAlertas.total} alertas •{" "}
            {resumenAlertas.importantes} importantes sin leer •{" "}
            {resumenAlertas.resueltas} resueltas este mes
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={resumenAlertas.total === 0 || loading}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar todo</span>
              <span className="sm:hidden">Limpiar</span>
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurar notificaciones</span>
              <span className="sm:hidden">Config</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
