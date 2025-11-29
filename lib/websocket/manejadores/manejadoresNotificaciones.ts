/**
 * Manejadores de Notificaciones
 * 
 * Responsabilidades:
 * - Manejar notificaciones entrantes
 * - Mostrar notificaciones toast
 * - Actualizar contador de notificaciones
 */

import { toast } from '@/components/ui/use-toast';
import { useWebSocketStore } from '@/lib/store/useWebSocketStore';
import { manejarErrorEvento } from '../errorHandlers';
import type { NotificacionData } from '../tipos';

/**
 * Interfaz extendida para notificaciones recibidas
 */
export interface NotificacionRecibida extends NotificacionData {
  leida: boolean;
  idUsuario?: string;
}

/**
 * Interfaz para evento de notificación leída
 */
export interface NotificacionLeida {
  id: string;
  idUsuario: string;
  marcaTiempo: string;
}

/**
 * Manejar notificación recibida
 */
export function manejarNotificacionRecibida(datos: NotificacionRecibida): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('notificacion:recibida', datos);

    // Determinar el variant del toast según el tipo
    let variant: 'default' | 'destructive' = 'default';
    let icono = 'ℹ️';

    switch (datos.tipo) {
      case 'error':
        variant = 'destructive';
        icono = '❌';
        break;
      case 'warning':
        variant = 'default';
        icono = '⚠️';
        break;
      case 'success':
        variant = 'default';
        icono = '✅';
        break;
      case 'info':
        variant = 'default';
        icono = 'ℹ️';
        break;
    }

    // Mostrar toast notification
    toast({
      title: `${icono} ${datos.titulo}`,
      description: datos.mensaje,
      variant,
    });

    // Actualizar contador de notificaciones no leídas
    actualizarContadorNotificaciones();
  } catch (error) {
    const resultado = manejarErrorEvento('notificacion:recibida', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando notificación',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Manejar notificación leída
 */
export function manejarNotificacionLeida(datos: NotificacionLeida): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('notificacion:leida', datos);

    // Actualizar el estado de la notificación en el store
    const store = useWebSocketStore.getState();
    const notificaciones = store.obtenerEventosPorTipo('notificacion:recibida');

    // Buscar la notificación y marcarla como leída
    const notificacion = notificaciones.find((e) => e.datos.id === datos.id);
    if (notificacion) {
      notificacion.datos.leida = true;
    }

    // Actualizar contador de notificaciones no leídas
    actualizarContadorNotificaciones();
  } catch (error) {
    manejarErrorEvento('notificacion:leida', error, datos);
    // No notificar al usuario - no es crítico
  }
}

/**
 * Actualizar contador de notificaciones no leídas
 * Esta función puede ser llamada por componentes externos
 */
export function actualizarContadorNotificaciones(): number {
  try {
    const notificacionesNoLeidas = obtenerNotificacionesNoLeidas();
    const contador = notificacionesNoLeidas.length;


    // Aquí podrías emitir un evento personalizado para que los componentes se actualicen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('notificaciones:contador-actualizado', {
          detail: { contador },
        })
      );
    }

    return contador;
  } catch (error) {
    return 0;
  }
}

/**
 * Registrar todos los manejadores de notificaciones
 */
export function registrarManejadoresNotificaciones(
  escuchar: <T>(evento: string, callback: (datos: T) => void) => void
): void {
  escuchar<NotificacionRecibida>('notificacion:recibida', manejarNotificacionRecibida);
  escuchar<NotificacionLeida>('notificacion:leida', manejarNotificacionLeida);

}

/**
 * Obtener todas las notificaciones
 */
export function obtenerTodasNotificaciones(): NotificacionRecibida[] {
  const store = useWebSocketStore.getState();
  const eventos = store.obtenerEventosPorTipo('notificacion:recibida');

  return eventos
    .map((e) => e.datos as NotificacionRecibida)
    .sort((a, b) => {
      // Ordenar por fecha (más reciente primero)
      return new Date(b.marcaTiempo).getTime() - new Date(a.marcaTiempo).getTime();
    });
}

/**
 * Obtener notificaciones no leídas
 */
export function obtenerNotificacionesNoLeidas(): NotificacionRecibida[] {
  const todasNotificaciones = obtenerTodasNotificaciones();
  return todasNotificaciones.filter((notif) => !notif.leida);
}

/**
 * Obtener notificaciones leídas
 */
export function obtenerNotificacionesLeidas(): NotificacionRecibida[] {
  const todasNotificaciones = obtenerTodasNotificaciones();
  return todasNotificaciones.filter((notif) => notif.leida);
}

/**
 * Obtener contador de notificaciones no leídas
 */
export function obtenerContadorNoLeidas(): number {
  return obtenerNotificacionesNoLeidas().length;
}

/**
 * Marcar notificación como leída (emitir evento al servidor)
 */
export function marcarNotificacionComoLeida(
  idNotificacion: string,
  emitir: (evento: string, datos: any) => void
): void {
  try {

    // Emitir evento al servidor
    emitir('notificacion:marcar-leida', {
      id: idNotificacion,
      marcaTiempo: new Date().toISOString(),
    });
  } catch (error) {
  }
}

/**
 * Marcar todas las notificaciones como leídas
 */
export function marcarTodasComoLeidas(emitir: (evento: string, datos: any) => void): void {
  try {
    const notificacionesNoLeidas = obtenerNotificacionesNoLeidas();

      `[ManejadorNotificaciones] Marcando ${notificacionesNoLeidas.length} notificaciones como leídas`
    );

    // Emitir evento al servidor para cada notificación
    notificacionesNoLeidas.forEach((notif) => {
      emitir('notificacion:marcar-leida', {
        id: notif.id,
        marcaTiempo: new Date().toISOString(),
      });
    });
  } catch (error) {
  }
}

/**
 * Limpiar notificaciones antiguas (más de 7 días)
 */
export function limpiarNotificacionesAntiguas(): void {
  try {
    const store = useWebSocketStore.getState();
    const ahora = Date.now();
    const sietesDias = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

    const notificaciones = store.obtenerEventosPorTipo('notificacion:recibida');
    const notificacionesAntiguasIds = notificaciones
      .filter((e) => {
        const fechaNotif = new Date(e.datos.marcaTiempo).getTime();
        return ahora - fechaNotif > sietesDias;
      })
      .map((e) => e.datos.id);

      `[ManejadorNotificaciones] Limpiando ${notificacionesAntiguasIds.length} notificaciones antiguas`
    );

    // Aquí podrías implementar lógica para eliminar del store
    // Por ahora solo loggeamos
  } catch (error) {
  }
}

/**
 * Hook personalizado para usar en componentes React
 * Escucha cambios en el contador de notificaciones
 */
export function useContadorNotificaciones(): number {
  const [contador, setContador] = React.useState(() => {
    if (typeof window === 'undefined') {
      return 0;
    }
    return obtenerContadorNoLeidas();
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleUpdate = (event: CustomEvent) => {
      setContador(event.detail.contador);
    };

    window.addEventListener('notificaciones:contador-actualizado', handleUpdate as EventListener);

    return () => {
      window.removeEventListener(
        'notificaciones:contador-actualizado',
        handleUpdate as EventListener
      );
    };
  }, []);

  return contador;
}

// Importar React para el hook
import * as React from 'react';
