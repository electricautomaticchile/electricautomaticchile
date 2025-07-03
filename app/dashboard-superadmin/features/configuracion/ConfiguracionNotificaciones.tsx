"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, AlertTriangle } from "lucide-react";

export function ConfiguracionNotificaciones() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>
            Configure las preferencias de notificación del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Alertas del Sistema
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevos Clientes Registrados</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notificar cuando se registre un nuevo cliente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevas Cotizaciones</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notificar cuando se reciba una nueva cotización
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Problemas en Dispositivos IoT</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alertar sobre fallos o desconexiones de dispositivos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Consumo Eléctrico Elevado</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notificar cuando el consumo supere los límites
                      establecidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                Canales de Notificación
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrar notificaciones en el navegador
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS (Próximamente)</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar notificaciones por mensaje de texto
                    </p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notification-frequency">
                Frecuencia de Resumen
              </Label>
              <Select defaultValue="daily">
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Frecuencia del resumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tiempo real</SelectItem>
                  <SelectItem value="hourly">Cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Frecuencia con la que se envían los resúmenes de actividad
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
