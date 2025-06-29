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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Key, Copy, AlertTriangle } from "lucide-react";
import { Credenciales } from "./types";

interface CredencialesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credenciales: Credenciales | null;
}

export function CredencialesModal({
  open,
  onOpenChange,
  credenciales,
}: CredencialesModalProps) {
  const { toast } = useToast();

  if (!credenciales) return null;

  const copiarAlPortapapeles = (texto: string, descripcion: string) => {
    navigator.clipboard.writeText(texto);
    toast({
      title: "Copiado",
      description: `${descripcion} copiado al portapapeles`,
    });
  };

  const copiarTodo = () => {
    const credencialesTexto = `
CREDENCIALES DE ACCESO - ${credenciales.numeroCliente}

Número de Cliente: ${credenciales.numeroCliente}
Correo: ${credenciales.correo}
Contraseña: ${credenciales.password}

URL de Acceso: ${window.location.origin}/auth/login

${credenciales.passwordTemporal ? "NOTA: Contraseña temporal - debe cambiarla en el primer acceso" : ""}
    `.trim();

    navigator.clipboard.writeText(credencialesTexto);
    toast({
      title: "Credenciales copiadas",
      description: "Todas las credenciales han sido copiadas al portapapeles",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Key className="h-5 w-5 text-blue-600" />
            Credenciales de Acceso
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Guarde estas credenciales y compártalas con la empresa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
            <Key className="h-4 w-4" />
            <AlertDescription className="font-medium text-blue-900 dark:text-blue-100">
              {credenciales.mensaje}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Número de Cliente
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copiarAlPortapapeles(
                      credenciales.numeroCliente.toString(),
                      "Número de cliente"
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="font-mono text-lg font-bold text-blue-600">
                {credenciales.numeroCliente}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo de Acceso
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copiarAlPortapapeles(credenciales.correo, "Correo")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="font-mono text-lg">{credenciales.correo}</div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña{" "}
                  {credenciales.passwordTemporal && (
                    <span className="text-orange-600 dark:text-orange-400">
                      (Temporal)
                    </span>
                  )}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copiarAlPortapapeles(credenciales.password, "Contraseña")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="font-mono text-lg font-bold text-green-600">
                {credenciales.password}
              </div>
            </div>
          </div>

          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-900 dark:text-amber-100">
              <strong>Instrucciones:</strong>
              <br />
              • La empresa debe acceder al dashboard usando estas credenciales
              <br />• URL de acceso:{" "}
              <code className="bg-white dark:bg-gray-800 px-1 rounded">
                {window.location.origin}/auth/login
              </code>
              {credenciales.passwordTemporal && (
                <>
                  <br />• Se solicitará cambiar la contraseña en el primer
                  acceso
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={copiarTodo}
            className="w-full sm:w-auto"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Todo
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
