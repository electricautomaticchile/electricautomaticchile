"use client";

import { AlertasSistemaProps } from './types';
import { useAlertasSistema } from './useAlertasSistema';
import { AlertasSistemaStats } from './AlertasSistemaStats';
import { AlertasSistemaAcciones } from './AlertasSistemaAcciones';
import { AlertasSistemaLista } from './AlertasSistemaLista';
import { AlertasSistemaReducido } from './AlertasSistemaReducido';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ReportesService } from "@/lib/api/services/reportesService";
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
      await ReportesService.alertasExcel();
      toast({ title: "Exportación exitosa", description: "El archivo Excel se ha descargado correctamente." });
    } catch (error) {
      toast({ title: "Error al exportar", description: error instanceof Error ? error.message : "Error desconocido", variant: "destructive" });
    }
  };

  const handleExportarPDF = async () => {
    try {
      await ReportesService.alertasPDF();
      toast({ title: "Exportación exitosa", description: "El archivo PDF se ha descargado correctamente." });
    } catch (error) {
      toast({ title: "Error al exportar", description: error instanceof Error ? error.message : "Error desconocido", variant: "destructive" });
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
    <div className="bg-background p-6 rounded-lg border border-orange-500/20">
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
          onExportarPDF={handleExportarPDF}
        />

        <AlertasSistemaStats
          resumen={resumenAlertas}
          loading={loading}
          filtroTipo={filtroTipo}
          filtroEstado={filtroEstado}
          onFiltroTipoChange={cambiarFiltroTipo}
          onFiltroEstadoChange={cambiarFiltroEstado}
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

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <p className="text-xs text-white/30">
            {alertas.length} de {resumenAlertas.total} alertas · {resumenAlertas.importantes} importantes · {resumenAlertas.resueltas} resueltas
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={resumenAlertas.total === 0 || loading}
            className="gap-2 text-xs text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpiar todo
          </Button>
        </div>
      </div>
    </div>
  );
}
