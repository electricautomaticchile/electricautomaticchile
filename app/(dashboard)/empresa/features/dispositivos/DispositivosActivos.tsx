"use client";

import { useDispositivosActivos } from "./useDispositivosActivos";
import { DispositivosActivosStats } from "./DispositivosActivosStats";
import { DispositivosActivosAcciones } from "./DispositivosActivosAcciones";
import { DispositivosActivosTabla } from "./DispositivosActivosTabla";
import { ReportesService } from "@/lib/api/services/reportesService";
import { useToast } from "@/components/ui/use-toast";

export function DispositivosActivos() {
  const { toast } = useToast();
  const {
    loading,
    dispositivos,
    resumenDispositivos,
    filtros,
    isWebSocketConnected,
    cambiarBusqueda,
    cambiarTabActiva,
    controlarDispositivo,
    refrescarDatos,
  } = useDispositivosActivos();

  const handleExportarExcel = async () => {
    try {
      await ReportesService.dispositivosExcel();
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

  const handleExportarPDF = async () => {
    try {
      await ReportesService.dispositivosPDF();
      toast({
        title: "Exportación exitosa",
        description: "El archivo PDF se ha descargado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="bg-background p-6 rounded-lg border border-orange-500/20">
      <div className="space-y-6">
        <DispositivosActivosAcciones
          busqueda={filtros.busqueda}
          onBusquedaChange={cambiarBusqueda}
          tabActiva={filtros.tabActiva}
          onTabChange={cambiarTabActiva}
          loading={loading}
          totalDispositivos={resumenDispositivos.total}
          isWebSocketConnected={isWebSocketConnected}
          onExportarExcel={handleExportarExcel}
          onExportarPDF={handleExportarPDF}
        />

        <DispositivosActivosStats
          resumen={resumenDispositivos}
          loading={loading}
          tabActiva={filtros.tabActiva}
          onTabChange={cambiarTabActiva}
        />

        <DispositivosActivosTabla
          dispositivos={dispositivos}
          loading={loading}
          onControl={controlarDispositivo}
          onRefresh={refrescarDatos}
        />
      </div>
    </div>
  );
}
