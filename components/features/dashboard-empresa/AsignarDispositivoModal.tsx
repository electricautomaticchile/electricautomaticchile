"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AsignarDispositivoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispositivo: any;
  onSuccess: () => void;
}

export function AsignarDispositivoModal({
  open,
  onOpenChange,
  dispositivo,
  onSuccess,
}: AsignarDispositivoModalProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);

  useEffect(() => {
    if (open) {
      cargarClientes();
      if (dispositivo?.clienteId) {
        setClienteSeleccionado(dispositivo.clienteId);
      }
    }
  }, [open, dispositivo]);

  const cargarClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setClientes(data.data || []);
      }
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleAsignar = async () => {
    if (!clienteSeleccionado) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dispositivos/${dispositivo?.id || dispositivo?._id}/asignar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            clienteId: clienteSeleccionado,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error asignando dispositivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesasignar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dispositivos/${dispositivo?.id || dispositivo?._id}/desasignar`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error desasignando dispositivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Dispositivo</DialogTitle>
          <DialogDescription>
            Asigna el dispositivo {dispositivo?.numeroDispositivo} a un cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            {loadingClientes ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Select
                value={clienteSeleccionado}
                onValueChange={setClienteSeleccionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente._id} value={cliente._id}>
                      {cliente.nombre} - {cliente.numeroCliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          {dispositivo?.clienteId && (
            <Button
              variant="outline"
              onClick={handleDesasignar}
              disabled={isLoading}
            >
              Desasignar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleAsignar} disabled={isLoading || !clienteSeleccionado}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Asignando...
              </>
            ) : (
              "Asignar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
