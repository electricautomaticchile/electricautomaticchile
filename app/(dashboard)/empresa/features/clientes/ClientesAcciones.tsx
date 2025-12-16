"use client";
import { Button } from "@/components/ui/button";

import {
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { ReporteExportSimple } from "@/components/ui/reporte-export-menu";

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
  onRefresh,
  onExportarExcel,
  onExportarCSV,
  onExportarPDF,
  isRefreshing = false,
  isExporting = false,
  totalClientes,
  clientesFiltrados,
}: ClientesAccionesProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Información de totales */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>
          Mostrando{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {clientesFiltrados}
          </span>{" "}
          de{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {totalClientes}
          </span>{" "}
          clientes
        </span>
        {clientesFiltrados !== totalClientes && (
          <span className="text-orange-600 dark:text-orange-400">
            (filtrado)
          </span>
        )}
      </div>

      {/* Acciones principales */}
      <div className="flex flex-wrap gap-2">
        {/* Botón principal - Nuevo cliente */}
        <Button
          onClick={onNuevoCliente}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>

        {/* Botón de actualizar */}
        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </Button>

        {/* Componente unificado de exportación */}
        <ReporteExportSimple
          onExportarExcel={onExportarExcel}
          onExportarCSV={onExportarCSV}
          onExportarPDF={onExportarPDF}
          isExporting={isExporting}
          disabled={isRefreshing}
          className="min-w-[120px]"
        />
      </div>
    </div>
  );
}
