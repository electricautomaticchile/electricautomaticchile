"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  BarChart3,
  Bell,
  Home,
  Settings,
  History,
  DollarSign,
  FileSpreadsheet,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/hooks/useSocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useApi";
import { Logo } from "@/components/logo";

interface NavegacionMovilProps {
  onCambioComponente: (nombreComponente: string | null) => void;
}

export function NavegacionMovil({ onCambioComponente }: NavegacionMovilProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { unreadNotificationsCount, unreadMessagesCount } = useSocket();
  const { user } = useAuth();

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cerrarMenu();
      }
    };

    if (menuAbierto) {
      document.addEventListener("keydown", manejarEscape);
    }

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [menuAbierto]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAbierto]);

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
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-500 w-full relative text-left"
      onClick={() => {
        onClick();
        cerrarMenu();
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
      <span className="text-base font-medium">{texto}</span>
    </button>
  );

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-10 w-10"
        onClick={alternarMenu}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      {/* Overlay */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={cerrarMenu}
        />
      )}

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-background transform transition-transform duration-300 ease-in-out lg:hidden ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header del menú */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-4">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <Logo width={24} height={24} />
              <span className="text-lg text-gray-900 dark:text-white">
                Electric<span className="text-orange-600">Admin</span>
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={cerrarMenu}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>

          {/* Navegación */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-4">
              <BotonNavegacion
                icono={<Home className="h-5 w-5" />}
                texto="Panel Principal"
                onClick={() => onCambioComponente(null)}
              />
              <BotonNavegacion
                icono={<Building2 className="h-5 w-5" />}
                texto="Gestión de Empresas"
                onClick={() => onCambioComponente("gestion-empresas")}
              />
              <BotonNavegacion
                icono={<FileSpreadsheet className="h-5 w-5" />}
                texto="Cotizaciones"
                onClick={() => onCambioComponente("cotizaciones")}
              />
              <BotonNavegacion
                icono={<BarChart3 className="h-5 w-5" />}
                texto="Estadísticas Globales"
                onClick={() => onCambioComponente("estadisticas-globales")}
              />
              <BotonNavegacion
                icono={<DollarSign className="h-5 w-5" />}
                texto="Facturación Global"
                onClick={() => onCambioComponente("facturacion-global")}
              />
              <BotonNavegacion
                icono={<History className="h-5 w-5" />}
                texto="Registros de Actividad"
                onClick={() => onCambioComponente("registros-actividad")}
              />
              <BotonNavegacion
                icono={<MessageSquare className="h-5 w-5" />}
                texto="Mensajería"
                onClick={() => onCambioComponente("mensajeria")}
                badge={unreadMessagesCount}
              />
              <BotonNavegacion
                icono={<Bell className="h-5 w-5" />}
                texto="Notificaciones"
                onClick={() => onCambioComponente("notificaciones")}
                badge={unreadNotificationsCount}
              />
              <BotonNavegacion
                icono={<Settings className="h-5 w-5" />}
                texto="Configuración"
                onClick={() => onCambioComponente("configuracion")}
              />
            </nav>
          </div>

          {/* Footer del menú */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                <AvatarFallback className="bg-orange-500 text-white">
                  {user?.nombre?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.numeroCliente || "-------"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  electricautomaticchile@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
