"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  BarChart3, 
  Bell, 
  FileText, 
  Home, 
  Settings, 
  Package, 
  Menu, 
  History, 
  DollarSign,
  FileSpreadsheet,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/lib/socket/socket-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

interface BarrasNavegacionProps {
  onCambioComponente: (nombreComponente: string | null) => void;
}

export function BarrasNavegacion({ onCambioComponente }: BarrasNavegacionProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { unreadNotificationsCount, unreadMessagesCount } = useSocket();
  const { data: session } = useSession();

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const BotonNavegacion = ({ 
    icono, 
    texto, 
    onClick,
    badge
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
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span>{texto}</span>
    </button>
  );

  return (
    <nav>
      <div className="border-r border-gray-200 dark:border-gray-800">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b border-gray-200 dark:border-gray-800 px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Package className="h-6 w-6 text-orange-600 lg:hidden" onClick={alternarMenu} />
              <Package className="h-6 w-6 text-orange-600 hidden lg:block" />
              <span className="text-lg text-gray-900 dark:text-white">Electric<span className="text-orange-600">Admin</span></span>
            </Link>
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={() => {
                onCambioComponente("mensajeria");
              }}>
                <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
                <span className="sr-only">Mensajes</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={() => {
                onCambioComponente("notificaciones");
              }}>
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
                <span className="sr-only">Notificaciones</span>
              </Button>
            </div>
          </div>
          <div className={`flex-1 overflow-auto py-2 ${menuAbierto ? 'block' : 'hidden'} lg:block`}>
            <nav className="grid items-start px-4 text-base font-medium">
              <BotonNavegacion 
                icono={<Home className="h-4 w-4" />} 
                texto="Panel Principal" 
                onClick={() => onCambioComponente(null)} 
              />
              <BotonNavegacion 
                icono={<Building2 className="h-4 w-4" />} 
                texto="Gestión de Empresas" 
                onClick={() => onCambioComponente("gestion-empresas")} 
              />
              <BotonNavegacion 
                icono={<FileSpreadsheet className="h-4 w-4" />} 
                texto="Cotizaciones" 
                onClick={() => onCambioComponente("cotizaciones")} 
              />
              <BotonNavegacion 
                icono={<BarChart3 className="h-4 w-4" />} 
                texto="Estadísticas Globales" 
                onClick={() => onCambioComponente("estadisticas-globales")} 
              />
              <BotonNavegacion 
                icono={<DollarSign className="h-4 w-4" />} 
                texto="Facturación Global" 
                onClick={() => onCambioComponente("facturacion-global")} 
              />
              <BotonNavegacion 
                icono={<History className="h-4 w-4" />} 
                texto="Registros de Actividad" 
                onClick={() => onCambioComponente("registros-actividad")} 
              />
              <BotonNavegacion 
                icono={<MessageSquare className="h-4 w-4" />} 
                texto="Mensajería" 
                onClick={() => onCambioComponente("mensajeria")}
                badge={unreadMessagesCount}
              />
              <BotonNavegacion 
                icono={<Bell className="h-4 w-4" />} 
                texto="Notificaciones" 
                onClick={() => onCambioComponente("notificaciones")}
                badge={unreadNotificationsCount}
              />
              <BotonNavegacion 
                icono={<Settings className="h-4 w-4" />} 
                texto="Configuración" 
                onClick={() => onCambioComponente("configuracion")} 
              />
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || "/avatars/admin.jpg"} alt="Admin" />
                <AvatarFallback className="bg-orange-500 text-white">
                  {session?.user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session?.user?.clientNumber || "-------"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="block text-[10px]">electricautomaticchile@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 