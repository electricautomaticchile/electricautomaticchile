"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronDown, X } from "lucide-react";

interface ClientesFiltrosProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filtroTipo: string;
  onFiltroTipoChange: (value: string) => void;
  filtroCiudad: string;
  onFiltroCiudadChange: (value: string) => void;
  filtroEstado?: string;
  onFiltroEstadoChange?: (value: string) => void;
  onLimpiarFiltros: () => void;
  ciudadesDisponibles?: string[];
}

export function ClientesFiltros({
  searchTerm,
  onSearchChange,
  filtroTipo,
  onFiltroTipoChange,
  filtroCiudad,
  onFiltroCiudadChange,
  filtroEstado,
  onFiltroEstadoChange,
  onLimpiarFiltros,
  ciudadesDisponibles = ["Santiago", "Valparaíso", "Concepción", "La Serena"],
}: ClientesFiltrosProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const hasActiveFilters =
    searchTerm !== "" ||
    filtroTipo !== "todos" ||
    filtroCiudad !== "todos" ||
    (filtroEstado && filtroEstado !== "todos");

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, email, teléfono o RUT..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Botón de filtros avanzados */}
        <DropdownMenu open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full">
                  {
                    [
                      searchTerm && "búsqueda",
                      filtroTipo !== "todos" && "tipo",
                      filtroCiudad !== "todos" && "ciudad",
                      filtroEstado && filtroEstado !== "todos" && "estado",
                    ].filter(Boolean).length
                  }
                </span>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">
            <div className="p-4 space-y-4">
              {/* Filtro por tipo de cliente */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Cliente</label>
                <Select value={filtroTipo} onValueChange={onFiltroTipoChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por ciudad */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ciudad</label>
                <Select
                  value={filtroCiudad}
                  onValueChange={onFiltroCiudadChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las ciudades</SelectItem>
                    {ciudadesDisponibles.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por estado (opcional) */}
              {onFiltroEstadoChange && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filtroEstado || "todos"}
                    onValueChange={onFiltroEstadoChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <DropdownMenuSeparator />

              {/* Acciones */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLimpiarFiltros}
                  className="flex-1"
                  disabled={!hasActiveFilters}
                >
                  Limpiar filtros
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAdvancedOpen(false)}
                  className="flex-1"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Indicadores de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              <span>Búsqueda: &quot;{searchTerm}&quot;</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800"
                onClick={() => onSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filtroTipo !== "todos" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              <span>
                Tipo: {filtroTipo === "particular" ? "Particular" : "Empresa"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-green-600 hover:text-green-800"
                onClick={() => onFiltroTipoChange("todos")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filtroCiudad !== "todos" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              <span>Ciudad: {filtroCiudad}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-purple-600 hover:text-purple-800"
                onClick={() => onFiltroCiudadChange("todos")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filtroEstado && filtroEstado !== "todos" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
              <span>Estado: {filtroEstado}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-orange-600 hover:text-orange-800"
                onClick={() => onFiltroEstadoChange?.("todos")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
