"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/shared";
import { ImagenPerfil } from "@/components/shared/ImagenPerfil";
import {
  User, Lock, Bell, Check, Mail, Phone, Hash, Save, KeyRound,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import { useCambiarPassword } from "@/hooks/queries/useAuthMutations";

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
  ubicacion?: { lat: number; lng: number };
}

interface PerfilUsuarioProps {
  datos: DatosUsuario;
}

export function PerfilUsuario({ datos }: PerfilUsuarioProps) {
  const [imagenPerfil, setImagenPerfil] = useState((datos as any).imagenPerfil || "");
  const cambiarPasswordMutation = useCambiarPassword();
  const [formData, setFormData] = useState({
    nombre: datos.nombre || "",
    email: datos.email || "",
    telefono: datos.telefono || "",
    direccion: datos.direccion || "",
    notificacionesEmail: true,
    notificacionesSMS: false,
    actualizaciones: true,
    reportesMensuales: true,
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const guardarCambios = async () => {
    setCargando(true);
    try {
      const clienteId = datos._id || datos.id;
      if (!clienteId) throw new Error("ID de cliente no disponible");
      const response = await apiService.actualizarCliente(clienteId, {
        nombre: formData.nombre,
        correo: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        preferenciasNotificacion: {
          email: formData.notificacionesEmail,
          sms: formData.notificacionesSMS,
          actualizaciones: formData.actualizaciones,
          reportesMensuales: formData.reportesMensuales,
        },
      } as any);
      if (response.success) {
        setMensajeExito("Cambios guardados correctamente");
        toast({ title: "Éxito", description: "Tu perfil ha sido actualizado correctamente." });
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        throw new Error(response.error || "Error al actualizar el perfil");
      }
    } catch {
      toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-white flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <User className="h-6 w-6 text-orange-500" />
          </div>
          Mi Perfil
        </h2>
        <p className="text-white/40 mt-1 text-sm">Administra tu información personal y preferencias</p>
      </div>

      {/* Avatar + info rápida */}
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-orange-500" />
        <div className="p-6 flex items-center gap-6">
          <ImagenPerfil
            imageUrl={imagenPerfil}
            tipoUsuario="cliente"
            userId={datos._id || datos.id || ""}
            size="lg"
            onImageUpdate={(newUrl) => setImagenPerfil(newUrl)}
          />
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-white">{datos.nombre}</p>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <Hash className="h-4 w-4" />
                <span>{datos.numeroCliente}</span>
              </div>
              {formData.email && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <Mail className="h-4 w-4" />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.telefono && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <Phone className="h-4 w-4" />
                  <span>{formData.telefono}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="datos">
        <TabsList className="bg-[#0a0a0a] border border-white/10 p-1 rounded-xl w-full grid grid-cols-3">
          <TabsTrigger value="datos"
            className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/40 flex items-center gap-2 transition-all">
            <User className="h-4 w-4" /><span>Datos Personales</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad"
            className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/40 flex items-center gap-2 transition-all">
            <Lock className="h-4 w-4" /><span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones"
            className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white text-white/40 flex items-center gap-2 transition-all">
            <Bell className="h-4 w-4" /><span>Notificaciones</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Datos Personales */}
        <TabsContent value="datos" className="mt-4">
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="h-1 w-full bg-orange-500" />
            <div className="p-6 space-y-5">
              <div>
                <p className="text-base font-bold text-white">Información Personal</p>
                <p className="text-sm text-white/30 mt-0.5">Actualiza tus datos de contacto</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Nombre Completo</Label>
                  <FormField
                    label=""
                    name="nombre"
                    value={formData.nombre}
                    onChange={(v) => setFormData(p => ({ ...p, nombre: v as string }))}
                    placeholder="Ingrese su nombre completo"
                  />
                </div>
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Número de Cliente</Label>
                  <FormField
                    label=""
                    name="cliente"
                    value={datos.numeroCliente}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Correo Electrónico</Label>
                  <FormField
                    label=""
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(v) => setFormData(p => ({ ...p, email: v as string }))}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Teléfono Móvil</Label>
                  <FormField
                    label=""
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(v) => setFormData(p => ({ ...p, telefono: v as string }))}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/50 text-sm mb-1.5 block">Dirección</Label>
                <FormField
                  label=""
                  name="direccion"
                  value={formData.direccion}
                  onChange={(v) => setFormData(p => ({ ...p, direccion: v as string }))}
                  placeholder="Ingrese su dirección"
                />
              </div>

              {mensajeExito && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm">
                  <Check className="h-4 w-4 shrink-0" />
                  {mensajeExito}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <Button onClick={guardarCambios} disabled={cargando}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2">
                  <Save className="h-4 w-4" />
                  {cargando ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="seguridad" className="mt-4">
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="h-1 w-full bg-orange-500" />
            <div className="p-6 space-y-5">
              <div>
                <p className="text-base font-bold text-white">Cambiar Contraseña</p>
                <p className="text-sm text-white/30 mt-0.5">Actualiza tu contraseña de acceso</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Contraseña Actual</Label>
                  <FormField label="" name="current-password" type="password"
                    value={formData.passwordActual || ""}
                    onChange={(v) => setFormData(p => ({ ...p, passwordActual: v as string }))}
                    placeholder="Ingrese su contraseña actual" />
                </div>
                <Separator className="bg-white/5" />
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Nueva Contraseña</Label>
                  <FormField label="" name="new-password" type="password"
                    value={formData.passwordNueva || ""}
                    onChange={(v) => setFormData(p => ({ ...p, passwordNueva: v as string }))}
                    placeholder="Ingrese su nueva contraseña" />
                </div>
                <div>
                  <Label className="text-white/50 text-sm mb-1.5 block">Confirmar Nueva Contraseña</Label>
                  <FormField label="" name="confirm-password" type="password"
                    value={formData.passwordConfirmar || ""}
                    onChange={(v) => setFormData(p => ({ ...p, passwordConfirmar: v as string }))}
                    placeholder="Confirme su nueva contraseña" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-sm space-y-1">
                <p className="font-semibold text-orange-400">Requisitos de seguridad</p>
                <p className="text-white/40">· Mínimo 6 caracteres</p>
                <p className="text-white/40">· Recomendado: mayúscula, número y símbolo</p>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
                  onClick={async () => {
                    if (!formData.passwordNueva || !formData.passwordConfirmar) {
                      toast({ title: "Error", description: "Por favor complete todos los campos", variant: "destructive" }); return;
                    }
                    if (formData.passwordNueva !== formData.passwordConfirmar) {
                      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" }); return;
                    }
                    if (formData.passwordNueva.length < 6) {
                      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" }); return;
                    }
                    cambiarPasswordMutation.mutate(
                      { currentPassword: formData.passwordActual || "", newPassword: formData.passwordNueva },
                      { onSuccess: () => setFormData(p => ({ ...p, passwordActual: "", passwordNueva: "", passwordConfirmar: "" })) }
                    );
                  }}
                  disabled={cambiarPasswordMutation.isPending}
                >
                  <KeyRound className="h-4 w-4" />
                  {cambiarPasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notificaciones" className="mt-4">
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="h-1 w-full bg-orange-500" />
            <div className="p-6 space-y-5">
              <div>
                <p className="text-base font-bold text-white">Preferencias de Notificación</p>
                <p className="text-sm text-white/30 mt-0.5">Configura cómo deseas recibir tus notificaciones</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Canal</p>
                {[
                  { id: "notificacionesEmail", label: "Notificaciones por Email", desc: "Recibir notificaciones en tu correo electrónico" },
                  { id: "notificacionesSMS", label: "Notificaciones por SMS", desc: "Recibir notificaciones en tu teléfono móvil" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={formData[item.id as keyof typeof formData] as boolean}
                      onCheckedChange={(c) => handleSwitchChange(item.id, c)}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Tipos</p>
                {[
                  { id: "actualizaciones", label: "Actualizaciones de Servicio", desc: "Cambios o mejoras en el servicio" },
                  { id: "reportesMensuales", label: "Informes de Consumo Mensuales", desc: "Informes detallados de tu consumo cada mes" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={formData[item.id as keyof typeof formData] as boolean}
                      onCheckedChange={(c) => handleSwitchChange(item.id, c)}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
                  <div>
                    <p className="text-sm font-semibold text-white">Alertas de Facturación</p>
                    <p className="text-xs text-white/30 mt-0.5">Obligatorio — no puede desactivarse</p>
                  </div>
                  <Switch checked disabled className="data-[state=checked]:bg-orange-500" />
                </div>
              </div>

              {mensajeExito && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm">
                  <Check className="h-4 w-4 shrink-0" />{mensajeExito}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <Button onClick={guardarCambios} disabled={cargando}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2">
                  <Save className="h-4 w-4" />
                  {cargando ? "Guardando..." : "Guardar Preferencias"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
