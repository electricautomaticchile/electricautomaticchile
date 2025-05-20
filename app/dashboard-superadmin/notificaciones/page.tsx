"use client";
import { Encabezado } from '../componentes/encabezado';
import { Notificaciones } from '../componentes/notificaciones';

export default function NotificacionesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Encabezado tipoUsuario="superadmin" />
      
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Notificaciones />
      </main>
    </div>
  );
} 