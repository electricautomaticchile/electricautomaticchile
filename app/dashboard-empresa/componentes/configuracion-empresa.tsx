"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiService, IEmpresa } from "@/lib/api/apiService";
import { Save, RefreshCw, Building2, Bell } from "lucide-react";

// Hook para obtener empresaId del contexto/token
const useEmpresaId = () => {
  const [empresaId, setEmpresaId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const obtenerEmpresaId = () => {
      // Primero intentar localStorage - donde guardamos userData después del login
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          console.log("📋 UserData encontrado:", userData);
          if (userData.id || userData._id) {
            return userData.id || userData._id;
          }
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }

      // Intentar obtener del token JWT
      const token =
        localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("🔐 Token payload:", payload);
          if (payload.empresaId || payload.id || payload.sub) {
            return payload.empresaId || payload.id || payload.sub;
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      console.warn("⚠️ No se pudo encontrar empresaId");
      return null;
    };

    const id = obtenerEmpresaId();
    console.log("🏢 EmpresaId obtenido:", id);
    setEmpresaId(id);
  }, []);

  return empresaId;
};

export function ConfiguracionEmpresa() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const empresaId = useEmpresaId();

  // Estados para datos de la empresa
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombreEmpresa: "",
    razonSocial: "",
    rut: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    contactoPrincipal: {
      nombre: "",
      cargo: "",
      telefono: "",
      correo: "",
    },
  });

  const [configuracionNotificaciones, setConfiguracionNotificaciones] =
    useState({
      emailHabilitadas: true,
      notificacionesFacturacion: true,
      notificacionesConsumo: true,
      notificacionesAlertas: true,
    });

  useEffect(() => {
    if (empresaId) {
      cargarDatosEmpresa();
    }
  }, [empresaId]);

  const cargarDatosEmpresa = async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando datos de empresa con ID:", empresaId);

      const response = await apiService.obtenerEmpresa(empresaId!);

      if (response.success && response.data) {
        const empresa: IEmpresa = response.data;
        console.log("✅ Datos de empresa cargados:", empresa);

        setDatosEmpresa({
          nombreEmpresa: empresa.nombreEmpresa || "",
          razonSocial: empresa.razonSocial || "",
          rut: empresa.rut || "",
          correo: empresa.correo || "",
          telefono: empresa.telefono || "",
          direccion: empresa.direccion || "",
          ciudad: empresa.ciudad || "",
          region: empresa.region || "",
          contactoPrincipal: {
            nombre: empresa.contactoPrincipal?.nombre || "",
            cargo: empresa.contactoPrincipal?.cargo || "",
            telefono: empresa.contactoPrincipal?.telefono || "",
            correo: empresa.contactoPrincipal?.correo || "",
          },
        });

        // Cargar configuraciones de notificaciones si existen
        if (empresa.configuraciones) {
          setConfiguracionNotificaciones((prev) => ({
            ...prev,
            emailHabilitadas: empresa.configuraciones?.notificaciones ?? true,
          }));
        }
      } else {
        console.error("❌ Error en respuesta:", response.error);
        toast({
          title: "Error",
          description:
            response.error || "Error al cargar los datos de la empresa",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error cargando datos de empresa:", error);
      toast({
        title: "Error",
        description: "Error al cargar los datos de la empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const guardarDatosEmpresa = async () => {
    try {
      setSaving(true);
      console.log("💾 Guardando datos de empresa:", datosEmpresa);

      const datosParaActualizar = {
        nombreEmpresa: datosEmpresa.nombreEmpresa,
        razonSocial: datosEmpresa.razonSocial,
        rut: datosEmpresa.rut,
        correo: datosEmpresa.correo,
        telefono: datosEmpresa.telefono,
        direccion: datosEmpresa.direccion,
        ciudad: datosEmpresa.ciudad,
        region: datosEmpresa.region,
        contactoPrincipal: datosEmpresa.contactoPrincipal,
        configuraciones: {
          notificaciones: configuracionNotificaciones.emailHabilitadas,
          tema: "claro" as const,
          maxUsuarios: 10,
        },
      };

      const response = await apiService.actualizarEmpresa(
        empresaId!,
        datosParaActualizar
      );

      if (response.success) {
        toast({
          title: "Configuración guardada",
          description:
            "Los datos de la empresa se han actualizado exitosamente",
        });
        console.log("✅ Empresa actualizada:", response.data);
      } else {
        throw new Error(response.error || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error guardando datos:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const guardarNotificaciones = async () => {
    try {
      setSaving(true);

      const datosParaActualizar = {
        configuraciones: {
          notificaciones: configuracionNotificaciones.emailHabilitadas,
          tema: "claro" as const,
          maxUsuarios: 10,
        },
      };

      const response = await apiService.actualizarEmpresa(
        empresaId!,
        datosParaActualizar
      );

      if (response.success) {
        toast({
          title: "Notificaciones guardadas",
          description: "Las preferencias de notificaciones se han actualizado",
        });
      } else {
        throw new Error(response.error || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error guardando notificaciones:", error);
      toast({
        title: "Error",
        description: "Error al guardar las notificaciones",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Cargando datos de la empresa...</span>
      </div>
    );
  }

  if (!empresaId) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No se pudo identificar la empresa
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Por favor, inicie sesión nuevamente
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/login")}
            className="mt-4"
          >
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-orange-600" />
            Configuración de Empresa
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administre los datos y preferencias de su empresa
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cargarDatosEmpresa}
          disabled={loading || saving}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Recargar
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            Datos Generales
          </TabsTrigger>
          <TabsTrigger value="notificaciones">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6">
            {/* Información General de la Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>
                  Datos básicos de identificación de la empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-empresa">Nombre de la Empresa</Label>
                    <Input
                      id="nombre-empresa"
                      value={datosEmpresa.nombreEmpresa}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          nombreEmpresa: e.target.value,
                        }))
                      }
                      placeholder="Nombre comercial de la empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razon-social">Razón Social</Label>
                    <Input
                      id="razon-social"
                      value={datosEmpresa.razonSocial}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          razonSocial: e.target.value,
                        }))
                      }
                      placeholder="Razón social legal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={datosEmpresa.rut}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          rut: e.target.value,
                        }))
                      }
                      placeholder="12.345.678-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo Electrónico</Label>
                    <Input
                      id="correo"
                      type="email"
                      value={datosEmpresa.correo}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          correo: e.target.value,
                        }))
                      }
                      placeholder="contacto@empresa.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={datosEmpresa.telefono}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          telefono: e.target.value,
                        }))
                      }
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={datosEmpresa.ciudad}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          ciudad: e.target.value,
                        }))
                      }
                      placeholder="Santiago"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Región</Label>
                    <Input
                      id="region"
                      value={datosEmpresa.region}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      placeholder="Región Metropolitana"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={datosEmpresa.direccion}
                    onChange={(e) =>
                      setDatosEmpresa((prev) => ({
                        ...prev,
                        direccion: e.target.value,
                      }))
                    }
                    placeholder="Dirección completa de la empresa"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contacto Principal */}
            <Card>
              <CardHeader>
                <CardTitle>Contacto Principal</CardTitle>
                <CardDescription>
                  Información del representante principal de la empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contacto-nombre">Nombre Completo</Label>
                    <Input
                      id="contacto-nombre"
                      value={datosEmpresa.contactoPrincipal.nombre}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          contactoPrincipal: {
                            ...prev.contactoPrincipal,
                            nombre: e.target.value,
                          },
                        }))
                      }
                      placeholder="Nombre del contacto principal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacto-cargo">Cargo</Label>
                    <Input
                      id="contacto-cargo"
                      value={datosEmpresa.contactoPrincipal.cargo}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          contactoPrincipal: {
                            ...prev.contactoPrincipal,
                            cargo: e.target.value,
                          },
                        }))
                      }
                      placeholder="Gerente General, CEO, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacto-telefono">Teléfono</Label>
                    <Input
                      id="contacto-telefono"
                      value={datosEmpresa.contactoPrincipal.telefono}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          contactoPrincipal: {
                            ...prev.contactoPrincipal,
                            telefono: e.target.value,
                          },
                        }))
                      }
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacto-correo">Correo Electrónico</Label>
                    <Input
                      id="contacto-correo"
                      type="email"
                      value={datosEmpresa.contactoPrincipal.correo}
                      onChange={(e) =>
                        setDatosEmpresa((prev) => ({
                          ...prev,
                          contactoPrincipal: {
                            ...prev.contactoPrincipal,
                            correo: e.target.value,
                          },
                        }))
                      }
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={guardarDatosEmpresa}
                disabled={saving}
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
                    Guardar Configuración
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Configure cómo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch
                    checked={configuracionNotificaciones.emailHabilitadas}
                    onCheckedChange={(checked) =>
                      setConfiguracionNotificaciones((prev) => ({
                        ...prev,
                        emailHabilitadas: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={guardarNotificaciones}
                  disabled={saving}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
