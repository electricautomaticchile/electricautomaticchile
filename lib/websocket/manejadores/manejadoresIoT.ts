/**
 * Manejadores de Eventos IoT
 * 
 * Responsabilidades:
 * - Manejar actualizaciones de voltaje/corriente/potencia de dispositivos
 * - Procesar cambios de estado de conexión de dispositivos
 * - Manejar alertas IoT
 * - Actualizar estado de la aplicación
 */

import { toast } from '@/components/ui/use-toast';
import { useWebSocketStore } from '@/lib/store/useWebSocketStore';
import { manejarErrorEvento } from '../errorHandlers';
import type {
  ActualizacionVoltajeDispositivo,
  ActualizacionCorrienteDispositivo,
  ActualizacionPotenciaDispositivo,
  ActualizacionConexionDispositivo,
  AlertaIoT,
} from '../tipos';

/**
 * Manejar actualización de voltaje de dispositivo
 */
export function manejarActualizacionVoltaje(datos: ActualizacionVoltajeDispositivo): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('dispositivo:actualizacion_voltaje', datos);

    // Mostrar alerta si la calidad es crítica
    if (datos.calidad === 'critica') {
      toast({
        title: '⚠️ Voltaje Crítico',
        description: `Dispositivo ${datos.idDispositivo}: ${datos.voltaje}V - ${datos.ubicacion || 'Sin ubicación'}`,
        variant: 'destructive',
      });
    } else if (datos.calidad === 'advertencia') {
      toast({
        title: '⚡ Advertencia de Voltaje',
        description: `Dispositivo ${datos.idDispositivo}: ${datos.voltaje}V`,
        variant: 'default',
      });
    }
  } catch (error) {
    const resultado = manejarErrorEvento('dispositivo:actualizacion_voltaje', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando datos',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Manejar actualización de corriente de dispositivo
 */
export function manejarActualizacionCorriente(datos: ActualizacionCorrienteDispositivo): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('dispositivo:actualizacion_corriente', datos);

    // Verificar si hay sobrecarga (corriente muy alta)
    // Esto es un ejemplo - los umbrales deberían venir de configuración
    const umbralCritico = 100; // Amperes
    const umbralAdvertencia = 80; // Amperes

    if (datos.corriente > umbralCritico) {
      toast({
        title: '🔥 Sobrecarga Crítica',
        description: `Dispositivo ${datos.idDispositivo}: ${datos.corriente}A - ${datos.ubicacion || 'Sin ubicación'}`,
        variant: 'destructive',
      });
    } else if (datos.corriente > umbralAdvertencia) {
      toast({
        title: '⚡ Corriente Elevada',
        description: `Dispositivo ${datos.idDispositivo}: ${datos.corriente}A`,
        variant: 'default',
      });
    }
  } catch (error) {
    const resultado = manejarErrorEvento('dispositivo:actualizacion_corriente', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando datos',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Manejar actualización de potencia de dispositivo
 */
export function manejarActualizacionPotencia(datos: ActualizacionPotenciaDispositivo): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('dispositivo:actualizacion_potencia', datos);

    // No mostrar toast para actualizaciones normales de potencia
    // Solo loggear para debugging
    // Los componentes que necesiten estos datos los obtendrán del store
  } catch (error) {
    manejarErrorEvento('dispositivo:actualizacion_potencia', error, datos);
    // No notificar al usuario para actualizaciones de potencia - no es crítico
  }
}

/**
 * Manejar actualización de conexión de dispositivo
 */
export function manejarActualizacionConexion(datos: ActualizacionConexionDispositivo): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('dispositivo:actualizacion_conexion', datos);

    // Mostrar notificación cuando un dispositivo se desconecta
    if (datos.estado === 'desconectado') {
      toast({
        title: '📡 Dispositivo Desconectado',
        description: `Dispositivo ${datos.idDispositivo} se ha desconectado`,
        variant: 'default',
      });
    } else if (datos.estado === 'conectado') {
      // Solo mostrar si es una reconexión (había estado desconectado antes)
      const eventosAnteriores = useWebSocketStore
        .getState()
        .obtenerEventosPorTipo('dispositivo:actualizacion_conexion')
        .filter((e) => e.datos.idDispositivo === datos.idDispositivo);

      const estabaDesconectado = eventosAnteriores.some(
        (e) => e.datos.estado === 'desconectado'
      );

      if (estabaDesconectado) {
        toast({
          title: '✅ Dispositivo Reconectado',
          description: `Dispositivo ${datos.idDispositivo} está en línea`,
          variant: 'default',
        });
      }
    }
  } catch (error) {
    const resultado = manejarErrorEvento('dispositivo:actualizacion_conexion', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando estado',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Manejar nueva alerta IoT
 */
export function manejarAlertaIoT(datos: AlertaIoT): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('iot:alerta:nueva', datos);

    // Determinar el tipo de toast según la severidad
    let variant: 'default' | 'destructive' = 'default';
    let icono = 'ℹ️';

    switch (datos.severidad) {
      case 'critica':
        variant = 'destructive';
        icono = '🚨';
        break;
      case 'alta':
        variant = 'destructive';
        icono = '⚠️';
        break;
      case 'media':
        variant = 'default';
        icono = '⚡';
        break;
      case 'baja':
        variant = 'default';
        icono = 'ℹ️';
        break;
    }

    // Mostrar notificación toast
    toast({
      title: `${icono} ${datos.titulo}`,
      description: datos.mensaje,
      variant,
    });

    // Para alertas críticas, también podríamos reproducir un sonido
    // (esto se implementaría en una función separada)
    if (datos.severidad === 'critica') {
      reproducirSonidoAlerta();
    }
  } catch (error) {
    const resultado = manejarErrorEvento('iot:alerta:nueva', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando alerta',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Reproducir sonido de alerta (opcional)
 * Solo se reproduce si el usuario ha dado permiso
 */
function reproducirSonidoAlerta(): void {
  try {
    // Verificar si el navegador soporta Audio API
    if (typeof Audio !== 'undefined') {
      // Crear un beep simple usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frecuencia en Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  } catch (error) {
    // Silenciar errores de audio - no es crítico
  }
}

/**
 * Registrar todos los manejadores de eventos IoT
 */
export function registrarManejadoresIoT(
  escuchar: <T>(evento: string, callback: (datos: T) => void) => void
): void {
  escuchar<ActualizacionVoltajeDispositivo>(
    'dispositivo:actualizacion_voltaje',
    manejarActualizacionVoltaje
  );

  escuchar<ActualizacionCorrienteDispositivo>(
    'dispositivo:actualizacion_corriente',
    manejarActualizacionCorriente
  );

  escuchar<ActualizacionPotenciaDispositivo>(
    'dispositivo:actualizacion_potencia',
    manejarActualizacionPotencia
  );

  escuchar<ActualizacionConexionDispositivo>(
    'dispositivo:actualizacion_conexion',
    manejarActualizacionConexion
  );

  escuchar<AlertaIoT>('iot:alerta:nueva', manejarAlertaIoT);

}

/**
 * Obtener últimas actualizaciones de un dispositivo específico
 */
export function obtenerUltimasActualizacionesDispositivo(idDispositivo: string) {
  const store = useWebSocketStore.getState();

  return {
    voltaje: store
      .obtenerEventosPorTipo('dispositivo:actualizacion_voltaje')
      .find((e) => e.datos.idDispositivo === idDispositivo)?.datos,
    corriente: store
      .obtenerEventosPorTipo('dispositivo:actualizacion_corriente')
      .find((e) => e.datos.idDispositivo === idDispositivo)?.datos,
    potencia: store
      .obtenerEventosPorTipo('dispositivo:actualizacion_potencia')
      .find((e) => e.datos.idDispositivo === idDispositivo)?.datos,
    conexion: store
      .obtenerEventosPorTipo('dispositivo:actualizacion_conexion')
      .find((e) => e.datos.idDispositivo === idDispositivo)?.datos,
  };
}

/**
 * Obtener todas las alertas activas (no resueltas)
 */
export function obtenerAlertasActivas(): AlertaIoT[] {
  const store = useWebSocketStore.getState();
  const eventos = store.obtenerEventosPorTipo('iot:alerta:nueva');

  return eventos
    .map((e) => e.datos as AlertaIoT)
    .filter((alerta) => !alerta.resuelta)
    .sort((a, b) => {
      // Ordenar por severidad y luego por fecha
      const severidadOrden = { critica: 0, alta: 1, media: 2, baja: 3 };
      const ordenA = severidadOrden[a.severidad];
      const ordenB = severidadOrden[b.severidad];

      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      }

      return new Date(b.marcaTiempo).getTime() - new Date(a.marcaTiempo).getTime();
    });
}
