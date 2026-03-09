"use client";
import { useApi } from "@/hooks/useApi";
import { PerfilUsuario as PerfilUsuarioComponent } from "@/components/features/dashboard-cliente/perfil-usuario";

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
    <PerfilUsuarioComponent datos={datosCliente} />
  );
}
