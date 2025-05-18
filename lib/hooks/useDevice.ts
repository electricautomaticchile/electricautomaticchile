"use client"

import { useState, useCallback, useEffect } from 'react';
import { HistorialCambio } from '@/lib/constants';

interface UseDeviceProps {
  apiUrl?: string;
  initialState?: boolean;
}

export function useDevice({ apiUrl = 'http://localhost:5000/api', initialState = false }: UseDeviceProps = {}) {
  const [deviceState, setDeviceState] = useState<boolean>(initialState);
  const [connectionState, setConnectionState] = useState<boolean>(false);
  const [history, setHistory] = useState<HistorialCambio[]>([]);
  const [mode, setMode] = useState<'manual' | 'temporizador' | 'secuencia'>('manual');
  const [timerDuration, setTimerDuration] = useState<number>(5);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Toggle device state
  const toggleDevice = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/led/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modo: mode }),
      });
      
      if (!response.ok) {
        throw new Error('Error al cambiar el estado del dispositivo');
      }
      
      const data = await response.json();
      setDeviceState(data.estado);
      
      // Update history
      const newChange = {
        estado: data.estado,
        timestamp: new Date().toISOString(),
        modo: mode
      };
      
      setHistory(prev => [...prev, newChange]);

      // Send data to database
      await fetch(`${apiUrl}/historial`, {
        method: 'POST', // Changed from GET to POST for correct semantics
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChange),
      });
      
      return data.estado;
    } catch (error) {
      console.error('Error:', error);
      return deviceState; // Return current state on error
    }
  }, [apiUrl, deviceState, mode]);

  // Check connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${apiUrl}/estado`);
        setConnectionState(response.ok);
      } catch {
        setConnectionState(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && mode === 'temporizador') {
      interval = setInterval(() => {
        toggleDevice();
      }, timerDuration * 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timerDuration, mode, toggleDevice]);

  return {
    deviceState,
    connectionState,
    history,
    mode,
    timerDuration,
    timerActive,
    toggleDevice,
    setMode,
    setTimerDuration,
    setTimerActive,
    // Derived data for charts
    chartData: [{
      id: 'estado-dispositivo',
      color: 'rgb(234, 88, 12)',
      data: history.slice(-10).map(h => ({
        x: new Date(h.timestamp).toLocaleTimeString(),
        y: h.estado ? 1 : 0
      }))
    }]
  };
} 