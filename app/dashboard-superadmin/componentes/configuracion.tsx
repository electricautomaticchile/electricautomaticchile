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
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Globe,
  User,
  Shield,
  Bell,
  Database,
  Users,
} from "lucide-react";

// Importar todos los componentes de configuración
import { ConfiguracionGeneral } from "./configuracion/ConfiguracionGeneral";
import { ConfiguracionPerfil } from "./configuracion/ConfiguracionPerfil";
import { ConfiguracionSeguridad } from "./configuracion/ConfiguracionSeguridad";
import { ConfiguracionNotificaciones } from "./configuracion/ConfiguracionNotificaciones";
import { ConfiguracionSistema } from "./configuracion/ConfiguracionSistema";
import { ConfiguracionClientes } from "./configuracion/ConfiguracionClientes";

interface ConfiguracionProps {
  reducida?: boolean;
}

export function Configuracion({ reducida = false }: ConfiguracionProps) {
  const [configuracionCambiada, setConfiguracionCambiada] = useState(false);

  // Estados para ConfiguracionSistema
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [depuracionRegistros, setDepuracionRegistros] = useState(false);

  // Estados para ConfiguracionGeneral (original)
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [intervaloActualizacion, setIntervaloActualizacion] = useState("5");

  // Estados para ConfiguracionPerfil
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Estados para ConfiguracionSeguridad
  const [superusuarioCreado, setSuperusuarioCreado] = useState<{
    numeroCliente: string;
    correo: string;
    nombre: string;
  } | null>(null);

  const handleConfiguracionCambiada = () => {
    setConfiguracionCambiada(true);
    // Aquí puedes agregar lógica adicional cuando cambie la configuración
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-orange-600" />
          Configuración del Sistema
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Administre todas las configuraciones del sistema desde un solo lugar
        </p>
        {configuracionCambiada && (
          <Badge variant="secondary" className="mt-2">
            Configuraciones modificadas
          </Badge>
        )}
      </div>

      {/* Tabs de configuración */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger
            value="notificaciones"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Clientes</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general">
          <ConfiguracionGeneral
            modoMantenimiento={modoMantenimiento}
            setModoMantenimiento={setModoMantenimiento}
            intervaloActualizacion={intervaloActualizacion}
            setIntervaloActualizacion={setIntervaloActualizacion}
          />
        </TabsContent>

        {/* Configuración de Perfil */}
        <TabsContent value="perfil">
          <ConfiguracionPerfil
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="seguridad">
          <ConfiguracionSeguridad
            superusuarioCreado={superusuarioCreado}
            setSuperusuarioCreado={setSuperusuarioCreado}
          />
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notificaciones">
          <ConfiguracionNotificaciones />
        </TabsContent>

        {/* Configuración del Sistema */}
        <TabsContent value="sistema">
          <ConfiguracionSistema
            backupAutomatico={backupAutomatico}
            setBackupAutomatico={setBackupAutomatico}
            depuracionRegistros={depuracionRegistros}
            setDepuracionRegistros={setDepuracionRegistros}
          />
        </TabsContent>

        {/* Configuración de Clientes */}
        <TabsContent value="clientes">
          <ConfiguracionClientes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
