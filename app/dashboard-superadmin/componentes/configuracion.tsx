"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bell, Server, User, Users } from "lucide-react";
import { useAuth } from "@/lib/hooks/useApi";

// Importar todos los componentes específicos
import { ConfiguracionGeneral } from "./configuracion/ConfiguracionGeneral";
import { ConfiguracionPerfil } from "./configuracion/ConfiguracionPerfil";
import { ConfiguracionSeguridad } from "./configuracion/ConfiguracionSeguridad";
import { ConfiguracionNotificaciones } from "./configuracion/ConfiguracionNotificaciones";
import { ConfiguracionSistema } from "./configuracion/ConfiguracionSistema";
import { ConfiguracionClientes } from "./configuracion/ConfiguracionClientes";

interface SuperusuarioCreado {
  numeroCliente: string;
  correo: string;
  nombre: string;
}

interface ConfiguracionProps {
  reducida?: boolean;
}

export function Configuracion({ reducida = false }: ConfiguracionProps) {
  const { user } = useAuth();

  // Estados compartidos entre componentes
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState("5");
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [depuracionRegistros, setDepuracionRegistros] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [superusuarioCreado, setSuperusuarioCreado] =
    useState<SuperusuarioCreado | null>(null);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración del Sistema
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administre todas las configuraciones del sistema desde un solo lugar
        </p>
      </div>

      {/* Pestañas principales */}
      <Tabs defaultValue="general" className="mb-4">
        <TabsList className="mb-4 grid grid-cols-6 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger
            value="notificaciones"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Perfiles Clientes</span>
          </TabsTrigger>
        </TabsList>

        {/* Contenido de las pestañas */}
        <TabsContent value="general">
          <ConfiguracionGeneral
            modoMantenimiento={modoMantenimiento}
            setModoMantenimiento={setModoMantenimiento}
            intervaloActualizacion={intervaloActualizacion}
            setIntervaloActualizacion={setIntervaloActualizacion}
          />
        </TabsContent>

        <TabsContent value="perfil">
          <ConfiguracionPerfil
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        </TabsContent>

        <TabsContent value="seguridad">
          <ConfiguracionSeguridad
            superusuarioCreado={superusuarioCreado}
            setSuperusuarioCreado={setSuperusuarioCreado}
          />
        </TabsContent>

        <TabsContent value="notificaciones">
          <ConfiguracionNotificaciones />
        </TabsContent>

        <TabsContent value="sistema">
          <ConfiguracionSistema
            backupAutomatico={backupAutomatico}
            setBackupAutomatico={setBackupAutomatico}
            depuracionRegistros={depuracionRegistros}
            setDepuracionRegistros={setDepuracionRegistros}
          />
        </TabsContent>

        <TabsContent value="clientes">
          <ConfiguracionClientes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
