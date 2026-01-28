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
import { useClientesQuery, useAsignarDispositivo, useDesasignarDispositivo } from "@/hooks/queries";
import { InlineLoadingState } from "@/components/shared";

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
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  const { data: clientesData, isLoading: loadingClientes } = useClientesQuery();
  const asignarMutation = useAsignarDispositivo();
  const desasignarMutation = useDesasignarDispositivo();
  const clientes = clientesData?.data || [];

  useEffect(() => {
    if (open && dispositivo?.clienteId) {
      setClienteSeleccionado(dispositivo.clienteId);
    }
  }, [open, dispositivo]);

  const handleAsignar = async () => {
    if (!clienteSeleccionado) return;

    asignarMutation.mutate(
      {
        dispositivoId: dispositivo?.id || dispositivo?._id,
        clienteId: clienteSeleccionado,
      },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
      }
    );
  };

  const handleDesasignar = async () => {
    desasignarMutation.mutate(dispositivo?.id || dispositivo?._id, {
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
      },
    });
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
              <InlineLoadingState message="Cargando clientes..." />
            ) : (
              <Select
                value={clienteSeleccionado}
                onValueChange={setClienteSeleccionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente: any) => (
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
              disabled={desasignarMutation.isPending}
            >
              Desasignar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={asignarMutation.isPending || desasignarMutation.isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleAsignar} disabled={asignarMutation.isPending || !clienteSeleccionado}>
            {asignarMutation.isPending ? (
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
