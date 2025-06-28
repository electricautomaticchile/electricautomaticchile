"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalConfirmacionEliminacionProps {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ModalConfirmacionEliminacion({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ModalConfirmacionEliminacionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar esta cotización? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Al eliminar esta cotización, se perderán todos los datos asociados,
            incluyendo los comentarios y el historial de cambios.
          </p>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar Cotización"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
