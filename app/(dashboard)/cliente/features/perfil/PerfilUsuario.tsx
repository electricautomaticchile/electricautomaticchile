"use client";
import { useApi } from "@/hooks/useApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerfilUsuario as PerfilUsuarioComponent } from "@/components/features/dashboard-cliente/perfil-usuario";
import { MapaBasico } from "@/components/features/dashboard-cliente/ubicacion/MapaBasico";

export default function PerfilUsuario() {
  const { user } = useApi();
  
  const datosCliente = {
    _id: (user as any)?._id?.toString() || user?.id?.toString(),
    id: user?.id?.toString() || (user as any)?._id?.toString(),
    nombre: (user as any)?.nombre || user?.name || "Cliente",
    numeroCliente: (user as any)?.numeroCliente || "---",
    direccion: (user as any)?.direccion || "No especificada",
    correo: (user as any)?.correo || user?.email || "",
    email: user?.email || (user as any)?.correo || "",
    telefono: (user as any)?.telefono || "",
    ubicacion: (user as any)?.ubicacion || { lat: -33.4489, lng: -70.6693 },
  };

  return (
    <Tabs defaultValue="datos" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="datos">Mis Datos</TabsTrigger>
        <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
      </TabsList>
      <TabsContent value="datos" className="mt-6">
        <PerfilUsuarioComponent datos={datosCliente} />
      </TabsContent>
      <TabsContent value="ubicacion" className="mt-6">
        <MapaBasico
          ubicacion={datosCliente.ubicacion}
          direccionRegistrada={datosCliente.direccion}
        />
      </TabsContent>
    </Tabs>
  );
}
