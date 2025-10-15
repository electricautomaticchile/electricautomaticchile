/**
 * useControlArduinoWebSocket - Hook que integra WebSocket con el control de Arduino
 * 
 * Este hook extiende useControlArduino para escuchar eventos WebSocket en tiempo real:
 * - hardware:resultado_comando - Feedback de comandos ejecutados
 * - hardware:actualizacion_sensor - Actualizaciones de sensores
 * - hardware:actualizacion_rele - Cambios de estado de relés
 * - dispositivo:actualizacion_conexion - Estado de conexión de dispositivos
 */

import { useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { useToast } from '@/components/ui/use-toast';
import { useControlArduino } from './useControlArduino';
import type { UseControlArduinoConfig } from './types';

/**
 * Tipos de eventos WebSocket para hardware
 */
interface ResultadoComandoHardware {
  idComando: string;
  idDispositivo: string;
  exitoso: boolean;
  resultado: {
    led_status?: string;
    mensaje?: string;
  };
  error?: string;
  tiempoEjecucion: number;
}

interface ActualizacionSensor {
  idDispositivo: string;
  tipo: 'temperatura' | 'humedad' | 'presion' | 'luz';
  valor: number;
  unidad: string;
  marcaTiempo: string;
}

interface ActualizacionRele {
  idDispositivo: string;
  numeroRele: number;
  estado: 'ON' | 'OFF';
  marcaTiempo: string;
}

interface ActualizacionConexionDispositivo {
  idDispositivo: string;
  estado: 'conectado' | 'desconectado' | 'reconectando';
  ultimaVez: Date;
  metadatos?: Record<string, any>;
  marcaTiempo: string;
}

/**
 * Hook useControlArduinoWebSocket
 * 
 * Combina la funcionalidad del hook original con eventos WebSocket en tiempo real
 */
export function useControlArduinoWebSocket(config: UseControlArduinoConfig = {}) {
  // Hook original de control Arduino
  const arduinoControl = useControlArduino(config);
  
  // Hook de WebSocket
  const { estaConectado, escuchar, dejarDeEscuchar } = useWebSocket();
  
  const { toast } = useToast();
  
  /**
   * Manejar resultado de comando hardware
   */
  const manejarResultadoComando = useCallback((data: ResultadoComandoHardware) => {
    console.log('[Arduino WebSocket] Resultado de comando recibido:', data);
    
    if (data.exitoso) {
      toast({
        title: 'Comando ejecutado',
        description: data.resultado.mensaje || `Comando ${data.idComando} completado exitosamente`,
      });
      
      // Actualizar estado si el resultado incluye información del LED
      if (data.resultado.led_status) {
        // Forzar actualización del estado
        arduinoControl.refresh();
      }
    } else {
      toast({
        title: 'Error en comando',
        description: data.error || 'El comando no pudo ejecutarse',
        variant: 'destructive',
      });
    }
  }, [toast, arduinoControl]);
  
  /**
   * Manejar actualización de sensor
   */
  const manejarActualizacionSensor = useCallback((data: ActualizacionSensor) => {
    console.log('[Arduino WebSocket] Actualización de sensor:', data);
    
    // Aquí podrías actualizar un estado local de sensores si lo necesitas
    // Por ahora solo logueamos
  }, []);
  
  /**
   * Manejar actualización de relé
   */
  const manejarActualizacionRele = useCallback((data: ActualizacionRele) => {
    console.log('[Arduino WebSocket] Actualización de relé:', data);
    
    // Actualizar estado del Arduino cuando cambia un relé
    arduinoControl.refresh();
  }, [arduinoControl]);
  
  /**
   * Manejar actualización de conexión de dispositivo
   */
  const manejarActualizacionConexion = useCallback((data: ActualizacionConexionDispositivo) => {
    console.log('[Arduino WebSocket] Actualización de conexión:', data);
    
    if (data.estado === 'desconectado') {
      toast({
        title: 'Dispositivo desconectado',
        description: `El dispositivo ${data.idDispositivo} se ha desconectado`,
        variant: 'destructive',
      });
    } else if (data.estado === 'conectado') {
      toast({
        title: 'Dispositivo conectado',
        description: `El dispositivo ${data.idDispositivo} está ahora conectado`,
      });
    }
    
    // Actualizar estado
    arduinoControl.refresh();
  }, [toast, arduinoControl]);
  
  /**
   * Suscribirse a eventos WebSocket cuando el componente se monta
   */
  useEffect(() => {
    if (!estaConectado) {
      console.log('[Arduino WebSocket] No conectado, esperando conexión...');
      return;
    }
    
    console.log('[Arduino WebSocket] Suscribiendo a eventos de hardware...');
    
    // Suscribirse a eventos
    escuchar<ResultadoComandoHardware>('hardware:resultado_comando', manejarResultadoComando);
    escuchar<ActualizacionSensor>('hardware:actualizacion_sensor', manejarActualizacionSensor);
    escuchar<ActualizacionRele>('hardware:actualizacion_rele', manejarActualizacionRele);
    escuchar<ActualizacionConexionDispositivo>('dispositivo:actualizacion_conexion', manejarActualizacionConexion);
    
    // Cleanup: desuscribirse cuando el componente se desmonta
    return () => {
      console.log('[Arduino WebSocket] Desuscribiendo de eventos de hardware...');
      dejarDeEscuchar('hardware:resultado_comando');
      dejarDeEscuchar('hardware:actualizacion_sensor');
      dejarDeEscuchar('hardware:actualizacion_rele');
      dejarDeEscuchar('dispositivo:actualizacion_conexion');
    };
  }, [
    estaConectado,
    escuchar,
    dejarDeEscuchar,
    manejarResultadoComando,
    manejarActualizacionSensor,
    manejarActualizacionRele,
    manejarActualizacionConexion,
  ]);
  
  /**
   * Retornar el control de Arduino con información adicional de WebSocket
   */
  return {
    ...arduinoControl,
    webSocketConectado: estaConectado,
  };
}
