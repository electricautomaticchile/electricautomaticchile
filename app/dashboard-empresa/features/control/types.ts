// Interfaces para el componente de control Arduino

export interface ControlArduinoProps {
  reducida?: boolean;
}

// Estado del Arduino
export interface ArduinoStatus {
  connected: boolean;
  port: string;
  led_status: string;
  recent_messages: string[];
}

// Datos estadísticos
export interface StatsData {
  total_commands: number;
  on_commands: number;
  total_duration: number;
  avg_duration: number;
  efficiency_percentage: number;
}

// Props para subcomponentes
export interface ControlArduinoEstadoProps {
  status: ArduinoStatus;
  loading?: boolean;
}

export interface ControlArduinoAccionesProps {
  status: ArduinoStatus;
  autoRefresh: boolean;
  loading: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onControlLed: (action: string) => Promise<void>;
  onToggleAutoRefresh: () => void;
}

export interface ControlArduinoStatsProps {
  stats: StatsData;
  status: ArduinoStatus;
  loading?: boolean;
  onExportData: (format: string, days: number) => void;
}

export interface ControlArduinoReducidoProps {
  status: ArduinoStatus;
  stats: StatsData;
  loading: boolean;
  onControlLed: (action: string) => Promise<void>;
}

export interface ControlArduinoIconosProps {
  StatusIcon: React.ComponentType<{ connected: boolean; size?: string }>;
  LedIcon: React.ComponentType<{ status: string; size?: string }>;
  ActionIcon: React.ComponentType<{ action: string; size?: string }>;
}

// Respuesta de la API Flask
export interface FlaskResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Configuración de conexión
export interface ConnectionConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// Estado de carga
export interface LoadingStates {
  connection: boolean;
  control: boolean;
  stats: boolean;
  export: boolean;
}

// Configuración de auto-refresh
export interface AutoRefreshConfig {
  enabled: boolean;
  interval: number;
  maxRetries: number;
}

// Tipos de comandos LED
export type LedCommand = "on" | "off" | "toggle";
export type LedStatus = "ENCENDIDO" | "APAGADO" | "DESCONOCIDO";

// Formato de exportación
export type ExportFormat = "json" | "csv";

// Datos históricos
export interface HistoryData {
  timestamp: string;
  command: string;
  status: string;
  duration?: number;
}

// Métricas de rendimiento
export interface PerformanceMetrics {
  responseTime: number;
  successRate: number;
  uptime: number;
  lastSeen: string;
}

// Configuración de notificaciones
export interface NotificationConfig {
  enabled: boolean;
  types: {
    connection: boolean;
    commands: boolean;
    errors: boolean;
  };
}

// Estado del sistema completo
export interface SystemState {
  arduino: ArduinoStatus;
  stats: StatsData;
  performance: PerformanceMetrics;
  loading: LoadingStates;
  autoRefresh: AutoRefreshConfig;
}

// Props para el hook personalizado
export interface UseControlArduinoConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  baseUrl?: string;
}

// Eventos del sistema
export interface ArduinoEvent {
  type: 'connection' | 'command' | 'status' | 'error';
  timestamp: Date;
  data: any;
  source: 'web' | 'physical' | 'system';
}
