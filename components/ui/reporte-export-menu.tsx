"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReporteExportSimpleProps {
  onExportarExcel: () => void;
  onExportarCSV: () => void;
  onExportarPDF?: () => void;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isExporting}
          className={cn(className)}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportarExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Exportar a Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportarCSV}>
          <FileText className="h-4 w-4 mr-2 text-blue-600" />
          Exportar a CSV
        </DropdownMenuItem>
        {onExportarPDF && (
          <DropdownMenuItem onClick={onExportarPDF}>
            <FileType className="h-4 w-4 mr-2 text-red-600" />
            Exportar a PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
