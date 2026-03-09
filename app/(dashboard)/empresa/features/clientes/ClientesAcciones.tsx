"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, FileSpreadsheet, FileText } from "lucide-react";

interface ClientesAccionesProps {
  onNuevoCliente: () => void;
  onRefresh: () => void;
  onExportarExcel: () => void;
  onExportarCSV: () => void;
  onExportarPDF?: () => void;
  isRefreshing?: boolean;
  isExporting?: boolean;
  totalClientes: number;
  clientesFiltrados: number;
}

export function ClientesAcciones({
  onNuevoCliente,
  onExportarExcel,
  onExportarPDF,
  isRefreshing = false,
  totalClientes,
  clientesFiltrados,
}: ClientesAccionesProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Gestión de <span className="text-gradient-orange">Clientes</span>
        </h2>
        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs">
          {totalClientes} clientes
        </Badge>
        {clientesFiltrados !== totalClientes && (
          <Badge className="bg-white/10 text-white/60 border border-white/10 text-xs">
            {clientesFiltrados} filtrados
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onExportarExcel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportarExcel}
            disabled={isRefreshing}
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
            disabled={isRefreshing}
            className="gap-2 text-xs bg-[#0a0a0a] border-white/10 text-white/60 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5"
          >
            <FileText className="h-3.5 w-3.5 text-red-400" />
            PDF
          </Button>
        )}
        <Button
          size="sm"
          onClick={onNuevoCliente}
          className="gap-2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Nuevo Cliente
        </Button>
      </div>
    </div>
  );
}
