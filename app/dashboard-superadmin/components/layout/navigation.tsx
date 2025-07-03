"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  BarChart3,
  Bell,
  FileText,
  Home,
  Settings,
  Menu,
  History,
  DollarSign,
  FileSpreadsheet,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/hooks/useSocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useApi";
import { Logo } from "@/components/logo";

interface BarrasNavegacionProps {
  onCambioComponente: (nombreComponente: string | null) => void;
}

export function BarrasNavegacion({
  onCambioComponente,
}: BarrasNavegacionProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { unreadNotificationsCount, unreadMessagesCount } = useSocket();
  const { user } = useAuth();

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Cerrar menú al hacer click fuera (solo en móviles)
  const cerrarMenuMovil = () => {
    if (window.innerWidth < 1024) {
      setMenuAbierto(false);
    }
  };

  const BotonNavegacion = ({
    icono,
    texto,
    onClick,
    badge,
  }: {
    icono: React.ReactNode;
    texto: string;
    onClick: () => void;
    badge?: number;
  }) => (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-orange-600 dark:hover:text-orange-500 w-full relative"
      onClick={() => {
        onClick();
        setMenuAbierto(false);
      }}
    >
      <div className="relative">
        {icono}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span>{texto}</span>
    </button>
  );

  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background">
      <div className="flex h-full flex-col">
        {/* Navegación */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-3">
            <BotonNavegacion
              icono={<Home className="h-4 w-4" />}
              texto="Panel Principal"
              onClick={() => {
                onCambioComponente(null);
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<Building2 className="h-4 w-4" />}
              texto="Gestión de Empresas"
              onClick={() => {
                onCambioComponente("gestion-empresas");
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<FileSpreadsheet className="h-4 w-4" />}
              texto="Cotizaciones"
              onClick={() => {
                onCambioComponente("cotizaciones");
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<BarChart3 className="h-4 w-4" />}
              texto="Estadísticas Globales"
              onClick={() => {
                onCambioComponente("estadisticas-globales");
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<DollarSign className="h-4 w-4" />}
              texto="Facturación Global"
              onClick={() => {
                onCambioComponente("facturacion-global");
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<History className="h-4 w-4" />}
              texto="Registros de Actividad"
              onClick={() => {
                onCambioComponente("registros-actividad");
                cerrarMenuMovil();
              }}
            />
            <BotonNavegacion
              icono={<MessageSquare className="h-4 w-4" />}
              texto="Mensajería"
              onClick={() => {
                onCambioComponente("mensajeria");
                cerrarMenuMovil();
              }}
              badge={unreadMessagesCount}
            />
            <BotonNavegacion
              icono={<Bell className="h-4 w-4" />}
              texto="Notificaciones"
              onClick={() => {
                onCambioComponente("notificaciones");
                cerrarMenuMovil();
              }}
              badge={unreadNotificationsCount}
            />
            <BotonNavegacion
              icono={<Settings className="h-4 w-4" />}
              texto="Configuración"
              onClick={() => {
                onCambioComponente("configuracion");
                cerrarMenuMovil();
              }}
            />
          </nav>
        </div>

        {/* Footer del sidebar */}
      </div>
    </div>
  );
}
