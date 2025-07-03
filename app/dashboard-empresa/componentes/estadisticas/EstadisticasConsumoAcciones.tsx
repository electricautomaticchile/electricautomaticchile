import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-600" />
          Estadísticas de Consumo
        </h2>
        <p className="text-gray-500 mt-1">
          Análisis detallado del consumo energético
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row items-end gap-3">
        {/* Selector de período */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select
            value={periodoSeleccionado}
            onValueChange={onPeriodoChange}
            disabled={loading || estaExportando}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS_DISPONIBLES.filter((p) => p.activo).map((periodo) => (
                <SelectItem key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botones de exportación */}
        <div className="flex items-center gap-2">
          {/* Exportación Excel */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || estaExportando}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
                <span className="text-xs opacity-60">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onExportar("mensual", "excel")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Mensuales
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportar("diario", "excel")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Diarios
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportar("horario", "excel")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Horarios
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Exportación CSV */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || estaExportando}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                CSV
                <span className="text-xs opacity-60">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onExportar("mensual", "csv")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Mensuales
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportar("diario", "csv")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Diarios
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportar("horario", "csv")}
                disabled={estaExportando}
              >
                <Download className="h-4 w-4 mr-2" />
                Datos Horarios
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
      </div>

      {/* Indicador de estado de exportación */}
      {estaExportando && (
        <div className="fixed top-4 right-4 z-50 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {estadoExportacion.estado === "generando"
                  ? "Generando reporte..."
                  : "Descargando..."}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {estadoExportacion.progreso.message}
              </div>
              {estadoExportacion.progreso.percentage > 0 && (
                <div className="w-48 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${estadoExportacion.progreso.percentage}%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
