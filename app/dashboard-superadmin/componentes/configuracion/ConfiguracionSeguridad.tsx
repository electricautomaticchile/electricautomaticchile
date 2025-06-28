"use client";
import { useState } from "react";
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
import {
  Key,
  Shield,
  UserPlus,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { CrearSuperusuario } from "./CrearSuperusuario";

interface SuperusuarioCreado {
  numeroCliente: string;
  correo: string;
  nombre: string;
}

interface ConfiguracionSeguridadProps {
  superusuarioCreado: SuperusuarioCreado | null;
  setSuperusuarioCreado: (usuario: SuperusuarioCreado | null) => void;
}

export function ConfiguracionSeguridad({
  superusuarioCreado,
  setSuperusuarioCreado,
}: ConfiguracionSeguridadProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Políticas de Seguridad</CardTitle>
          <CardDescription>
            Configure los ajustes de seguridad y acceso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-600" />
                Contraseñas
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password-length">Longitud Mínima</Label>
                  <Select defaultValue="8">
                    <SelectTrigger id="password-length">
                      <SelectValue placeholder="Longitud mínima" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 caracteres</SelectItem>
                      <SelectItem value="10">10 caracteres</SelectItem>
                      <SelectItem value="12">12 caracteres</SelectItem>
                      <SelectItem value="14">14 caracteres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Caducidad</Label>
                  <Select defaultValue="90">
                    <SelectTrigger id="password-expiry">
                      <SelectValue placeholder="Días hasta caducidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="180">180 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-lowercase"
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="require-lowercase">Requerir minúsculas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-uppercase"
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="require-uppercase">Requerir mayúsculas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-numbers"
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="require-numbers">Requerir números</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-symbols"
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="require-symbols">Requerir símbolos</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Autenticación
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de Dos Factores (2FA)</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Requerir 2FA para todos los usuarios administradores
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Tiempo de Inactividad (minutos)
                </Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Tiempo de inactividad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tiempo después del cual se cerrará la sesión por inactividad
                </p>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-600" />
                Crear Superusuario
              </h3>

              <CrearSuperusuario
                superusuarioCreado={superusuarioCreado}
                setSuperusuarioCreado={setSuperusuarioCreado}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Seguridad</CardTitle>
          <CardDescription>
            Configuración de registro y auditoría
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Auditoría de Eventos
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Intentos de Acceso</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Registrar todos los intentos de acceso exitosos y fallidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Cambios de Configuración</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Registrar todos los cambios en la configuración del
                      sistema
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Acceso a Datos Sensibles</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Registrar el acceso a información confidencial de clientes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Alertas de Seguridad
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Múltiples Intentos Fallidos</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alertar cuando se detecten múltiples intentos de acceso
                      fallidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Acceso Inusual</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alertar cuando se detecte acceso desde ubicaciones
                      inusuales
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-period">
                  Período de Retención de Logs (días)
                </Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention-period">
                    <SelectValue placeholder="Días de retención" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">180 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tiempo que se conservarán los registros de seguridad
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
