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
import { useToast } from '@/components/ui/use-toast';
import { useControlArduino } from './useControlArduino';
import type { UseControlArduinoConfig } from './types';

export function useControlArduinoWebSocket(config: UseControlArduinoConfig = {}) {
  const arduinoControl = useControlArduino(config);
  const { toast } = useToast();
  
  useEffect(() => {
    const interval = setInterval(() => {
      arduinoControl.refresh();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [arduinoControl]);
  
  return {
    ...arduinoControl,
    webSocketConectado: false,
  };
}
