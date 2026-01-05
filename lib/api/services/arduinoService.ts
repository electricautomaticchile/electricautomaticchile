import { baseService } from '../utils/baseService';

export interface ArduinoDeviceInfo {
  ID: string;
  ClienteID: string;
  EmpresaID: string;
  LastReading?: {
    DeviceID: string;
    ClienteID: string;
    Voltage: number;
    Current: number;
    Power: number;
    Energy: number;
    Cost: number;
    LED1: boolean;
    LED2: boolean;
    Uptime: number;
    Timestamp: number;
  };
}

export interface ArduinoStatus {
  connected: boolean;
  devicesCount: number;
  devices: ArduinoDeviceInfo[];
}

class ArduinoService {
  async obtenerEstado(): Promise<ArduinoStatus> {
    const response = await baseService.get<ArduinoStatus>('/arduino/status');
    return response.data!;
  }

  async listarPuertos(): Promise<string[]> {
    const response = await baseService.get<{ ports: string[] }>('/arduino/ports');
    return response.data!.ports;
  }

  async conectar(port?: string): Promise<void> {
    await baseService.post('/arduino/connect', { port });
  }

  async desconectar(): Promise<void> {
    await baseService.post('/arduino/disconnect', {});
  }

  async enviarComando(command: string): Promise<void> {
    await baseService.post('/arduino/command', { command });
  }
}

export const arduinoService = new ArduinoService();
export default arduinoService;
