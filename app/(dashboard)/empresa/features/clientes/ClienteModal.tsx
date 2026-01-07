"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ICliente } from "@/lib/api/apiService";
import { TarifasService, Tarifa } from "@/lib/api/services/tarifasService";

import {
  useCreateClienteMutation,
  useUpdateClienteMutation,
} from '@/hooks/queries/useClientesQuery';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: ICliente | null;
  onSuccess: () => void;
}

export function ClienteModal({
  isOpen,
  onClose,
  cliente,
  onSuccess,
}: ClienteModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    rut: "",
    tipoCliente: "particular" as "particular" | "empresa",
    empresa: "",
    comuna: "",
    tipoTarifa: "BT1",
    tarifaId: "",
  });

  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [tarifasFiltradas, setTarifasFiltradas] = useState<Tarifa[]>([]);

  const { toast } = useToast();

  // Hooks de React Query para mutaciones
  const createMutation = useCreateClienteMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente se ha registrado exitosamente.",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear cliente",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al crear cliente: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useUpdateClienteMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Cliente actualizado",
          description:
            "Los datos del cliente se han actualizado correctamente.",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al actualizar cliente",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al actualizar cliente: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Estado de carga combinado
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const cargarTarifas = async () => {
      const response = await TarifasService.obtenerTarifas();
      if (response.success && response.data) {
        setTarifas(response.data);
      }
    };
    if (isOpen) {
      cargarTarifas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.comuna && formData.tipoTarifa) {
      const filtradas = tarifas.filter(
        t => t.comuna === formData.comuna && t.tipoTarifa === formData.tipoTarifa && t.activa
      );
      setTarifasFiltradas(filtradas);
      if (filtradas.length === 1) {
        setFormData(prev => ({ ...prev, tarifaId: filtradas[0]._id }));
      }
    } else {
      setTarifasFiltradas([]);
    }
  }, [formData.comuna, formData.tipoTarifa, tarifas]);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        correo: cliente.correo || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        ciudad: cliente.ciudad || "",
        rut: cliente.rut || "",
        tipoCliente: cliente.tipoCliente || "particular",
        empresa: cliente.empresa || "",
        comuna: (cliente as any).comuna || "",
        tipoTarifa: (cliente as any).tipoTarifa || "BT1",
        tarifaId: (cliente as any).tarifaId || "",
      });
    } else {
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        rut: "",
        tipoCliente: "particular",
        empresa: "",
        comuna: "",
        tipoTarifa: "BT1",
        tarifaId: "",
      });
    }
  }, [cliente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cliente) {
      // Actualizar cliente existente
      updateMutation.mutate({
        id: cliente._id,
        datos: formData,
      });
    } else {
      // Crear nuevo cliente
      createMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    // Resetear mutaciones si hay errores
    if (createMutation.isError) createMutation.reset();
    if (updateMutation.isError) updateMutation.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {cliente
              ? "Modifica los datos del cliente"
              : "Registra un nuevo cliente en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre completo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Email *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                placeholder="email@ejemplo.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+56 9 1234 5678"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
                placeholder="12.345.678-9"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
              <Select
                value={formData.tipoCliente}
                onValueChange={(value: "particular" | "empresa") =>
                  setFormData({ ...formData, tipoCliente: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipoCliente === "empresa" && (
              <div className="space-y-2">
                <Label htmlFor="empresa">Nombre de Empresa</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) =>
                    setFormData({ ...formData, empresa: e.target.value })
                  }
                  placeholder="Nombre de la empresa"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad: e.target.value })
                }
                placeholder="Santiago, Valparaíso, etc."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna *</Label>
              <Select
                value={formData.comuna}
                onValueChange={(value) =>
                  setFormData({ ...formData, comuna: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona comuna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Villa Alemana">Villa Alemana</SelectItem>
                  <SelectItem value="Quilpué">Quilpué</SelectItem>
                  <SelectItem value="La Calera">La Calera</SelectItem>
                  <SelectItem value="Limache">Limache</SelectItem>
                  <SelectItem value="Quillota">Quillota</SelectItem>
                  <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                  <SelectItem value="Viña del Mar">Viña del Mar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoTarifa">Tipo de Tarifa *</Label>
              <Select
                value={formData.tipoTarifa}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipoTarifa: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BT1">BT1 - Residencial</SelectItem>
                  <SelectItem value="BT41">BT41 - Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tarifasFiltradas.length > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Tarifa asignada: {tarifasFiltradas[0].distribuidora} - {tarifasFiltradas[0].tipoTarifa} ({tarifasFiltradas[0].comuna})
                <br />
                <span className="font-semibold">Precio base: ${tarifasFiltradas[0].precioKwhBase.toFixed(3)}/kWh</span>
              </p>
            </div>
          )}

          {formData.comuna && formData.tipoTarifa && tarifasFiltradas.length === 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠ No hay tarifa disponible para {formData.comuna} - {formData.tipoTarifa}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              placeholder="Dirección completa"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {cliente ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>{cliente ? "Actualizar Cliente" : "Crear Cliente"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
