"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, UserPlus, XCircle } from "lucide-react";
import { ICotizacion } from "@/lib/api/apiService";
import { EstadoBadge } from "./EstadoBadge";
import { formatServicio } from "./cotizaciones-utils";

interface TablaCotizacionesProps {
  cotizaciones: ICotizacion[];
  isLoading: boolean;
  onVerDetalle: (cotizacion: ICotizacion) => void;
  onRegistrarCliente: (cotizacion: ICotizacion) => void;
  onEliminar: (id: string) => void;
}

export function TablaCotizaciones({
  cotizaciones,
  isLoading,
  onVerDetalle,
  onRegistrarCliente,
  onEliminar,
}: TablaCotizacionesProps) {
  if (isLoading) {
    return <div className="text-center py-10">Cargando cotizaciones...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cotizaciones.map((cotizacion) => (
            <TableRow key={cotizacion._id}>
              <TableCell>
                <div className="font-medium">{cotizacion.nombre}</div>
                <div className="text-sm text-muted-foreground">
                  {cotizacion.email}
                </div>
              </TableCell>
              <TableCell>{formatServicio(cotizacion.servicio)}</TableCell>
              <TableCell>
                {format(new Date(cotizacion.fechaCreacion), "dd MMM yyyy", {
                  locale: es,
                })}
              </TableCell>
              <TableCell>
                <EstadoBadge estado={cotizacion.estado} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVerDetalle(cotizacion)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver</span>
                  </Button>

                  {(cotizacion.estado === "aprobada" ||
                    cotizacion.estado === "cotizada") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                      onClick={() => onRegistrarCliente(cotizacion)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="sr-only">Registrar Cliente</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onEliminar(cotizacion._id)}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
