"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { IEmpresa } from "./types";

interface DetalleEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: IEmpresa | null;
}

export function DetalleEmpresaModal({
  open,
  onOpenChange,
  empresa,
}: DetalleEmpresaModalProps) {
  if (!empresa) return null;

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: "bg-green-100 text-green-800",
      suspendido: "bg-yellow-100 text-yellow-800",
      inactivo: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={
          variants[estado as keyof typeof variants] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {estado}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Empresa</DialogTitle>
          <DialogDescription>
            Información completa de la empresa seleccionada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Información General</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Nombre:</strong> {empresa.nombreEmpresa}
                  </div>
                  <div>
                    <strong>Razón Social:</strong> {empresa.razonSocial}
                  </div>
                  <div>
                    <strong>RUT:</strong> {empresa.rut}
                  </div>
                  <div>
                    <strong>N° Cliente:</strong> {empresa.numeroCliente}
                  </div>
                  <div>
                    <strong>Estado:</strong> {getEstadoBadge(empresa.estado)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-2" />
                    {empresa.correo}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-2" />
                    {empresa.telefono}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    {empresa.direccion}
                  </div>
                  <div>
                    <strong>Ciudad:</strong> {empresa.ciudad}
                  </div>
                  <div>
                    <strong>Región:</strong> {empresa.region}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contacto Principal</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Nombre:</strong> {empresa.contactoPrincipal.nombre}
              </div>
              <div>
                <strong>Cargo:</strong> {empresa.contactoPrincipal.cargo}
              </div>
              <div>
                <strong>Teléfono:</strong> {empresa.contactoPrincipal.telefono}
              </div>
              <div>
                <strong>Correo:</strong> {empresa.contactoPrincipal.correo}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Historial</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Creada:</strong>
                <div className="flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(empresa.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
              {empresa.ultimoAcceso && (
                <div>
                  <strong>Último Acceso:</strong>
                  <div className="flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    {new Date(empresa.ultimoAcceso).toLocaleDateString()}
                  </div>
                </div>
              )}
              {empresa.fechaSuspension && (
                <div>
                  <strong>Suspendida:</strong>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {new Date(empresa.fechaSuspension).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {empresa.motivoSuspension && (
              <div className="mt-4">
                <strong>Motivo de Suspensión:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {empresa.motivoSuspension}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
