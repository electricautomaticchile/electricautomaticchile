"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import { ICotizacion } from "@/lib/api/apiService";
import { EstadoBadge } from "./EstadoBadge";
import { CotizacionesEstadisticas } from "./CotizacionesEstadisticas";
import { formatServicio, getEstadisticas } from "./cotizaciones-utils";

interface CotizacionesReducidasProps {
  cotizaciones: ICotizacion[];
  isLoading: boolean;
  onVerTodas?: () => void;
}

export function CotizacionesReducidas({
  cotizaciones,
  isLoading,
  onVerTodas,
}: CotizacionesReducidasProps) {
  const cotizacionesRecientes = cotizaciones.slice(0, 4);
  const estadisticas = getEstadisticas(cotizaciones);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Cotizaciones Recientes
            </CardTitle>
            <CardDescription>
              Gestión de solicitudes de clientes
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700"
            onClick={onVerTodas}
          >
            Ver todas <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">Cargando cotizaciones...</div>
        ) : (
          <>
            <CotizacionesEstadisticas
              estadisticas={estadisticas}
              reducida={true}
            />

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizacionesRecientes.map((cotizacion) => (
                    <TableRow key={cotizacion._id}>
                      <TableCell>
                        <div className="font-medium">{cotizacion.nombre}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {cotizacion.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatServicio(cotizacion.servicio)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <EstadoBadge estado={cotizacion.estado} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          {format(
                            new Date(cotizacion.fechaCreacion),
                            "dd MMM",
                            { locale: es }
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
