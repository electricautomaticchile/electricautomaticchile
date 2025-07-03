import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export interface ArduinoStatus {
  connected: boolean;
  port: string;
  led_status: string;
  recent_messages: string[];
  last_update: Date;
}

export interface ArduinoStats {
  total_commands: number;
  on_commands: number;
  total_duration: number;
  avg_duration: number;
  efficiency_percentage: number;
  uptime: number;
}

export interface ArduinoDevice {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  puerto: string;
  ultima_actividad: Date;
  configuracion: {
    baudRate: number;
    pins: { [key: string]: number };
  };
}

class ArduinoService extends BaseApiService {
  private basePath = "/arduino";

  // Obtener estado del Arduino
  async obtenerEstado(empresaId: string = "1"): Promise<
    ApiResponse<{
      data: ArduinoStatus;
    }>
  > {
    return this.makeRequest(`${this.basePath}/status?empresaId=${empresaId}`);
  }

  // Conectar Arduino
  async conectar(
    empresaId: string = "1",
    port?: string
  ): Promise<
    ApiResponse<{
      data: ArduinoStatus;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/connect`, {
      method: "POST",
      body: JSON.stringify({ empresaId, port }),
    });
  }

  // Desconectar Arduino
  async desconectar(empresaId: string = "1"): Promise<
    ApiResponse<{
      data: ArduinoStatus;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/disconnect`, {
      method: "POST",
      body: JSON.stringify({ empresaId }),
    });
  }

  // Enviar comando al Arduino
  async enviarComando(
    action: "on" | "off" | "toggle",
    empresaId: string = "1"
  ): Promise<
    ApiResponse<{
      data: {
        status: ArduinoStatus;
        command_result: any;
      };
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/control/${action}`, {
      method: "POST",
      body: JSON.stringify({ empresaId }),
    });
  }

  // Obtener estadísticas
  async obtenerEstadisticas(empresaId: string): Promise<
    ApiResponse<{
      data: ArduinoStats;
    }>
  > {
    return this.makeRequest(`${this.basePath}/stats/${empresaId}`);
  }

  // Exportar datos
  async exportarDatos(
    empresaId: string,
    format: "json" | "csv" = "json",
    days: number = 7
  ): Promise<ApiResponse<any>> {
    const url = `${this.basePath}/export/${empresaId}?format=${format}&days=${days}`;

    // Para exportación, devolvemos la URL para descargar directamente
    return {
      success: true,
      data: {
        downloadUrl: url,
        format,
        days,
      },
    };
  }

  // Obtener dispositivos de la empresa
  async obtenerDispositivosEmpresa(empresaId: string): Promise<
    ApiResponse<{
      data: ArduinoDevice[];
      total: number;
    }>
  > {
    return this.makeRequest(`${this.basePath}/devices/${empresaId}`);
  }

  // Registrar nuevo dispositivo
  async registrarDispositivo(
    empresaId: string,
    dispositivo: {
      nombre: string;
      tipo: string;
      puerto: string;
      configuracion: any;
    }
  ): Promise<
    ApiResponse<{
      data: ArduinoDevice;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/devices/${empresaId}/register`, {
      method: "POST",
      body: JSON.stringify(dispositivo),
    });
  }

  // Configurar dispositivo
  async configurarDispositivo(
    deviceId: string,
    configuracion: any
  ): Promise<
    ApiResponse<{
      data: {
        device_id: string;
        configuracion: any;
        fecha_configuracion: Date;
      };
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/devices/${deviceId}/configure`, {
      method: "PUT",
      body: JSON.stringify(configuracion),
    });
  }
}

export const arduinoService = new ArduinoService();
export default arduinoService;
