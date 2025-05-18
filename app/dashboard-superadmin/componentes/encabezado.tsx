"use client";
import { useState, useEffect } from 'react';
import { Bell, Settings, User, LogOut, Sun, Moon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface EncabezadoProps {
  tipoUsuario: 'superadmin' | 'admin' | 'cliente';
}

export function Encabezado({ tipoUsuario }: EncabezadoProps) {
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(5);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(3);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cerrarSesion = () => {
    // Lógica para cerrar sesión
    window.location.href = '/auth/login';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 dark:bg-slate-950 dark:border-slate-800">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          {tipoUsuario === 'superadmin' && (
            <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-300">
              Superadministrador
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Cambio de tema */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {/* Mensajes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                {mensajesNoLeidos > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {mensajesNoLeidos}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Mensajes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium">Juan Pérez (Codelco)</div>
                  <div className="text-gray-500 dark:text-gray-400 truncate">Consulta sobre la última actualización del sistema...</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 2 horas</div>
                </div>
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium">María Gómez (Enap)</div>
                  <div className="text-gray-500 dark:text-gray-400 truncate">Necesito reprogramar la mantención del próximo...</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 4 horas</div>
                </div>
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium">Rodrigo Silva (Enel)</div>
                  <div className="text-gray-500 dark:text-gray-400 truncate">Los reportes de consumo no están llegando...</div>
                  <div className="text-xs text-gray-400 mt-1">Ayer</div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Link href="/dashboard-superadmin/mensajes" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Ver todos los mensajes
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificacionesNoLeidas > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {notificacionesNoLeidas}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium text-orange-600">Alerta de sistema</div>
                  <div className="text-gray-600 dark:text-gray-300">Detectada alta demanda en sector norte</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 30 minutos</div>
                </div>
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium text-green-600">Nueva empresa registrada</div>
                  <div className="text-gray-600 dark:text-gray-300">Minera Los Pelambres completó su registro</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 2 horas</div>
                </div>
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium text-red-600">Error en dispositivo</div>
                  <div className="text-gray-600 dark:text-gray-300">3 dispositivos desconectados en Antofagasta</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 5 horas</div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm text-blue-600 hover:underline dark:text-blue-400 p-0"
                  onClick={() => setNotificacionesNoLeidas(0)}
                >
                  Marcar todas como leídas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={cerrarSesion}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 