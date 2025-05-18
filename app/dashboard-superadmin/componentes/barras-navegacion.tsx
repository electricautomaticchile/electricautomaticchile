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
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarrasNavegacionProps {
  onCambioComponente: (nombreComponente: string | null) => void;
}

export function BarrasNavegacion({ onCambioComponente }: BarrasNavegacionProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const BotonNavegacion = ({ 
    icono, 
    texto, 
    onClick 
  }: { 
    icono: React.ReactNode; 
    texto: string; 
    onClick: () => void;
  }) => (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-orange-600 dark:hover:text-orange-500 w-full"
      onClick={() => {
        onClick();
        setMenuAbierto(false);
      }}
    >
      {icono}
      {texto}
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
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => {
              onCambioComponente("notificaciones");
            }}>
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="sr-only">Notificaciones</span>
            </Button>
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
                icono={<Bell className="h-4 w-4" />} 
                texto="Notificaciones" 
                onClick={() => onCambioComponente("notificaciones")} 
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
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Administrador</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@electricauto.cl</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 