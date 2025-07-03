"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface ConfiguracionGeneralProps {
  modoMantenimiento: boolean;
  setModoMantenimiento: (valor: boolean) => void;
  intervaloActualizacion: string;
  setIntervaloActualizacion: (valor: string) => void;
}

export function ConfiguracionGeneral({
  modoMantenimiento,
  setModoMantenimiento,
  intervaloActualizacion,
  setIntervaloActualizacion,
}: ConfiguracionGeneralProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajustes Generales</CardTitle>
          <CardDescription>
            Configure los parámetros básicos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input
                id="company-name"
                defaultValue="Electric Automatic Chile SpA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email de Soporte</Label>
              <Input
                id="support-email"
                defaultValue="soporte@electricautomaticchile.cl"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria Predeterminada</Label>
              <Select defaultValue="America/Santiago">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Seleccionar zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Santiago">
                    Santiago (GMT-3)
                  </SelectItem>
                  <SelectItem value="America/Buenos_Aires">
                    Buenos Aires (GMT-3)
                  </SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Mexico_City">
                    Ciudad de México (GMT-6)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma Predeterminado</Label>
              <Select defaultValue="es">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                  <SelectItem value="pt">Portugués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Mantenimiento</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Activar el modo de mantenimiento suspenderá temporalmente el
                  acceso a todos los usuarios excepto administradores
                </p>
              </div>
              <Switch
                checked={modoMantenimiento}
                onCheckedChange={setModoMantenimiento}
              />
            </div>

            {modoMantenimiento && (
              <div className="rounded-md border border-orange-200 bg-orange-100 p-4 dark:border-orange-800 dark:bg-orange-950/50">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  El modo de mantenimiento está activo. Solo los
                  superadministradores pueden acceder al sistema.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="refresh-interval">
                  Intervalo de Actualización (minutos)
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Frecuencia de actualización automática de los datos en el
                  panel
                </p>
              </div>
              <div className="w-20">
                <Input
                  id="refresh-interval"
                  value={intervaloActualizacion}
                  onChange={(e) => setIntervaloActualizacion(e.target.value)}
                  type="number"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
