"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, XCircle } from "lucide-react";
import { ICotizacion } from "@/lib/api/apiService";
import { EstadoBadge } from "./EstadoBadge";
import { formatServicio } from "./cotizaciones-utils";

interface ModalDetallesCotizacionProps {
  cotizacion: ICotizacion | null;
  isOpen: boolean;
  isUpdating: boolean;
  errorMsg: string | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    estado: ICotizacion["estado"],
    monto?: number,
    comentarios?: string
  ) => void;
  onRegistrarCliente: (cotizacion: ICotizacion) => void;
  onEliminar: (id: string) => void;
}

export function ModalDetallesCotizacion({
  cotizacion,
  isOpen,
  isUpdating,
  errorMsg,
  onClose,
  onUpdate,
  onRegistrarCliente,
  onEliminar,
}: ModalDetallesCotizacionProps) {
  const [nuevoEstado, setNuevoEstado] =
    useState<ICotizacion["estado"]>("pendiente");
  const [nuevoMonto, setNuevoMonto] = useState<string>("");
  const [nuevosComentarios, setNuevosComentarios] = useState<string>("");

  // Actualizar formulario cuando cambia la cotización
  useEffect(() => {
    if (cotizacion) {
      setNuevoEstado(cotizacion.estado);
      setNuevoMonto(cotizacion.total?.toString() || "");
      setNuevosComentarios(cotizacion.notas || "");
    }
  }, [cotizacion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cotizacion || !nuevoEstado) return;

    const montoNumerico = nuevoMonto ? parseFloat(nuevoMonto) : undefined;
    const comentarios = nuevosComentarios || undefined;

    onUpdate(cotizacion._id, nuevoEstado, montoNumerico, comentarios);
  };

  if (!cotizacion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalles de Cotización</DialogTitle>
          <DialogDescription>
            Información completa de la solicitud de cotización
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Información del Cliente
            </h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {cotizacion.nombre}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {cotizacion.email}
              </p>
              {cotizacion.empresa && (
                <p>
                  <span className="font-semibold">Empresa:</span>{" "}
                  {cotizacion.empresa}
                </p>
              )}
              {cotizacion.telefono && (
                <p>
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {cotizacion.telefono}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Detalles de la Solicitud
            </h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-semibold">Servicio:</span>{" "}
                {formatServicio(cotizacion.servicio)}
              </p>
              {cotizacion.plazo && (
                <p>
                  <span className="font-semibold">Plazo:</span>{" "}
                  {cotizacion.plazo}
                </p>
              )}
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {format(
                  new Date(cotizacion.fechaCreacion),
                  "dd 'de' MMMM 'de' yyyy, HH:mm",
                  { locale: es }
                )}
              </p>
              <p>
                <span className="font-semibold">Estado actual:</span>{" "}
                <EstadoBadge estado={cotizacion.estado} />
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Mensaje</h3>
          <div className="mt-2 p-3 rounded-md">
            <p className="whitespace-pre-wrap">{cotizacion.mensaje}</p>
          </div>
        </div>

        {/* Formulario para actualizar la cotización */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estado" className="block text-sm font-medium">
                Actualizar Estado
              </label>
              <select
                id="estado"
                value={nuevoEstado}
                onChange={(e) =>
                  setNuevoEstado(e.target.value as ICotizacion["estado"])
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="" disabled>
                  Seleccionar estado
                </option>
                <option value="pendiente">Pendiente</option>
                <option value="en_revision">En Revisión</option>
                <option value="cotizando">Cotizando</option>
                <option value="cotizada">Cotizada</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="convertida_cliente">Cliente</option>
              </select>
            </div>

            <div>
              <label htmlFor="monto" className="block text-sm font-medium">
                Monto (opcional)
              </label>
              <input
                type="number"
                id="monto"
                value={nuevoMonto}
                onChange={(e) => setNuevoMonto(e.target.value)}
                placeholder="Ej: 1500000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comentarios" className="block text-sm font-medium">
              Comentarios (opcional)
            </label>
            <textarea
              id="comentarios"
              value={nuevosComentarios}
              onChange={(e) => setNuevosComentarios(e.target.value)}
              rows={3}
              placeholder="Detalles adicionales o comentarios sobre la cotización"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              {errorMsg}
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isUpdating || !nuevoEstado}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isUpdating ? "Actualizando..." : "Actualizar Cotización"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onRegistrarCliente(cotizacion)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Registrar como Cliente
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onClose();
                onEliminar(cotizacion._id);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Eliminar Cotización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
