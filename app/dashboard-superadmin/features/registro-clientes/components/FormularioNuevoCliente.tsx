import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building, ClipboardCheck } from "lucide-react";
import { FormularioNuevoClienteProps, PlanServicio } from "../types";
import { SelectorPlanes } from "./SelectorPlanes";

interface FormularioNuevoClienteExtendedProps
  extends FormularioNuevoClienteProps {
  planes: PlanServicio[];
  planAbierto: boolean;
  onPlanAbierto: (abierto: boolean) => void;
  planesExpandidos: Record<string, boolean>;
  onTogglePlanExpandido: (id: string, e: React.MouseEvent) => void;
}

export function FormularioNuevoCliente({
  formCliente,
  onInputChange,
  planSeleccionado,
  onPlanSeleccionado,
  validacion,
  onRegistrar,
  planes,
  planAbierto,
  onPlanAbierto,
  planesExpandidos,
  onTogglePlanExpandido,
}: FormularioNuevoClienteExtendedProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Columna izquierda - Información personal */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
          <div className="space-y-4">
            {/* Número de cliente (solo lectura) */}
            <div className="space-y-2">
              <Label
                htmlFor="numeroCliente"
                className="flex items-center gap-1.5"
              >
                <ClipboardCheck className="h-4 w-4 text-gray-500" />
                Número de Cliente
              </Label>
              <Input
                id="numeroCliente"
                name="numeroCliente"
                value={formCliente.numeroCliente}
                readOnly
                className="bg-gray-50 text-gray-600"
              />
            </div>

            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-500" />
                Nombre Completo *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Nombre del cliente"
                value={formCliente.nombre}
                onChange={onInputChange}
                className={!validacion.nombre.valido ? "border-red-500" : ""}
              />
              {!validacion.nombre.valido && (
                <p className="text-sm text-red-600">
                  {validacion.nombre.mensaje}
                </p>
              )}
            </div>

            {/* Correo electrónico */}
            <div className="space-y-2">
              <Label htmlFor="correo" className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gray-500" />
                Correo Electrónico *
              </Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formCliente.correo}
                onChange={onInputChange}
                className={!validacion.correo.valido ? "border-red-500" : ""}
              />
              {!validacion.correo.valido && (
                <p className="text-sm text-red-600">
                  {validacion.correo.mensaje}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-gray-500" />
                Teléfono *
              </Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="+56 9 XXXX XXXX"
                value={formCliente.telefono}
                onChange={onInputChange}
                className={!validacion.telefono.valido ? "border-red-500" : ""}
              />
              {!validacion.telefono.valido && (
                <p className="text-sm text-red-600">
                  {validacion.telefono.mensaje}
                </p>
              )}
            </div>

            {/* Empresa (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="empresa" className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-gray-500" />
                Empresa
              </Label>
              <Input
                id="empresa"
                name="empresa"
                placeholder="Nombre de la empresa (opcional)"
                value={formCliente.empresa}
                onChange={onInputChange}
              />
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
          <div className="space-y-4">
            {/* RUT */}
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                name="rut"
                placeholder="XX.XXX.XXX-X"
                value={formCliente.rut}
                onChange={onInputChange}
                className={!validacion.rut.valido ? "border-red-500" : ""}
              />
              {!validacion.rut.valido && (
                <p className="text-sm text-red-600">{validacion.rut.mensaje}</p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Dirección completa"
                value={formCliente.direccion}
                onChange={onInputChange}
              />
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                name="notas"
                placeholder="Notas adicionales sobre el cliente..."
                value={formCliente.notas}
                onChange={onInputChange}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha - Selección de plan */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Plan de Servicio</h3>

          <SelectorPlanes
            planes={planes}
            planSeleccionado={planSeleccionado}
            onPlanSeleccionado={onPlanSeleccionado}
            planAbierto={planAbierto}
            onPlanAbierto={onPlanAbierto}
            planesExpandidos={planesExpandidos}
            onTogglePlanExpandido={onTogglePlanExpandido}
          />

          {!validacion.planSeleccionado.valido && (
            <p className="text-sm text-red-600 mt-2">
              {validacion.planSeleccionado.mensaje}
            </p>
          )}
        </div>

        {/* Resumen de costos */}
        {formCliente.montoMensual > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Resumen de Costos
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Plan seleccionado:</span>
                <span className="font-medium">
                  {planes.find((p) => p.id === planSeleccionado)?.nombre}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monto mensual:</span>
                <span className="font-bold">
                  ${formCliente.montoMensual.toLocaleString("es-CL")}
                </span>
              </div>
              <div className="flex justify-between border-t border-blue-300 pt-1">
                <span>Monto anual:</span>
                <span className="font-bold">
                  ${(formCliente.montoMensual * 12).toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botón de registro */}
        <div className="pt-4">
          <Button
            onClick={onRegistrar}
            disabled={!validacion.formularioValido}
            className="w-full"
            size="lg"
          >
            Registrar Cliente
          </Button>

          {!validacion.formularioValido && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Complete todos los campos obligatorios (*) para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
