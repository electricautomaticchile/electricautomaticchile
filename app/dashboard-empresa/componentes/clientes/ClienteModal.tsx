"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// Importar los hooks de React Query
import {
  useCreateClienteMutation,
  useUpdateClienteMutation,
} from "@/lib/hooks/queries/useClientesQuery";

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
    planSeleccionado: "",
    montoMensual: 0,
    notas: "",
  });

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
        planSeleccionado: cliente.planSeleccionado || "",
        montoMensual: cliente.montoMensual || 0,
        notas: cliente.notas || "",
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
        planSeleccionado: "",
        montoMensual: 0,
        notas: "",
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
              <Label htmlFor="planSeleccionado">Plan</Label>
              <Select
                value={formData.planSeleccionado}
                onValueChange={(value) =>
                  setFormData({ ...formData, planSeleccionado: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoMensual">Monto Mensual ($)</Label>
              <Input
                id="montoMensual"
                type="number"
                min="0"
                value={formData.montoMensual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    montoMensual: Number(e.target.value),
                  })
                }
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
              placeholder="Notas adicionales..."
              rows={3}
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
