"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/hooks/useSocket";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/lib/hooks/useApi";

interface EncabezadoProps {
  tipoUsuario: "superadmin" | "admin" | "cliente";
  menuMovil?: React.ReactNode;
  onCambioComponente?: (nombreComponente: string | null) => void;
}

export function Encabezado({
  tipoUsuario,
  menuMovil,
  onCambioComponente,
}: EncabezadoProps) {
  const {
    notifications,
    messages,
    unreadNotificationsCount,
    unreadMessagesCount,
    markNotificationAsRead,
    markMessageAsRead,
    connected,
  } = useSocket();

  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatearTiempo = (fecha: Date) => {
    try {
      return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es,
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const cerrarSesion = () => {
    logout();
    router.push("/auth/login");
  };

  const verTodasNotificaciones = () => {
    window.location.href = "/dashboard-superadmin/notificaciones";
  };

  const verTodosMensajes = () => {
    window.location.href = "/dashboard-superadmin/mensajes";
  };

  const irAConfiguracion = () => {
    window.location.href = "/dashboard-superadmin/configuracion";
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background px-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Menú móvil */}
          {menuMovil}
          {tipoUsuario === "superadmin" && (
            <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-300">
              <span className="mr-1">Superadministrador</span>
              {connected && user && (
                <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Usuario conectado con Superadministrador {user.numeroCliente}
                </span>
              )}
            </div>
          )}

          {/* Información del administrador */}
          <div className="hidden md:flex flex-col ml-4">
            <div className="font-medium text-sm">
              {user?.numeroCliente || "-------"} -{" "}
              {user?.email || "admin@electricauto.cl"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mensajes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Mensajes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {messages && messages.length > 0 ? (
                  messages.slice(0, 5).map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer ${
                        !msg.leido ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => markMessageAsRead()}
                    >
                      <div className="font-medium">
                        {msg.emisorNombre || "Usuario"}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 truncate">
                        {msg.contenido}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatearTiempo(msg.fecha)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tienes mensajes nuevos</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-blue-600 hover:underline dark:text-blue-400 p-0"
                  onClick={verTodosMensajes}
                >
                  Ver todos los mensajes
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif: any) => (
                    <div
                      key={notif.id}
                      className={`p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer ${
                        !notif.leida ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => markNotificationAsRead()}
                    >
                      <div
                        className={`font-medium ${
                          notif.tipo === "alerta"
                            ? "text-red-600"
                            : notif.tipo === "info"
                              ? "text-blue-600"
                              : "text-green-600"
                        }`}
                      >
                        {notif.titulo}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {notif.descripcion}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-400">
                          {formatearTiempo(notif.fecha)}
                        </div>
                        <Badge
                          className={
                            notif.prioridad === "alta"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : notif.prioridad === "media"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          }
                        >
                          {notif.prioridad}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tienes notificaciones nuevas</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-blue-600 hover:underline dark:text-blue-400 p-0"
                  onClick={verTodasNotificaciones}
                >
                  Ver todas las notificaciones
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback>
                    {user?.nombre?.charAt(0) || "SA"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onCambioComponente?.("configuracion")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated && user && (
                <DropdownMenuItem
                  onClick={cerrarSesion}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
