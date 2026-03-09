import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileSpreadsheet, FileText, Wifi } from "lucide-react";
import { DispositivosAccionesProps } from "./types";

export function DispositivosActivosAcciones({
  busqueda,
  onBusquedaChange,
  tabActiva,
  onTabChange,
  loading,
  totalDispositivos,
  isWebSocketConnected,
  onExportarExcel,
  onExportarPDF,
}: DispositivosAccionesProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Dispositivos <span className="text-gradient-orange">Activos</span>
          </h2>
          <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs">
            {totalDispositivos} dispositivos
          </Badge>
          {isWebSocketConnected && (
            <div className="flex items-center gap-1.5 text-xs text-orange-400">
              <Wifi className="h-3 w-3" />
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              En vivo
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onExportarExcel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportarExcel}
              disabled={loading}
              className="gap-2 text-xs bg-[#0a0a0a] border-white/10 text-white/60 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              Excel
            </Button>
          )}
          {onExportarPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportarPDF}
              disabled={loading}
              className="gap-2 text-xs bg-[#0a0a0a] border-white/10 text-white/60 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
            >
              <FileText className="h-3.5 w-3.5 text-red-400" />
              PDF
            </Button>
          )}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, nombre o ubicación..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus:border-orange-500/50 rounded-xl"
        />
        {busqueda && (
          <button
            onClick={() => onBusquedaChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-orange-400"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
