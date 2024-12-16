export interface EstadoLED {
    estado: boolean;
    timestamp: string;
    modo: 'manual' | 'temporizador' | 'secuencia';
  }
  
  export interface HistorialCambio {
    estado: boolean;
    timestamp: string;
    modo: string;
  }