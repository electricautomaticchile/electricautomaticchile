"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileImage,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FormatoExportacion = "excel" | "csv" | "pdf";
export type TipoReporte =
  | "mensual"
  | "diario"
  | "horario"
  | "equipamiento"
  | "area"
  | "completo";

interface OpcionExportacion {
  tipo: TipoReporte;
  label: string;
  descripcion?: string;
}

interface ReporteExportMenuProps {
  // Opciones de reportes disponibles
  opciones: OpcionExportacion[];

  // Callback para manejar la exportación
  onExportar: (tipo: TipoReporte, formato: FormatoExportacion) => void;

  // Estado de la exportación
  isExporting?: boolean;
  tipoExportandose?: TipoReporte;

  // Configuración visual
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;

  // Texto personalizable
  buttonText?: string;

  // Formatos habilitados (por defecto todos)
  formatosHabilitados?: FormatoExportacion[];

  // Clase CSS adicional
  className?: string;
}

const FORMATOS_CONFIG = {
  excel: {
    icon: FileSpreadsheet,
    label: "Excel",
    descripcion: "Formato .xlsx profesional",
    color: "text-green-600",
  },
  csv: {
    icon: FileText,
    label: "CSV",
    descripcion: "Texto separado por comas",
    color: "text-blue-600",
  },
  pdf: {
    icon: FileImage,
    label: "PDF",
    descripcion: "Documento con diseño",
    color: "text-red-600",
  },
} as const;

export function ReporteExportMenu({
  opciones,
  onExportar,
  isExporting = false,
  tipoExportandose,
  variant = "outline",
  size = "sm",
  disabled = false,
  buttonText = "Exportar Reporte",
  formatosHabilitados = ["excel", "csv", "pdf"],
  className,
}: ReporteExportMenuProps) {
  const isDisabled = disabled || isExporting;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isDisabled}
          className={cn("flex items-center gap-2 min-w-[140px]", className)}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isExporting ? "Exportando..." : buttonText}
          </span>
          <span className="sm:hidden">{isExporting ? "..." : "Exportar"}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
        <DropdownMenuLabel className="text-sm font-medium">
          Descargar Reporte
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {opciones.map((opcion, index) => (
          <div key={opcion.tipo}>
            {/* Solo mostrar el nombre del reporte si hay múltiples opciones */}
            {opciones.length > 1 && (
              <>
                <div className="px-2 py-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {opcion.label}
                  </p>
                </div>
              </>
            )}

            {/* Formatos en una lista simple */}
            {formatosHabilitados.map((formato) => {
              const config = FORMATOS_CONFIG[formato];
              const IconComponent = config.icon;
              const estaExportando =
                isExporting && tipoExportandose === opcion.tipo;

              return (
                <DropdownMenuItem
                  key={`${opcion.tipo}-${formato}`}
                  onClick={() => onExportar(opcion.tipo, formato)}
                  disabled={isDisabled}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  {estaExportando ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : (
                    <IconComponent className={cn("h-4 w-4", config.color)} />
                  )}

                  <span className="flex-1 text-sm">{config.label}</span>

                  {estaExportando && (
                    <div className="text-xs text-gray-500">...</div>
                  )}
                </DropdownMenuItem>
              );
            })}

            {/* Separador solo si hay múltiples tipos */}
            {opciones.length > 1 && index < opciones.length - 1 && (
              <DropdownMenuSeparator />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente simplificado para casos básicos
interface ReporteExportSimpleProps {
  onExportarExcel: () => void;
  onExportarCSV: () => void;
  onExportarPDF: () => void;
  isExporting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ReporteExportSimple({
  onExportarExcel,
  onExportarCSV,
  onExportarPDF,
  isExporting = false,
  disabled = false,
  className,
}: ReporteExportSimpleProps) {
  return (
    <ReporteExportMenu
      opciones={[
        {
          tipo: "completo",
          label: "Reporte Completo",
          descripcion: "Incluye todos los datos disponibles",
        },
      ]}
      onExportar={(_, formato) => {
        switch (formato) {
          case "excel":
            onExportarExcel();
            break;
          case "csv":
            onExportarCSV();
            break;
          case "pdf":
            onExportarPDF();
            break;
        }
      }}
      isExporting={isExporting}
      disabled={disabled}
      className={className}
      buttonText="Descargar"
    />
  );
}
