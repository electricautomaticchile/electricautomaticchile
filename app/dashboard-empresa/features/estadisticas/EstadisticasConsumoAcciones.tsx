import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, RefreshCw, Settings } from "lucide-react";
import {
  ReporteExportMenu,
  FormatoExportacion,
  TipoReporte,
} from "@/components/ui/reporte-export-menu";
import { EstadisticasAccionesProps } from "./types";
import { PERIODOS_DISPONIBLES } from "./config";

export function EstadisticasConsumoAcciones({
  periodoSeleccionado,
  onPeriodoChange,
  onExportar,
  estadoExportacion,
  loading,
}: EstadisticasAccionesProps) {
  const estaExportando =
    estadoExportacion.estado === "generando" ||
    estadoExportacion.estado === "descargando";

  const opcionesExportacion = [
    {
      tipo: "mensual" as TipoReporte,
      label: "Datos Mensuales",
      descripcion: "Consumo agregado por mes",
    },
    {
      tipo: "diario" as TipoReporte,
      label: "Datos Diarios",
      descripcion: "Consumo detallado por día",
    },
    {
      tipo: "horario" as TipoReporte,
      label: "Datos Horarios",
      descripcion: "Consumo detallado por hora",
    },
  ];

  const handleExportacion = (
    tipo: TipoReporte,
    formato: FormatoExportacion
  ) => {
    // Mapear TipoReporte a los tipos esperados por onExportar
    const tipoMapeado = tipo as "mensual" | "diario" | "horario";
    onExportar(tipoMapeado, formato);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Información del período */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Estadísticas de Consumo
          </span>
        </div>

        <Select
          value={periodoSeleccionado}
          onValueChange={onPeriodoChange}
          disabled={loading || estaExportando}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            {PERIODOS_DISPONIBLES.map((periodo) => (
              <SelectItem key={periodo.value} value={periodo.value}>
                {periodo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Controles de exportación y acciones */}
      <div className="flex items-center gap-3">
        {/* Nuevo componente unificado de exportación */}
        <ReporteExportMenu
          opciones={opcionesExportacion}
          onExportar={handleExportacion}
          isExporting={estaExportando}
          disabled={loading}
          buttonText="Exportar Estadísticas"
          className="min-w-[160px]"
        />

        {/* Botón de actualización */}
        <Button
          variant="outline"
          size="sm"
          disabled={loading || estaExportando}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>

        {/* Botón de configuración */}
        <Button
          variant="outline"
          size="sm"
          disabled={loading || estaExportando}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurar
        </Button>
      </div>

      {/* Indicador de estado de exportación */}
      {estaExportando && (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>{estadoExportacion.progreso?.message || "Exportando..."}</span>
          <span className="ml-2 font-medium">
            {estadoExportacion.progreso?.percentage || 0}%
          </span>
        </div>
      )}
    </div>
  );
}
