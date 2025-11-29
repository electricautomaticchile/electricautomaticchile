"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/shared";
import {
  User,
  Home,
  Phone,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Shield,
  AlertTriangle,
  Check,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";

interface DatosUsuario {
  _id?: string;
  id?: string;
  nombre: string;
  numeroCliente: string;
  direccion: string;
  ultimoPago?: string;
  consumoActual?: number;
  email?: string;
  correo?: string;
  telefono?: string;
}

interface PerfilUsuarioProps {
  datos: DatosUsuario;
}

export function PerfilUsuario({ datos }: PerfilUsuarioProps) {
  const [formData, setFormData] = useState({
    nombre: datos.nombre || "",
    email: datos.email || "usuario@ejemplo.com",
    telefono: datos.telefono || "+56 9 1234 5678",
    direccion: datos.direccion || "",
    notificacionesEmail: true,
    notificacionesSMS: false,
    actualizaciones: true,
    reportesMensuales: true,
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const guardarCambios = async () => {
    setCargando(true);

    try {
      // Preparar datos para enviar al backend
      const datosActualizacion = {
        nombre: formData.nombre,
        correo: formData.email, // Mapear email a correo para el backend
        telefono: formData.telefono,
        direccion: formData.direccion,
        preferenciasNotificacion: {
          email: formData.notificacionesEmail,
          sms: formData.notificacionesSMS,
          actualizaciones: formData.actualizaciones,
          reportesMensuales: formData.reportesMensuales,
        },
      };

      // Usar el número de cliente para la actualización (más confiable)
      if (!datos.numeroCliente) {
        throw new Error("Número de cliente no disponible");
      }

      // Usar actualizarCliente en lugar de actualizarUsuario
      const response = await apiService.actualizarCliente(
        datos.numeroCliente,
        datosActualizacion as any
      );

      if (response.success) {
        setMensajeExito("Cambios guardados correctamente");
        toast({
          title: "Éxito",
          description: "Tu perfil ha sido actualizado correctamente.",
          variant: "default",
        });

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setMensajeExito("");
        }, 3000);
      } else {
        throw new Error(response.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudieron guardar los cambios. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
          <User className="h-8 w-8 text-orange-600" />
          Mi Perfil
        </h2>
        <p className="text-muted-foreground mt-1">
          Administre su información personal y preferencias
        </p>
      </div>

      <Tabs defaultValue="datos" className="mb-4">
        <TabsList className="mb-4 grid grid-cols-3 gap-4">
          <TabsTrigger value="datos" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Datos Personales</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger
            value="notificaciones"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualice sus datos personales de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nombre Completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(value) => setFormData(prev => ({ ...prev, nombre: value as string }))}
                  placeholder="Ingrese su nombre completo"
                />

                <FormField
                  label="Número de Cliente"
                  name="cliente"
                  value={datos.numeroCliente}
                  onChange={() => {}}
                  disabled
                />

                <FormField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value as string }))}
                  placeholder="tu@email.com"
                />

                <FormField
                  label="Teléfono Móvil"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(value) => setFormData(prev => ({ ...prev, telefono: value as string }))}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <FormField
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={(value) => setFormData(prev => ({ ...prev, direccion: value as string }))}
                placeholder="Ingrese su dirección"
              />

              {mensajeExito && (
                <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  {mensajeExito}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={guardarCambios}
                  disabled={cargando}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {cargando ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicio</CardTitle>
              <CardDescription>
                Información de su servicio con nosotros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Dirección de Servicio
                  </h3>
                  <p className="font-medium">{datos.direccion}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tipo de Medidor
                  </h3>
                  <p className="font-medium">Medidor Inteligente E-45S</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Fecha de Alta
                  </h3>
                  <p className="font-medium">15/01/2023</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tarifa Contratada
                  </h3>
                  <p className="font-medium">BT1 Residencial</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualice su contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Contraseña Actual"
                name="current-password"
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Ingrese su contraseña actual"
              />

              <Separator />

              <div className="space-y-4">
                <FormField
                  label="Nueva Contraseña"
                  name="new-password"
                  type="password"
                  value=""
                  onChange={() => {}}
                  placeholder="Ingrese su nueva contraseña"
                />

                <FormField
                  label="Confirmar Nueva Contraseña"
                  name="confirm-password"
                  type="password"
                  value=""
                  onChange={() => {}}
                  placeholder="Confirme su nueva contraseña"
                />
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-sm">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Requisitos de seguridad:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una letra mayúscula</li>
                  <li>Al menos un número</li>
                  <li>Al menos un símbolo (!, @, #, etc.)</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Cambiar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>
                Opciones adicionales de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Autenticación de Dos Factores
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active la verificación en dos pasos para mayor seguridad
                  </p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label>Dispositivos Conectados</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Administre los dispositivos que tienen acceso a su cuenta
                  </p>
                </div>
                <Button variant="outline">Ver Dispositivos</Button>
              </div>

              <Separator />

              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-300">
                      Zona de Peligro
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">
                      Las siguientes acciones son irreversibles y pueden afectar
                      su acceso al servicio.
                    </p>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Desactivar Cuenta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificación</CardTitle>
              <CardDescription>
                Configure cómo desea recibir sus notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir notificaciones en su correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={formData.notificacionesEmail}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notificacionesEmail", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notif">Notificaciones por SMS</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir notificaciones a su teléfono móvil
                    </p>
                  </div>
                  <Switch
                    id="sms-notif"
                    checked={formData.notificacionesSMS}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notificacionesSMS", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de Notificaciones</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="updates-notif">
                      Actualizaciones de Servicio
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir información sobre cambios o mejoras en el servicio
                    </p>
                  </div>
                  <Switch
                    id="updates-notif"
                    checked={formData.actualizaciones}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("actualizaciones", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reports-notif">
                      Informes de Consumo Mensuales
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir informes detallados sobre su consumo cada mes
                    </p>
                  </div>
                  <Switch
                    id="reports-notif"
                    checked={formData.reportesMensuales}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("reportesMensuales", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="alerts-notif">Alertas de Facturación</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir alertas sobre nuevas facturas y fechas de
                      vencimiento
                    </p>
                  </div>
                  <Switch id="alerts-notif" defaultChecked disabled />
                </div>
                <p className="text-xs text-gray-500 italic">
                  Las alertas de facturación son obligatorias y no pueden ser
                  desactivadas.
                </p>
              </div>

              {mensajeExito && (
                <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  {mensajeExito}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={guardarCambios}
                  disabled={cargando}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {cargando ? "Guardando..." : "Guardar Preferencias"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
