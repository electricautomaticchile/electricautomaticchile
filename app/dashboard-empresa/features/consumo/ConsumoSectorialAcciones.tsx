import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { PERIODOS_DISPONIBLES } from "./config";
import { EstadoExportacion, TipoExportacion } from "./types";

interface ConsumoSectorialAccionesProps {
  periodoSeleccionado: string;
  onPeriodoChange: (periodo: string) => void;
  estadoExportacion: EstadoExportacion;
  onExportar: (tipo: TipoExportacion, formato?: "excel" | "csv") => void;
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExportar("equipamiento", "excel")}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Equipamiento
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onExportar("area", "excel")}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Área
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onExportar("horario", "excel")}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Horario
        </Button>
      </div>
    </div>
  );
}
