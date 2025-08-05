"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  Building2,
  LogOut,
  Sun,
  Moon,
  Search,
  KeyRound,
  Users,
  BarChart3,
  Menu,
  X,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/hooks/useApi";
import { useNotifications } from "@/hooks/useNotifications";
import { ProfileImageManager } from "@/components/ui/profile-image-manager";

interface EncabezadoEmpresaProps {
  onCambiarPassword?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function EncabezadoEmpresa({
  onCambiarPassword,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: EncabezadoEmpresaProps) {
  const { user, logout, isAuthenticated } = useApi();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  // WebSocket removido temporalmente
  const isConnected = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const cerrarSesion = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Obtener nombre de la empresa o valor por defecto con compatibilidad
  const nombreEmpresa =
    (user as any)?.nombreEmpresa ||
    user?.name ||
    (user as any)?.nombre ||
    "Mi Empresa";
  const numeroCliente = (user as any)?.numeroCliente || "------";
  const emailEmpresa =
    (user as any)?.correo || user?.email || "empresa@ejemplo.com";
  // Asegurar compatibilidad con diferentes formatos de respuesta
  const userType = user?.type || (user as any)?.tipoUsuario || "empresa";
  const userRole = user?.role || "empresa";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background px-4 md:px-6">
      <div className="w-full flex justify-between items-center">
        {/* Lado izquierdo - Logo/Info empresa y búsqueda */}
        <div className="flex items-center gap-4 flex-1">
          {/* Menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Información de la empresa */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:flex flex-col">
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {nombreEmpresa}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Cliente: {numeroCliente}
              </div>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-md ml-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar clientes, reportes..."
                className="pl-10 w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Lado derecho - Acciones y perfil */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Búsqueda móvil */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Estadísticas rápidas */}
          <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">24</span>
              <span className="text-gray-500">clientes</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="font-medium">87%</span>
              <span className="text-gray-500">activos</span>
            </div>
          </div>

          {/* Toggle tema */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {/* Indicador de conexión WebSocket */}
                <span
                  className={`absolute -bottom-1 -right-1 h-2 w-2 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Notificaciones</span>
                  {isConnected ? (
                    <Wifi className="h-3 w-3 text-green-600" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} nuevas
                    </Badge>
                  )}
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-6 px-2"
                    >
                      Marcar todas
                    </Button>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    <BellRing className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notificacion, index) => {
                    const IconoTipo =
                      notificacion.tipo === "error"
                        ? AlertTriangle
                        : notificacion.tipo === "exito"
                          ? CheckCircle2
                          : BellRing;
                    const colorTipo =
                      notificacion.tipo === "error"
                        ? "border-l-red-500"
                        : notificacion.tipo === "advertencia"
                          ? "border-l-amber-500"
                          : notificacion.tipo === "exito"
                            ? "border-l-green-500"
                            : "border-l-blue-500";
                    const colorTexto =
                      notificacion.tipo === "error"
                        ? "text-red-700 dark:text-red-400"
                        : notificacion.tipo === "advertencia"
                          ? "text-amber-700 dark:text-amber-400"
                          : notificacion.tipo === "exito"
                            ? "text-green-700 dark:text-green-400"
                            : "text-blue-700 dark:text-blue-400";

                    return (
                      <div
                        key={notificacion.id}
                        className={`p-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 border-l-4 ${colorTipo} cursor-pointer transition-colors ${
                          !notificacion.leida
                            ? "bg-orange-50 dark:bg-orange-900/10"
                            : ""
                        }`}
                        onClick={() => markAsRead(notificacion.id)}
                      >
                        <div className="flex items-start gap-2">
                          <IconoTipo
                            className={`h-4 w-4 mt-0.5 ${colorTexto}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium ${colorTexto} flex items-center gap-2`}
                            >
                              {notificacion.mensaje}
                              {!notificacion.leida && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 text-xs mt-1 flex items-center gap-2">
                              {notificacion.dispositivo && (
                                <span>
                                  Dispositivo: {notificacion.dispositivo}
                                </span>
                              )}
                              {notificacion.ubicacion && (
                                <span className="truncate">
                                  {notificacion.ubicacion}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {notificacion.fecha} - {notificacion.hora}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm justify-start"
                  onClick={() => router.push("/dashboard-empresa?tab=alertas")}
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
                className="flex items-center gap-2 h-auto px-2 py-1"
              >
                <ProfileImageManager
                  userId={(user as any)?._id || user?.id || ""}
                  tipoUsuario={userType || userRole || "empresa"}
                  userName={nombreEmpresa}
                  size="sm"
                  showEditButton={false}
                  className="h-8 w-8"
                />
                <div className="hidden md:flex flex-col items-start">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {nombreEmpresa.length > 20
                      ? nombreEmpresa.substring(0, 20) + "..."
                      : nombreEmpresa}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Administrador
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <div className="flex items-center space-x-3">
                  <ProfileImageManager
                    userId={(user as any)?._id || user?.id || ""}
                    tipoUsuario={userType || userRole || "empresa"}
                    userName={nombreEmpresa}
                    size="md"
                    showEditButton={true}
                  />
                  <div className="flex flex-col space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {nombreEmpresa}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {emailEmpresa}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Cliente: {numeroCliente}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {onCambiarPassword && (
                <DropdownMenuItem onClick={onCambiarPassword}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Cambiar Contraseña</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>

              {/* Toggle tema en móvil */}
              {mounted && (
                <DropdownMenuItem
                  className="md:hidden"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>Cambiar tema</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {isAuthenticated && user && (
                <DropdownMenuItem
                  onClick={cerrarSesion}
                  className="text-red-600 focus:text-red-600 dark:focus:text-red-400"
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
