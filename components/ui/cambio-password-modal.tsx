"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import { Eye, EyeOff, KeyRound, AlertCircle, CheckCircle } from "lucide-react";

interface CambioPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mostrarAdvertencia?: boolean;
}

export function CambioPasswordModal({
  isOpen,
  onClose,
  onSuccess,
  mostrarAdvertencia = false,
}: CambioPasswordModalProps) {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordNueva, setShowPasswordNueva] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();

  // Validaciones
  const isPasswordValid = passwordNueva.length >= 8;
  const passwordsMatch = passwordNueva === confirmarPassword;
  const isFormValid =
    passwordActual &&
    passwordNueva &&
    confirmarPassword &&
    isPasswordValid &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Por favor complete todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Cambiando contraseña...");

      const response = await apiService.cambiarPassword(
        passwordActual,
        passwordNueva
      );

      if (response.success) {
        console.log("✅ Contraseña cambiada exitosamente");

        toast({
          variant: "default",
          title: "Contraseña actualizada",
          description: "Su contraseña ha sido cambiada exitosamente",
        });

        // Limpiar flag de cambio de contraseña requerido
        if (typeof window !== "undefined") {
          localStorage.removeItem("requiereCambioPassword");
        }

        // Resetear formulario
        setPasswordActual("");
        setPasswordNueva("");
        setConfirmarPassword("");
        setError("");

        onSuccess();
        onClose();
      } else {
        console.error("❌ Error al cambiar contraseña:", response.error);
        setError(response.error || "Error al cambiar contraseña");
      }
    } catch (error) {
      console.error("💥 Error inesperado:", error);
      setError("Error inesperado. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!mostrarAdvertencia) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-orange-600" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            {mostrarAdvertencia
              ? "Debe cambiar su contraseña temporal antes de continuar"
              : "Actualice su contraseña para mayor seguridad"}
          </DialogDescription>
        </DialogHeader>

        {mostrarAdvertencia && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Su contraseña actual es temporal y debe ser cambiada por
              seguridad.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña Actual */}
          <div className="space-y-2">
            <Label htmlFor="passwordActual">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="passwordActual"
                type={showPasswordActual ? "text" : "password"}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="Ingrese su contraseña actual"
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPasswordActual(!showPasswordActual)}
                disabled={isLoading}
              >
                {showPasswordActual ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="passwordNueva">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="passwordNueva"
                type={showPasswordNueva ? "text" : "password"}
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPasswordNueva(!showPasswordNueva)}
                disabled={isLoading}
              >
                {showPasswordNueva ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {passwordNueva && !isPasswordValid && (
              <p className="text-sm text-red-500">
                La contraseña debe tener al menos 8 caracteres
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmarPassword">
              Confirmar Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmarPassword"
                type={showConfirmarPassword ? "text" : "password"}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repita la nueva contraseña"
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmarPassword(!showConfirmarPassword)}
                disabled={isLoading}
              >
                {showConfirmarPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {confirmarPassword && !passwordsMatch && (
              <p className="text-sm text-red-500">
                Las contraseñas no coinciden
              </p>
            )}
            {confirmarPassword && passwordsMatch && isPasswordValid && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex gap-2">
            {!mostrarAdvertencia && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
