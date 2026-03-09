import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellRing, FileSpreadsheet, FileText } from "lucide-react";
import { AlertasSistemaAccionesProps } from './types';

interface AlertasSistemaAccionesExtendedProps extends AlertasSistemaAccionesProps {
  onExportarPDF?: () => void;
}

export function AlertasSistemaAcciones({
  resumenAlertas,
  loading = false,
  onExportarExcel,
  onExportarPDF,
}: AlertasSistemaAccionesExtendedProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Centro de <span className="text-gradient-orange">Alertas</span>
        </h2>
        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs">
          {resumenAlertas.total} alertas
        </Badge>
        {resumenAlertas.noLeidas > 0 && (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs">
            {resumenAlertas.noLeidas} sin leer
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onExportarExcel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportarExcel}
            disabled={loading}
            className="gap-2 text-xs hover:border-orange-500/40 hover:bg-orange-500/5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </Button>
        )}
        {onExportarPDF && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportarPDF}
            disabled={loading}
            className="gap-2 text-xs hover:border-orange-500/40 hover:bg-orange-500/5"
          >
            <FileText className="h-3.5 w-3.5" />
            PDF
          </Button>
        )}
      </div>
    </div>
  );
}
