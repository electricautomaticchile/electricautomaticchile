import { 
  ConnectionConfig, 
  AutoRefreshConfig, 
  ArduinoStatus, 
  StatsData,
  PerformanceMetrics,
  LoadingStates 
} from './types';

// Configuración de la conexión Flask
export const FLASK_CONFIG: ConnectionConfig = {
  baseUrl: "http://localhost:5000",
  timeout: 5000, // 5 segundos
  retryAttempts: 3
};

// Endpoints de la API Flask
export const FLASK_ENDPOINTS = {
  status: "/status",
  connect: "/connect", 
  disconnect: "/disconnect",
  control: (action: string) => `/control/${action}`,
  stats: "/stats",
  export: (format: string, days: number) => `/export?format=${format}&days=${days}`
};

// Configuración de auto-refresh por defecto
export const DEFAULT_AUTO_REFRESH: AutoRefreshConfig = {
  enabled: true,
  interval: 5000, // 5 segundos
  maxRetries: 3
};

// Estados por defecto
export const DEFAULT_ARDUINO_STATUS: ArduinoStatus = {
  connected: false,
  port: "",
  led_status: "DESCONOCIDO",
  recent_messages: []
};

export const DEFAULT_STATS_DATA: StatsData = {
  total_commands: 0,
  on_commands: 0,
  total_duration: 0,
  avg_duration: 0,
  efficiency_percentage: 0
};

export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  responseTime: 0,
  successRate: 100,
  uptime: 0,
  lastSeen: "Nunca"
};

export const DEFAULT_LOADING_STATES: LoadingStates = {
  connection: false,
  control: false,
  stats: false,
  export: false
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  connection: {
    success: "Arduino conectado exitosamente",
    error: "Error al conectar con Arduino",
    disconnected: "Arduino desconectado",
    timeout: "Tiempo de espera agotado",
    serverError: "Error al conectar con servidor Flask. ¿Está ejecutándose en puerto 5000?"
  },
  commands: {
    success: "Comando enviado exitosamente",
    error: "Error al enviar comando",
    notConnected: "Arduino no conectado",
    invalidCommand: "Comando inválido"
  },
  led: {
    turnedOn: "LED encendido",
    turnedOff: "LED apagado", 
    toggled: "Estado del LED cambiado",
    error: "Error al controlar LED"
  },
  export: {
    success: "Datos exportados exitosamente",
    error: "Error al exportar datos",
    generating: "Generando archivo de exportación..."
  }
};

// Configuración de colores para estados
export const STATUS_COLORS = {
  connected: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800", 
    text: "text-green-600",
    icon: "text-green-600"
  },
  disconnected: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-600", 
    icon: "text-red-600"
  },
  ledOn: {
    bg: "bg-yellow-400",
    border: "border-yellow-500",
    shadow: "shadow-lg shadow-yellow-400/50",
    text: "text-yellow-800"
  },
  ledOff: {
    bg: "bg-gray-300",
    border: "border-gray-400",
    text: "text-gray-600"
  },
  loading: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600"
  }
};

// Configuración de badges
export const BADGE_CONFIG = {
  ledOn: {
    variant: "default" as const,
    className: "bg-green-600 text-white"
  },
  ledOff: {
    variant: "secondary" as const,
    className: "bg-gray-500 text-white"
  },
  connected: {
    variant: "outline" as const,
    className: "bg-green-50 text-green-700 border-green-200"
  },
  disconnected: {
    variant: "outline" as const,
    className: "bg-red-50 text-red-700 border-red-200"
  },
  physicalButton: {
    variant: "outline" as const,
    className: "text-xs bg-blue-50 text-blue-700 animate-pulse border-blue-300"
  }
};

// Configuración de los botones de control
export const CONTROL_BUTTONS = [
  {
    action: "on",
    label: "Encender",
    variant: "default" as const,
    className: "h-12",
    icon: "Power"
  },
  {
    action: "off", 
    label: "Apagar",
    variant: "outline" as const,
    className: "h-12",
    icon: "Power"
  },
  {
    action: "toggle",
    label: "Toggle",
    variant: "secondary" as const,
    className: "w-full h-12",
    icon: "Toggle"
  }
];

// Configuración de estadísticas
export const STATS_CONFIG = [
  {
    key: "total_commands",
    label: "Total Comandos",
    icon: "BarChart3",
    color: "text-blue-600"
  },
  {
    key: "on_commands", 
    label: "Encendidos",
    icon: "Power",
    color: "text-green-600"
  },
  {
    key: "avg_duration",
    label: "Tiempo Promedio",
    icon: "Clock", 
    color: "text-orange-600",
    suffix: "s",
    formatter: (value: number) => Math.round(value)
  },
  {
    key: "efficiency_percentage",
    label: "Eficiencia",
    icon: "TrendingUp",
    color: "text-purple-600",
    suffix: "%",
    formatter: (value: number) => value.toFixed(1)
  }
];

// Configuración de exportación
export const EXPORT_OPTIONS = [
  {
    format: "json",
    days: 7,
    label: "JSON (7 días)"
  },
  {
    format: "csv",
    days: 7, 
    label: "CSV (7 días)"
  },
  {
    format: "csv",
    days: 30,
    label: "CSV (30 días)"
  }
];

// Configuración de layouts responsive
export const LAYOUTS = {
  reducido: {
    showFullStats: false,
    maxMessages: 0,
    buttonSize: "sm" as const
  },
  completo: {
    showFullStats: true,
    maxMessages: 5,
    buttonSize: "default" as const
  }
};

// Configuración de timeouts y retries
export const TIMEOUTS = {
  connection: 10000,     // 10 segundos
  command: 5000,         // 5 segundos
  stats: 3000,           // 3 segundos
  export: 30000          // 30 segundos
};

// Configuración de animaciones
export const ANIMATIONS = {
  ledPulse: "animate-pulse",
  spin: "animate-spin",
  fadeIn: "transition-opacity duration-300",
  slideIn: "transition-transform duration-200"
};

// Validadores
export const VALIDATORS = {
  isValidLedStatus: (status: string): boolean => 
    ["ENCENDIDO", "APAGADO", "DESCONOCIDO"].includes(status),
  
  isValidCommand: (command: string): boolean =>
    ["on", "off", "toggle"].includes(command),
    
  isConnected: (status: ArduinoStatus): boolean =>
    status.connected && status.port !== "",
    
  hasRecentActivity: (status: ArduinoStatus): boolean =>
    status.recent_messages.length > 0,
    
  isPhysicalButton: (message: string): boolean =>
    message.includes("BOTON FISICO")
};

// Utilidades de formateo
export const FORMATTERS = {
  duration: (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  },
  
  percentage: (value: number): string => 
    `${Math.max(0, Math.min(100, value)).toFixed(1)}%`,
    
  uptime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  },
  
  timestamp: (date: Date): string =>
    date.toLocaleString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
};

// Configuración de debug
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error',
  enableConsoleLog: true,
  enableToastNotifications: true
};
