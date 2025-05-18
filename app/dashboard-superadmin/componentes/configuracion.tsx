"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Bell, Database, Key, Server, Users, RefreshCw, Clock } from 'lucide-react';

interface ConfiguracionProps {
  reducida?: boolean;
}

export function Configuracion({ reducida = false }: ConfiguracionProps) {
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [notificacionesSistema, setNotificacionesSistema] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [depuracionRegistros, setDepuracionRegistros] = useState(true);
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState('5');
  const [periodoRetencion, setPeriodoRetencion] = useState('90');
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>
            Ajustes principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones por Email</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enviar alertas por correo
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={notificacionesEmail}
                onCheckedChange={setNotificacionesEmail}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="backup">Respaldo Automático</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Base de datos y configuración
                </p>
              </div>
              <Switch 
                id="backup" 
                checked={backupAutomatico}
                onCheckedChange={setBackupAutomatico}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suspender acceso a usuarios
                </p>
              </div>
              <Switch 
                id="maintenance" 
                checked={modoMantenimiento}
                onCheckedChange={setModoMantenimiento}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-orange-600" />
          Configuración del Sistema
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Administre la configuración global para toda la plataforma de Electric Automatic Chile
        </p>
      </div>

      <Tabs defaultValue="general" className="mb-4">
        <TabsList className="mb-4 grid grid-cols-4 gap-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
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
                  <Input id="company-name" defaultValue="Electric Automatic Chile SpA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de Soporte</Label>
                  <Input id="support-email" defaultValue="soporte@electricautomaticchile.cl" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria Predeterminada</Label>
                  <Select defaultValue="America/Santiago">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                      <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                      <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
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
                      Activar el modo de mantenimiento suspenderá temporalmente el acceso a todos los usuarios excepto administradores
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
                      El modo de mantenimiento está activo. Solo los superadministradores pueden acceder al sistema.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="refresh-interval">Intervalo de Actualización (minutos)</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tiempo entre actualizaciones automáticas del tablero
                    </p>
                  </div>
                  <div className="w-20">
                    <Select 
                      value={intervaloActualizacion} 
                      onValueChange={setIntervaloActualizacion}
                    >
                      <SelectTrigger id="refresh-interval">
                        <SelectValue placeholder="Intervalo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>
                Personalice la apariencia del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Tema Predeterminado</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="theme-light" name="theme" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="theme-light">Claro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="theme-dark" name="theme" className="h-4 w-4" />
                      <Label htmlFor="theme-dark">Oscuro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="theme-auto" name="theme" className="h-4 w-4" />
                      <Label htmlFor="theme-auto">Automático (Sistema)</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Color Principal</Label>
                  <div className="flex gap-4">
                    <div className="bg-orange-600 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 outline outline-2 outline-offset-2 outline-orange-600 cursor-pointer"></div>
                    <div className="bg-blue-600 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"></div>
                    <div className="bg-green-600 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"></div>
                    <div className="bg-purple-600 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"></div>
                    <div className="bg-gray-600 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguridad" className="space-y-6">
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
                      <input type="checkbox" id="require-lowercase" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="require-lowercase">Requerir minúsculas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require-uppercase" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="require-uppercase">Requerir mayúsculas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require-numbers" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="require-numbers">Requerir números</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="require-symbols" className="h-4 w-4" defaultChecked />
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
                    <Label htmlFor="session-timeout">Tiempo de Inactividad (minutos)</Label>
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
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Actividad de Usuarios</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Registrar acciones de todos los usuarios en el sistema
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Actividad Sospechosa</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notificar cuando se detecten patrones inusuales de acceso
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Retención de Registros</Label>
                  <Select 
                    value={periodoRetencion}
                    onValueChange={setPeriodoRetencion}
                  >
                    <SelectTrigger id="log-retention">
                      <SelectValue placeholder="Período de retención" />
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Administre cómo y cuándo se envían las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canales de Notificación</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar alertas y notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch 
                    checked={notificacionesEmail}
                    onCheckedChange={setNotificacionesEmail}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones del Sistema</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrar notificaciones en la interfaz de usuario
                    </p>
                  </div>
                  <Switch 
                    checked={notificacionesSistema}
                    onCheckedChange={setNotificacionesSistema}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enviar alertas críticas por mensaje de texto
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de Notificaciones</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-alerts" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="notify-alerts">Alertas del sistema</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-devices" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="notify-devices">Estado de dispositivos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-reports" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="notify-reports">Reportes generados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-users" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="notify-users">Actividad de usuarios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-maintenance" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="notify-maintenance">Mantenimiento programado</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Frecuencia de Resumen</Label>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sistema" className="space-y-6">
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
                      <Label htmlFor="backup-frequency">Frecuencia de Respaldo</Label>
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
                      <Label htmlFor="backup-retention">Retención de Respaldos</Label>
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
                      Los datos más antiguos que este período se eliminarán automáticamente
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
                  <Label htmlFor="cache-duration">Duración de la Caché (minutos)</Label>
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
                  <Label htmlFor="max-query-results">Límite de Resultados por Consulta</Label>
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
            <Button className="bg-orange-600 hover:bg-orange-700">Guardar Cambios</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 