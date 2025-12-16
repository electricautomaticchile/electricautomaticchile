/**
 * Manejadores de Control de Hardware
 * 
 * Responsabilidades:
 * - Manejar respuestas de comandos Arduino
 * - Procesar lecturas de sensores
 * - Manejar cambios de estado de relés
 * - Actualizar estado de hardware en UI
 */

import { toast } from '@/components/ui/use-toast';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { manejarErrorEvento } from '../errorHandlers';
import type {
  ResultadoComandoHardware,
  ActualizacionSensorHardware,
  ActualizacionReleHardware,
} from '../tipos';

/**
 * Manejar resultado de comando de hardware
 */
export function manejarResultadoComando(datos: ResultadoComandoHardware): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('hardware:resultado_comando', datos);

    // Mostrar notificación según el resultado
    if (datos.exitoso) {
      toast({
        title: '✅ Comando Ejecutado',
        description: `Dispositivo ${datos.idDispositivo} - Tiempo: ${datos.tiempoEjecucion}ms`,
        variant: 'default',
      });
    } else {
      toast({
        title: '❌ Error en Comando',
        description: `Dispositivo ${datos.idDispositivo}: ${datos.error || 'Error desconocido'}`,
        variant: 'destructive',
      });
    }

    // Emitir evento personalizado para que los componentes se actualicen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hardware:comando-completado', {
          detail: datos,
        })
      );
    }
  } catch (error) {
    const resultado = manejarErrorEvento('hardware:resultado_comando', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando comando',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Manejar actualización de sensor
 */
export function manejarActualizacionSensor(datos: ActualizacionSensorHardware): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('hardware:actualizacion_sensor', datos);

    // Verificar umbrales según el tipo de sensor
    verificarUmbralesSensor(datos);

    // No mostrar toast para actualizaciones normales de sensores
    // Solo loggear para debugging
    // Los componentes que necesiten estos datos los obtendrán del store
  } catch (error) {
    manejarErrorEvento('hardware:actualizacion_sensor', error, datos);
    // No notificar al usuario para actualizaciones de sensores - no es crítico
  }
}

/**
 * Manejar actualización de relé
 */
