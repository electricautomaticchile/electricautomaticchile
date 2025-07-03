"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus,
  Download,
  RefreshCw,
  MoreHorizontal,
  FileSpreadsheet,
  FileText,
  Import,
  Settings,
} from "lucide-react";

interface ClientesAccionesProps {
  onNuevoCliente: () => void;
  onRefresh: () => void;
  onExportarExcel: () => void;
  onExportarCSV: () => void;
  onImportar?: () => void;
  onConfiguracion?: () => void;
  isRefreshing?: boolean;
  totalClientes: number;
  clientesFiltrados: number;
}

export function ClientesAcciones({
  onNuevoCliente,
  onRefresh,
  onExportarExcel,
  onExportarCSV,
  onImportar,
  onConfiguracion,
  isRefreshing = false,
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

        {/* Dropdown de acciones adicionales */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Más acciones
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {/* Sección de exportación */}
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Exportar
            </div>

            <DropdownMenuItem onClick={onExportarExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
              Exportar a Excel
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onExportarCSV}>
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Exportar a CSV
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Sección de herramientas */}
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Herramientas
            </div>

            {onImportar && (
              <DropdownMenuItem onClick={onImportar}>
                <Import className="h-4 w-4 mr-2 text-purple-600" />
                Importar clientes
              </DropdownMenuItem>
            )}

            {onConfiguracion && (
              <>
                <DropdownMenuItem onClick={onConfiguracion}>
                  <Settings className="h-4 w-4 mr-2 text-gray-600" />
                  Configuración
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
