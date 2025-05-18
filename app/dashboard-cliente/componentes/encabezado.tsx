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

interface EncabezadoProps {
  tipoUsuario: 'superadmin' | 'admin' | 'cliente';
  nombreCliente?: string;
  numeroCliente?: string;
}

export function Encabezado({ tipoUsuario, nombreCliente = 'Usuario', numeroCliente = '' }: EncabezadoProps) {
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(2);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cerrarSesion = () => {
    // Lógica para cerrar sesión
    window.location.href = '/auth/login';
  };

  // Obtener iniciales para el avatar
  const obtenerIniciales = (nombre: string) => {
    const partesNombre = nombre.split(' ');
    if (partesNombre.length >= 2) {
      return `${partesNombre[0][0]}${partesNombre[1][0]}`;
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const manejarCambioTema = () => {
    if (mounted) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 dark:bg-slate-950 dark:border-slate-800">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          {tipoUsuario === 'cliente' && (
            <div className="text-sm hidden md:block">
              <p className="font-medium">{nombreCliente}</p>
              {numeroCliente && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cliente #{numeroCliente}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Cambio de tema */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={manejarCambioTema}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

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
                  <div className="font-medium text-orange-600">Pago registrado</div>
                  <div className="text-gray-600 dark:text-gray-300">Su pago por $45.800 ha sido registrado correctamente</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 30 minutos</div>
                </div>
                <div className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer">
                  <div className="font-medium text-blue-600">Nuevo informe disponible</div>
                  <div className="text-gray-600 dark:text-gray-300">El informe de consumo de mayo está disponible</div>
                  <div className="text-xs text-gray-400 mt-1">Hace 2 horas</div>
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
                  <AvatarImage src="/avatars/cliente.jpg" alt="Cliente" />
                  <AvatarFallback>{obtenerIniciales(nombreCliente)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '#perfil-usuario'}>
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