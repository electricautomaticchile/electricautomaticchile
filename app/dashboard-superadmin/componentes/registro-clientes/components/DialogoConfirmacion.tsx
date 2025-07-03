import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Save,
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Key,
  Check,
  Loader2,
} from "lucide-react";
import { DialogoConfirmacionProps } from "../types";
import { PLANES_SERVICIO } from "../config";

export function DialogoConfirmacion({
  abierto,
  onAbierto,
  cliente,
  passwordTemporal,
  enviarCorreo,
  onEnviarCorreo,
  creandoCliente,
  onConfirmar,
  onCopiarCredenciales,
  copiado,
}: DialogoConfirmacionProps) {
  const planInfo = PLANES_SERVICIO.find(
    (plan) => plan.id === cliente.planSeleccionado
  );
  const passwordFinal =
    passwordTemporal || `Cliente${cliente.numeroCliente.replace("-", "")}`;

  return (
    <Dialog open={abierto} onOpenChange={onAbierto}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Confirmar Registro de Cliente
          </DialogTitle>
          <DialogDescription>
            Revise los datos antes de confirmar el registro. Se creará la cuenta
            y se generarán las credenciales de acceso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen del cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Información del Cliente
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <strong>Nombre:</strong> {cliente.nombre}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gray-500" />
                  <strong>Correo:</strong> {cliente.correo}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <strong>Teléfono:</strong> {cliente.telefono}
                </div>
                {cliente.empresa && (
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-gray-500" />
                    <strong>Empresa:</strong> {cliente.empresa}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <strong>RUT:</strong> {cliente.rut}
                </div>
                <div>
                  <strong>Número Cliente:</strong> {cliente.numeroCliente}
                </div>
                {cliente.direccion && (
                  <div>
                    <strong>Dirección:</strong> {cliente.direccion}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información del plan */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Plan Seleccionado
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{planInfo?.nombre}</span>
                <span className="font-bold text-blue-900">
                  ${cliente.montoMensual.toLocaleString("es-CL")}/mes
                </span>
              </div>
              <p className="text-sm text-blue-700">{planInfo?.descripcion}</p>

              <div className="mt-3">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Características incluidas:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {planInfo?.caracteristicas
                    .slice(0, 4)
                    .map((caracteristica, index) => (
                      <div
                        key={index}
                        className="text-xs text-blue-700 flex items-center gap-1"
                      >
                        <Check className="h-3 w-3 text-blue-500" />
                        {caracteristica}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Credenciales de acceso */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Credenciales de Acceso
            </h4>

            <div className="space-y-3">
              <div className="bg-white border border-yellow-300 rounded p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Usuario:</strong> {cliente.correo}
                  </div>
                  <div>
                    <strong>Contraseña temporal:</strong>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {passwordFinal}
                    </code>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full sm:w-auto"
                  onClick={onCopiarCredenciales}
                >
                  {copiado ? (
                    <>
                      <Check className="mr-2 h-3 w-3" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-3 w-3" />
                      Copiar Credenciales
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enviar-correo"
                  checked={enviarCorreo}
                  onCheckedChange={onEnviarCorreo}
                />
                <Label htmlFor="enviar-correo" className="text-sm">
                  Enviar credenciales por correo electrónico
                </Label>
              </div>

              {enviarCorreo && (
                <p className="text-xs text-yellow-700">
                  Se enviará un correo a <strong>{cliente.correo}</strong> con
                  las credenciales de acceso y las instrucciones para el primer
                  ingreso.
                </p>
              )}
            </div>
          </div>

          {/* Notas adicionales */}
          {cliente.notas && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Notas</h4>
              <p className="text-sm text-gray-700">{cliente.notas}</p>
            </div>
          )}

          <Separator />

          {/* Resumen financiero */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-green-900">
              Resumen Financiero
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monto mensual:</span>
                <span className="font-medium">
                  ${cliente.montoMensual.toLocaleString("es-CL")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monto anual estimado:</span>
                <span className="font-medium">
                  ${(cliente.montoMensual * 12).toLocaleString("es-CL")}
                </span>
              </div>
              <div className="flex justify-between border-t border-green-300 pt-2">
                <span className="font-semibold">Fecha de inicio:</span>
                <span className="font-semibold">
                  {new Date().toLocaleDateString("es-CL")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onAbierto(false)}
            disabled={creandoCliente}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirmar}
            disabled={creandoCliente}
            className="w-full sm:w-auto"
          >
            {creandoCliente ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando Cliente...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Confirmar Registro
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
