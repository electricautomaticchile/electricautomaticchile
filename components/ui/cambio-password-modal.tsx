"use client";
import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, X } from "lucide-react";

interface CambioPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (currentPassword: string, newPassword: string) => Promise<void>;
  requiereActual?: boolean;
  esForzado?: boolean;
}

function usePasswordStrength(password: string) {
  return useMemo(() => ({
    longitud:   password.length >= 8,
    mayuscula:  /[A-Z]/.test(password),
    minuscula:  /[a-z]/.test(password),
    numero:     /[0-9]/.test(password),
    especial:   /[^A-Za-z0-9]/.test(password),
  }), [password]);
}

export function CambioPasswordModal({
  open, onOpenChange, onConfirm, requiereActual = true, esForzado = false,
}: CambioPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requisitos = usePasswordStrength(newPassword);
  const passwordValida = Object.values(requisitos).every(Boolean);

  const handleSubmit = async () => {
    setError("");
    if (!passwordValida) {
      setError("La contraseña no cumple los requisitos de seguridad");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (requiereActual && !currentPassword) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }
    setIsLoading(true);
    try {
      await onConfirm(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const Req = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {ok
        ? <Check className="h-3 w-3 text-green-500" />
        : <X className="h-3 w-3 text-muted-foreground" />}
      <span className={ok ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>{label}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={esForzado ? () => {} : onOpenChange}>
      <DialogContent className={esForzado ? "pointer-events-auto" : ""}>
        <DialogHeader>
          <DialogTitle>{esForzado ? "Cambio de Contraseña Obligatorio" : "Cambiar Contraseña"}</DialogTitle>
          <DialogDescription>
            {esForzado
              ? "Por seguridad, debes cambiar tu contraseña temporal antes de continuar"
              : "Ingresa tu contraseña actual y la nueva contraseña"}
          </DialogDescription>
        </DialogHeader>

        {esForzado && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Tu contraseña actual es temporal. Por favor, cámbiala por una contraseña segura.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {requiereActual && (
            <div>
              <Label htmlFor="current">Contraseña Actual</Label>
              <Input id="current" type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña temporal" />
            </div>
          )}
          <div>
            <Label htmlFor="new">Nueva Contraseña</Label>
            <Input id="new" type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ej: MiClave2024!" />
            {newPassword.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1 p-2 bg-muted/50 rounded-lg">
                <Req ok={requisitos.longitud}  label="Mínimo 8 caracteres" />
                <Req ok={requisitos.mayuscula} label="Una mayúscula" />
                <Req ok={requisitos.minuscula} label="Una minúscula" />
                <Req ok={requisitos.numero}    label="Un número" />
                <Req ok={requisitos.especial}  label="Un carácter especial (!@#$...)" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
            <Input id="confirm" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              className={confirmPassword && confirmPassword !== newPassword ? "border-red-500" : ""} />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {!esForzado && (
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
          )}
          <Button onClick={handleSubmit} disabled={isLoading || !passwordValida || (!!confirmPassword && confirmPassword !== newPassword)}>
            {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
