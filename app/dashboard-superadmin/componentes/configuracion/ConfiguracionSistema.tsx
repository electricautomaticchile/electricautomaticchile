"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Database, RefreshCw, Clock } from "lucide-react";

interface ConfiguracionSistemaProps {
  backupAutomatico: boolean;
  setBackupAutomatico: (valor: boolean) => void;
  depuracionRegistros: boolean;
  setDepuracionRegistros: (valor: boolean) => void;
}

export function ConfiguracionSistema({
  backupAutomatico,
  setBackupAutomatico,
  depuracionRegistros,
  setDepuracionRegistros,
}: ConfiguracionSistemaProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Base de Datos</CardTitle>
          <CardDescription>
            Configuración de la base de datos y respaldos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  Respaldo Automático
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generar copias de seguridad periódicas
                </p>
              </div>
              <Switch
                checked={backupAutomatico}
                onCheckedChange={setBackupAutomatico}
              />
            </div>

            {backupAutomatico && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">
                    Frecuencia de Respaldo
                  </Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Frecuencia de respaldo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-retention">
                    Retención de Respaldos
                  </Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="backup-retention">
                      <SelectValue placeholder="Período de retención" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="14">14 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-orange-600" />
                  Depuración de Registros
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Eliminar automáticamente registros antiguos
                </p>
              </div>
              <Switch
                checked={depuracionRegistros}
                onCheckedChange={setDepuracionRegistros}
              />
            </div>

            {depuracionRegistros && (
              <div className="space-y-2">
                <Label htmlFor="log-purge">Período de Retención de Datos</Label>
                <Select defaultValue="365">
                  <SelectTrigger id="log-purge">
                    <SelectValue placeholder="Período de retención" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">180 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                    <SelectItem value="730">2 años</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Los datos más antiguos que este período se eliminarán
                  automáticamente
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Crear Respaldo Ahora
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Optimizar Base de Datos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento</CardTitle>
          <CardDescription>
            Ajustes de rendimiento y optimización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Caché de Datos
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Almacenar datos en caché para mejorar el rendimiento
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cache-duration">
                Duración de la Caché (minutos)
              </Label>
              <Select defaultValue="15">
                <SelectTrigger id="cache-duration">
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-query-results">
                Límite de Resultados por Consulta
              </Label>
              <Select defaultValue="1000">
                <SelectTrigger id="max-query-results">
                  <SelectValue placeholder="Límite de resultados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500 registros</SelectItem>
                  <SelectItem value="1000">1.000 registros</SelectItem>
                  <SelectItem value="5000">5.000 registros</SelectItem>
                  <SelectItem value="10000">10.000 registros</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Número máximo de registros devueltos por consulta estándar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar Cambios</Button>
        <Button className="bg-orange-600 hover:bg-orange-700">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
