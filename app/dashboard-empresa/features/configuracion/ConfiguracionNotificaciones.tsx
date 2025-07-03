"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Save,
  Bell,
  Mail,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { ConfiguracionNotificacionesProps } from "./types";
import { TIPOS_NOTIFICACIONES } from "./config";

export function ConfiguracionNotificaciones({
  configuracion,
  onConfiguracionChange,
  loading = false,
  saving = false,
  onGuardar,
}: ConfiguracionNotificacionesProps) {
  const iconosNotificaciones = {
    emailHabilitadas: Mail,
    notificacionesFacturacion: DollarSign,
    notificacionesConsumo: TrendingUp,
    notificacionesAlertas: AlertCircle,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferencias de Notificaciones
        </CardTitle>
        <CardDescription>
          Configure cómo y cuándo recibir notificaciones del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuraciones principales */}
        <div className="space-y-4">
          {TIPOS_NOTIFICACIONES.map((tipo) => {
            const IconoTipo =
              iconosNotificaciones[
                tipo.id as keyof typeof iconosNotificaciones
              ];
            const estaHabilitado =
              configuracion[tipo.id as keyof typeof configuracion];

            return (
              <div
                key={tipo.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <IconoTipo className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium cursor-pointer">
                      {tipo.label}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tipo.descripcion}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={estaHabilitado}
                  onCheckedChange={(checked) =>
                    onConfiguracionChange({ [tipo.id]: checked })
                  }
                  disabled={loading || saving}
                />
              </div>
            );
          })}
        </div>

        {/* Configuración maestro */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                Control maestro de notificaciones
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Habilite o deshabilite todas las notificaciones de una vez
              </p>
            </div>
            <Switch
              checked={configuracion.emailHabilitadas}
              onCheckedChange={(checked) => {
                // Si se deshabilita el maestro, deshabilitar todas
                if (!checked) {
                  onConfiguracionChange({
                    emailHabilitadas: false,
                    notificacionesFacturacion: false,
                    notificacionesConsumo: false,
                    notificacionesAlertas: false,
                  });
                } else {
                  // Si se habilita, solo habilitar el maestro
                  onConfiguracionChange({ emailHabilitadas: true });
                }
              }}
              disabled={loading || saving}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Configuración de notificaciones
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Las notificaciones se enviarán al correo electrónico principal
                de la empresa. Puede cambiar estas preferencias en cualquier
                momento.
              </p>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {Object.values(configuracion).filter(Boolean).length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Activas
            </div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="text-lg font-bold text-gray-600">
              {Object.values(configuracion).filter((val) => !val).length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Inactivas
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {configuracion.emailHabilitadas ? "ON" : "OFF"}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Email
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              {configuracion.notificacionesAlertas ? "ON" : "OFF"}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Alertas
            </div>
          </div>
        </div>

        {/* Botón para guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onGuardar}
            disabled={saving || loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {saving ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Guardando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Notificaciones
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente compacto para configuración rápida
export function ConfiguracionNotificacionesCompacto({
  configuracion,
  onConfiguracionChange,
}: {
  configuracion: any;
  onConfiguracionChange: (config: any) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Email habilitado</span>
        <Switch
          checked={configuracion.emailHabilitadas}
          onCheckedChange={(checked) =>
            onConfiguracionChange({ emailHabilitadas: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Alertas del sistema</span>
        <Switch
          checked={configuracion.notificacionesAlertas}
          onCheckedChange={(checked) =>
            onConfiguracionChange({ notificacionesAlertas: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Consumo energético</span>
        <Switch
          checked={configuracion.notificacionesConsumo}
          onCheckedChange={(checked) =>
            onConfiguracionChange({ notificacionesConsumo: checked })
          }
        />
      </div>
    </div>
  );
}
