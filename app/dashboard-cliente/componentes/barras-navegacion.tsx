"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BarChart2, 
  Zap, 
  CreditCard, 
  Clock, 
  Headphones, 
  User, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '@/components/logo'; // Asumiendo que existe un componente Logo

interface BarrasNavegacionProps {
  onCambioComponente: (componente: string) => void;
}

export function BarrasNavegacion({ onCambioComponente }: BarrasNavegacionProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [opcionActiva, setOpcionActiva] = useState<string | null>(null);

  const manejarSeleccion = (componente: string) => {
    setOpcionActiva(componente);
    onCambioComponente(componente);
    setMenuAbierto(false);
  };
  
  const cerrarSesion = () => {
    // Lógica para cerrar sesión
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 z-40 lg:hidden"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? <X /> : <Menu />}
      </Button>

      {/* Navegación lateral */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-full max-w-xs transform bg-white p-6 shadow-lg dark:bg-slate-900 lg:static lg:block lg:shadow-none
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-200 ease-in-out
      `}>
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold text-orange-600">Electric Automatic</span>
            </div>

            <nav className="flex flex-col space-y-1">
              {/* Opción Dashboard */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === null ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion(null as any)}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Panel Principal
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Consumo Eléctrico */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'consumo-electrico' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('consumo-electrico')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Consumo Eléctrico
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Estado del Servicio */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'estado-servicio' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('estado-servicio')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Estado del Servicio
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Pagos y Facturas */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'pagos-facturas' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('pagos-facturas')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pagos y Facturas
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Historial de Consumo */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'historial-consumo' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('historial-consumo')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Historial de Consumo
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Soporte */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'soporte-usuario' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('soporte-usuario')}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Soporte y Ayuda
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>

              {/* Opción Perfil */}
              <Button
                variant="ghost"
                className={`justify-start ${opcionActiva === 'perfil-usuario' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                onClick={() => manejarSeleccion('perfil-usuario')}
              >
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </nav>
          </div>

          {/* Botón de cerrar sesión */}
          <div>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start"
              onClick={cerrarSesion}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overlay para móvil */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </>
  );
} 