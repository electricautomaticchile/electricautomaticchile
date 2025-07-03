import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ReporteExportMenu,
  FormatoExportacion,
  TipoReporte,
} from "@/components/ui/reporte-export-menu";
import { PERIODOS_DISPONIBLES } from "./config";
import { EstadoExportacion, TipoExportacion } from "./types";

interface ConsumoSectorialAccionesProps {
  periodoSeleccionado: string;
  onPeriodoChange: (periodo: string) => void;
  estadoExportacion: EstadoExportacion;
  onExportar: (
    tipo: TipoExportacion,
    formato?: "excel" | "csv" | "pdf"
  ) => void;
}

export function ConsumoSectorialAcciones({
  periodoSeleccionado,
  onPeriodoChange,
  estadoExportacion,
  onExportar,
}: ConsumoSectorialAccionesProps) {
  const isExporting =
    estadoExportacion.estado === "generando" ||
    estadoExportacion.estado === "descargando";

  const opcionesExportacion = [
    {
      tipo: "equipamiento" as TipoReporte,
      label: "Consumo por Equipamiento",
      descripcion: "Análisis detallado por tipo de equipo",
    },
    {
      tipo: "area" as TipoReporte,
      label: "Consumo por Área",
      descripcion: "Distribución de consumo por sectores",
    },
    {
      tipo: "horario" as TipoReporte,
      label: "Consumo por Horario",
      descripcion: "Patrones de consumo a lo largo del día",
    },
  ];

  const handleExportacion = (
    tipo: TipoReporte,
    formato: FormatoExportacion
  ) => {
    // Mapear TipoReporte a los tipos esperados por onExportar
    const tipoMapeado = tipo as TipoExportacion;
    onExportar(tipoMapeado, formato);
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        defaultValue={periodoSeleccionado}
        onValueChange={onPeriodoChange}
      >
        <SelectTrigger className="w-[180px]">
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

      <ReporteExportMenu
        opciones={opcionesExportacion}
        onExportar={handleExportacion}
        isExporting={isExporting}
        buttonText="Descargar Reporte"
        className="min-w-[150px]"
      />
    </div>
  );
}