export function manejarActualizacionRele(datos: ActualizacionReleHardware): void {
  try {

    // Agregar evento al store
    useWebSocketStore.getState().agregarEvento('hardware:actualizacion_rele', datos);

    // Mostrar notificación del cambio de estado
    const icono = datos.estado === 'encendido' ? '🟢' : '🔴';
    const estadoTexto = datos.estado === 'encendido' ? 'Encendido' : 'Apagado';

    toast({
      title: `${icono} Relé ${estadoTexto}`,
      description: `${datos.nombre || datos.idRele} - ${datos.ubicacion || 'Sin ubicación'}`,
      variant: 'default',
    });

    // Emitir evento personalizado para que los componentes se actualicen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hardware:rele-actualizado', {
          detail: datos,
        })
      );
    }
  } catch (error) {
    const resultado = manejarErrorEvento('hardware:actualizacion_rele', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error procesando relé',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}

/**
 * Verificar umbrales de sensores y generar alertas si es necesario
 */
function verificarUmbralesSensor(datos: ActualizacionSensorHardware): void {
  try {
    // Umbrales por tipo de sensor (estos deberían venir de configuración)
    const umbrales: Record<string, { min?: number; max?: number; critico?: number }> = {
      temperatura: { min: 0, max: 40, critico: 50 },
      humedad: { min: 20, max: 80, critico: 90 },
      presion: { min: 900, max: 1100 },
    };

    const umbral = umbrales[datos.tipo];
    if (!umbral) {
      return; // No hay umbrales definidos para este tipo de sensor
    }

    // Verificar si el valor está fuera de rango
    let alerta = false;
    let mensaje = '';
    let variant: 'default' | 'destructive' = 'default';

    if (umbral.critico && datos.valor >= umbral.critico) {
      alerta = true;
      mensaje = `⚠️ Valor crítico de ${datos.tipo}: ${datos.valor}${datos.unidad}`;
      variant = 'destructive';
    } else if (umbral.max && datos.valor > umbral.max) {
      alerta = true;
      mensaje = `⚡ ${datos.tipo} elevada: ${datos.valor}${datos.unidad}`;
      variant = 'default';
    } else if (umbral.min && datos.valor < umbral.min) {
      alerta = true;
      mensaje = `⚡ ${datos.tipo} baja: ${datos.valor}${datos.unidad}`;
      variant = 'default';
    }

    if (alerta) {
      toast({
        title: 'Alerta de Sensor',
        description: `${mensaje} - ${datos.ubicacion || datos.idDispositivo}`,
        variant,
      });
    }
  } catch (error) {
  }
}

/**
 * Registrar todos los manejadores de hardware
 */
export function registrarManejadoresHardware(
  escuchar: <T>(evento: string, callback: (datos: T) => void) => void
): void {
  escuchar<ResultadoComandoHardware>('hardware:resultado_comando', manejarResultadoComando);
  escuchar<ActualizacionSensorHardware>('hardware:actualizacion_sensor', manejarActualizacionSensor);
  escuchar<ActualizacionReleHardware>('hardware:actualizacion_rele', manejarActualizacionRele);

}

/**
 * Obtener últimas lecturas de sensores de un dispositivo
 */
export function obtenerLecturasSensoresDispositivo(idDispositivo: string): ActualizacionSensorHardware[] {
  const store = useWebSocketStore.getState();
  const eventos = store.obtenerEventosPorTipo('hardware:actualizacion_sensor');

  return eventos
    .filter((e) => e.datos.idDispositivo === idDispositivo)
    .map((e) => e.datos as ActualizacionSensorHardware)
    .sort((a, b) => {
      // Ordenar por fecha (más reciente primero)
      return new Date(b.marcaTiempo).getTime() - new Date(a.marcaTiempo).getTime();
    });
}

/**
 * Obtener última lectura de un sensor específico
 */
export function obtenerUltimaLecturaSensor(
  idDispositivo: string,
  idSensor: string
): ActualizacionSensorHardware | undefined {
  const lecturas = obtenerLecturasSensoresDispositivo(idDispositivo);
  return lecturas.find((lectura) => lectura.idSensor === idSensor);
}

/**
 * Obtener estado actual de todos los relés de un dispositivo
 */
export function obtenerEstadoRelesDispositivo(idDispositivo: string): ActualizacionReleHardware[] {
  const store = useWebSocketStore.getState();
  const eventos = store.obtenerEventosPorTipo('hardware:actualizacion_rele');

  // Obtener solo el estado más reciente de cada relé
  const relesPorId = new Map<string, ActualizacionReleHardware>();

  eventos
    .filter((e) => e.datos.idDispositivo === idDispositivo)
    .forEach((e) => {
      const datos = e.datos as ActualizacionReleHardware;
      const existing = relesPorId.get(datos.idRele);

      if (
        !existing ||
        new Date(datos.marcaTiempo).getTime() > new Date(existing.marcaTiempo).getTime()
      ) {
        relesPorId.set(datos.idRele, datos);
      }
    });

  return Array.from(relesPorId.values());
}

/**
 * Obtener estado de un relé específico
 */
export function obtenerEstadoRele(
  idDispositivo: string,
  idRele: string
): ActualizacionReleHardware | undefined {
  const reles = obtenerEstadoRelesDispositivo(idDispositivo);
  return reles.find((rele) => rele.idRele === idRele);
}

/**
 * Obtener historial de comandos de un dispositivo
 */
export function obtenerHistorialComandos(idDispositivo: string): ResultadoComandoHardware[] {
  const store = useWebSocketStore.getState();
  const eventos = store.obtenerEventosPorTipo('hardware:resultado_comando');

  return eventos
    .filter((e) => e.datos.idDispositivo === idDispositivo)
    .map((e) => e.datos as ResultadoComandoHardware)
    .sort((a, b) => {
      // Ordenar por fecha (más reciente primero)
      return new Date(b.idComando).getTime() - new Date(a.idComando).getTime();
    });
}

/**
 * Obtener estadísticas de comandos de un dispositivo
 */
export function obtenerEstadisticasComandos(idDispositivo: string) {
  const historial = obtenerHistorialComandos(idDispositivo);

  const total = historial.length;
  const exitosos = historial.filter((cmd) => cmd.exitoso).length;
  const fallidos = total - exitosos;
  const tasaExito = total > 0 ? (exitosos / total) * 100 : 0;
  const tiempoPromedioEjecucion =
    total > 0
      ? historial.reduce((sum, cmd) => sum + cmd.tiempoEjecucion, 0) / total
      : 0;

  return {
    total,
    exitosos,
    fallidos,
    tasaExito: Math.round(tasaExito * 100) / 100,
    tiempoPromedioEjecucion: Math.round(tiempoPromedioEjecucion * 100) / 100,
  };
}

/**
 * Enviar comando a dispositivo
 */
export function enviarComandoDispositivo(
  idDispositivo: string,
  comando: string,
  parametros: Record<string, any>,
  emitir: (evento: string, datos: any) => void
): string {
  try {
    const idComando = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Emitir comando al servidor
    emitir('hardware:enviar_comando', {
      idComando,
      idDispositivo,
      comando,
      parametros,
      marcaTiempo: new Date().toISOString(),
    });

    return idComando;
  } catch (error) {
    throw error;
  }
}

/**
 * Controlar relé (encender/apagar)
 */
export function controlarRele(
  idDispositivo: string,
  idRele: string,
  estado: 'encendido' | 'apagado',
  emitir: (evento: string, datos: any) => void
): string {
  return enviarComandoDispositivo(
    idDispositivo,
    'controlar_rele',
    {
      idRele,
      estado,
    },
    emitir
  );
}

/**
 * Solicitar lectura de sensor
 */
export function solicitarLecturaSensor(
  idDispositivo: string,
  idSensor: string,
  emitir: (evento: string, datos: any) => void
): string {
  return enviarComandoDispositivo(
    idDispositivo,
    'leer_sensor',
    {
      idSensor,
    },
    emitir
  );
}
