"use client";

import { DispositivosActivosProps } from "./types";
import { useDispositivosActivos } from "./useDispositivosActivos";
import { DispositivosActivosStats } from "./DispositivosActivosStats";
import { DispositivosActivosAcciones } from "./DispositivosActivosAcciones";
import { DispositivosActivosTabla } from "./DispositivosActivosTabla";
import { DispositivosActivosReducido } from "./DispositivosActivosReducido";
import { ExportService } from "@/lib/api/services/exportService";
import { useToast } from "@/components/ui/use-toast";

export function DispositivosActivos({
  reducida = false,
}: DispositivosActivosProps) {
  const { toast } = useToast();
  const {
    loading,
    dispositivos,
    dispositivosOriginales,
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
      await ExportService.exportarDispositivosExcel();
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
      await ExportService.exportarDispositivosPDF();
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

  if (reducida) {
    return (
      <DispositivosActivosReducido
        dispositivos={dispositivosOriginales}
        resumen={resumenDispositivos}
        loading={loading}
      />
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <DispositivosActivosAcciones
          busqueda={filtros.busqueda}
          onBusquedaChange={cambiarBusqueda}
          tabActiva={filtros.tabActiva}
          onTabChange={cambiarTabActiva}
          loading={loading}
          onRefresh={refrescarDatos}
          totalDispositivos={resumenDispositivos.total}
          isWebSocketConnected={isWebSocketConnected}
          onExportarExcel={handleExportarExcel}
          onExportarPDF={handleExportarPDF}
        />

        <DispositivosActivosStats
          resumen={resumenDispositivos}
          loading={loading}
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
