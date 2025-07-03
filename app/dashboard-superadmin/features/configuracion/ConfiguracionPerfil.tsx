"use client";
import { useState, useEffect, useCallback } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import { useAuth } from "@/lib/hooks/useApi";
import { SubidaImagenPerfil } from "./SubidaImagenPerfil";

interface ConfiguracionPerfilProps {
  profileImage: string | null;
  setProfileImage: (imagen: string | null) => void;
}

export function ConfiguracionPerfil({
  profileImage,
  setProfileImage,
}: ConfiguracionPerfilProps) {
  const { user } = useAuth();

  // Estados para el perfil del superadmin
  const [perfilSuperadmin, setPerfilSuperadmin] = useState({
    nombre: "",
    email: "",
  });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  // Función para cargar el perfil del superadmin actual
  const cargarPerfilSuperadmin = useCallback(async () => {
    try {
      setCargandoPerfil(true);

      // Obtener el perfil del usuario actual desde la API
      const response = await apiService.getProfile();

      if (response.success && response.data) {
        console.log("📋 Perfil cargado desde API:", response.data);
        setPerfilSuperadmin({
          nombre: response.data.nombre || "",
          email: response.data.email || "",
        });
      } else {
        console.error("Error cargando perfil:", response.error);
        // Si no se puede cargar desde la API, usar datos del hook useAuth como fallback
        setPerfilSuperadmin({
          nombre: user?.nombre || "Administrador",
          email: user?.email || "admin@electricauto.cl",
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      // Fallback en caso de error
      setPerfilSuperadmin({
        nombre: user?.nombre || "Administrador",
        email: user?.email || "admin@electricauto.cl",
      });
    } finally {
      setCargandoPerfil(false);
    }
  }, [user]);

  // Función para guardar el perfil del superadmin
  const guardarPerfilSuperadmin = async () => {
    setGuardandoPerfil(true);

    try {
      // Los superadministradores están en la colección de Clientes
      const response = await apiService.actualizarCliente(user?._id || "", {
        nombre: perfilSuperadmin.nombre,
        correo: perfilSuperadmin.email, // Mapear email a correo para el backend
      });

      if (response.success) {
        toast({
          title: "Éxito",
          description: "Tu perfil ha sido actualizado correctamente.",
        });

        // Actualizar el contexto de autenticación si es necesario
        console.log("✅ Perfil actualizado correctamente:", response.data);
      } else {
        throw new Error(response.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el perfil: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
      });
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const manejarCambioPerfil = (campo: string, valor: string) => {
    setPerfilSuperadmin((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Cargar perfil al montar el componente
  useEffect(() => {
    cargarPerfilSuperadmin();
  }, [cargarPerfilSuperadmin]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Perfil</CardTitle>
          <CardDescription>
            Actualice su información personal y foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {cargandoPerfil ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Cargando perfil...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Nombre</Label>
                  <Input
                    id="user-name"
                    value={perfilSuperadmin.nombre}
                    onChange={(e) =>
                      manejarCambioPerfil("nombre", e.target.value)
                    }
                    placeholder="Ingrese su nombre completo"
                  />
                  <p className="text-xs text-gray-500">
                    Datos cargados desde la colección de clientes
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Correo Electrónico</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={perfilSuperadmin.email}
                    onChange={(e) =>
                      manejarCambioPerfil("email", e.target.value)
                    }
                    placeholder="correo@electricauto.cl"
                  />
                  <p className="text-xs text-gray-500">
                    Email asociado a su cuenta de administrador
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-client-number">Número de Cliente</Label>
                  <Input
                    id="user-client-number"
                    readOnly
                    value={user?.numeroCliente || "-------"}
                    className="bg-gray-50 dark:bg-slate-900"
                  />
                  <p className="text-xs text-gray-500">
                    Este número no puede ser modificado
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Rol</Label>
                  <Input
                    id="user-role"
                    readOnly
                    value={
                      user?.role === "admin"
                        ? "Superadministrador"
                        : "Administrador"
                    }
                    className="bg-gray-50 dark:bg-slate-900"
                  />
                  <p className="text-xs text-gray-500">
                    Rol asignado en el sistema
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <SubidaImagenPerfil
                profileImage={profileImage}
                nombreUsuario={perfilSuperadmin.nombre}
                onImageChange={setProfileImage}
              />

              <div className="flex justify-end mt-6">
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={guardarPerfilSuperadmin}
                  disabled={guardandoPerfil || cargandoPerfil}
                >
                  {guardandoPerfil ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
