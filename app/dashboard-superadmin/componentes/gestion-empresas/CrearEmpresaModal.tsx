"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICrearEmpresa } from "./types";

interface CrearEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nuevaEmpresa: ICrearEmpresa;
  onActualizarEmpresa: (campo: keyof ICrearEmpresa, valor: any) => void;
  onCrearEmpresa: () => Promise<void>;
  cargandoCreacion: boolean;
  regiones: string[];
}

export function CrearEmpresaModal({
  open,
  onOpenChange,
  nuevaEmpresa,
  onActualizarEmpresa,
  onCrearEmpresa,
  cargandoCreacion,
  regiones,
}: CrearEmpresaModalProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCrearEmpresa();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            Crear Nueva Empresa
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Completa la información para registrar una nueva empresa cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="empresa" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger
                value="empresa"
                className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2"
              >
                <span className="hidden sm:inline">Información de Empresa</span>
                <span className="sm:hidden">Empresa</span>
              </TabsTrigger>
              <TabsTrigger
                value="contacto"
                className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2"
              >
                <span className="hidden sm:inline">Contacto Principal</span>
                <span className="sm:hidden">Contacto</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="empresa" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
                  <Input
                    id="nombreEmpresa"
                    value={nuevaEmpresa.nombreEmpresa}
                    onChange={(e) =>
                      onActualizarEmpresa("nombreEmpresa", e.target.value)
                    }
                    placeholder="Empresa Eléctrica S.A."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={nuevaEmpresa.razonSocial}
                    onChange={(e) =>
                      onActualizarEmpresa("razonSocial", e.target.value)
                    }
                    placeholder="Empresa Eléctrica Sociedad Anónima"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT *</Label>
                  <Input
                    id="rut"
                    value={nuevaEmpresa.rut}
                    onChange={(e) => onActualizarEmpresa("rut", e.target.value)}
                    placeholder="76.123.456-7"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Corporativo *</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={nuevaEmpresa.correo}
                    onChange={(e) =>
                      onActualizarEmpresa("correo", e.target.value)
                    }
                    placeholder="contacto@empresa.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={nuevaEmpresa.telefono}
                    onChange={(e) =>
                      onActualizarEmpresa("telefono", e.target.value)
                    }
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Región *</Label>
                  <Select
                    value={nuevaEmpresa.region}
                    onValueChange={(value) =>
                      onActualizarEmpresa("region", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione región" />
                    </SelectTrigger>
                    <SelectContent>
                      {regiones.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    value={nuevaEmpresa.ciudad}
                    onChange={(e) =>
                      onActualizarEmpresa("ciudad", e.target.value)
                    }
                    placeholder="Santiago"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={nuevaEmpresa.direccion}
                    onChange={(e) =>
                      onActualizarEmpresa("direccion", e.target.value)
                    }
                    placeholder="Av. Principal 123, Santiago"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacto" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoNombre">Nombre Completo *</Label>
                  <Input
                    id="contactoNombre"
                    value={nuevaEmpresa.contactoPrincipal.nombre}
                    onChange={(e) =>
                      onActualizarEmpresa("contactoPrincipal", {
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoCargo">Cargo *</Label>
                  <Input
                    id="contactoCargo"
                    value={nuevaEmpresa.contactoPrincipal.cargo}
                    onChange={(e) =>
                      onActualizarEmpresa("contactoPrincipal", {
                        cargo: e.target.value,
                      })
                    }
                    placeholder="Gerente General"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoTelefono">Teléfono *</Label>
                  <Input
                    id="contactoTelefono"
                    value={nuevaEmpresa.contactoPrincipal.telefono}
                    onChange={(e) =>
                      onActualizarEmpresa("contactoPrincipal", {
                        telefono: e.target.value,
                      })
                    }
                    placeholder="+56 9 8765 4321"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoCorreo">Correo *</Label>
                  <Input
                    id="contactoCorreo"
                    type="email"
                    value={nuevaEmpresa.contactoPrincipal.correo}
                    onChange={(e) =>
                      onActualizarEmpresa("contactoPrincipal", {
                        correo: e.target.value,
                      })
                    }
                    placeholder="juan.perez@empresa.com"
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={cargandoCreacion}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto"
              disabled={cargandoCreacion}
            >
              {cargandoCreacion ? "Creando..." : "Crear Empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
