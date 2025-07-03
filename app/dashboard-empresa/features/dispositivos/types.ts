// Interfaces para el componente de dispositivos activos
export interface Dispositivo {
  id: string;
  nombre: string;
  ubicacion: string;
  estado: "activo" | "inactivo" | "mantenimiento" | "alerta";
  bateria: number;
  ultimaTransmision: string;
  tipoConexion: "Wifi" | "4G" | "Ethernet" | "Bluetooth";
  consumoActual: number;
  firmware: string;
  temperaturaOperacion?: number;
  senal?: number;
  ubicacionDetallada?: {
    edificio: string;
    piso: number;
    sala: string;
  };
}

export interface ResumenDispositivos {
  total: number;
  activos: number;
  inactivos: number;
  mantenimiento: number;
  alerta: number;
  bateriaPromedio: number;
  senalPromedio: number;
  consumoTotal: number;
}

export interface DispositivosActivosProps {
  reducida?: boolean;
}

export interface FiltrosDispositivos {
  busqueda: string;
  tabActiva: string;
  ordenPor?: "nombre" | "bateria" | "ultimaTransmision" | "consumo";
  ordenDireccion?: "asc" | "desc";
}

export interface ControlDispositivoPayload {
  deviceId: string;
  action: string;
}

// Props para componentes hijos
export interface DispositivoCardProps {
  dispositivo: Dispositivo;
  onControl: (id: string, accion: string) => void;
  loading?: boolean;
}

export interface DispositivosStatsProps {
  resumen: ResumenDispositivos;
  loading?: boolean;
}

export interface DispositivosTablaProps {
  dispositivos: Dispositivo[];
  loading?: boolean;
  onControl: (id: string, accion: string) => void;
  onSort?: (campo: string) => void;
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  };
}

export interface DispositivosAccionesProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  tabActiva: string;
  onTabChange: (tab: string) => void;
  loading?: boolean;
  onRefresh: () => void;
  totalDispositivos: number;
  isWebSocketConnected?: boolean;
}

export interface DispositivosReducidoProps {
  dispositivos: Dispositivo[];
  resumen: ResumenDispositivos;
  loading?: boolean;
}

// Estados de WebSocket
export interface WebSocketDeviceData {
  dispositivoId: string;
  data?: {
    consumo?: number;
    bateria?: number;
    temperatura?: number;
    senal?: number;
  };
}

// Configuración de actualización automática
export interface AutoUpdateConfig {
  interval: number; // en milisegundos
  enabled: boolean;
}

// Estados de conexión de dispositivos
export type EstadoConexion = "conectado" | "desconectado" | "intermitente";

// Tipos para acciones de control
export type AccionControl =
  | "restart"
  | "shutdown"
  | "reset"
  | "update_firmware"
  | "sync_time"
  | "calibrate";

// Configuración de alertas
export interface ConfiguracionAlertas {
  bateriaBaja: number; // porcentaje
  senalDebil: number; // porcentaje
  temperaturaAlta: number; // grados celsius
  tiempoSinTransmision: number; // minutos
}
