import { Dispositivo, ConfiguracionAlertas, AutoUpdateConfig } from "./types";

// Configuración de alertas por defecto
export const CONFIGURACION_ALERTAS: ConfiguracionAlertas = {
  bateriaBaja: 20,
  senalDebil: 50,
  temperaturaAlta: 35,
  tiempoSinTransmision: 30, // 30 minutos
};

// Configuración de actualización automática
export const AUTO_UPDATE_CONFIG: AutoUpdateConfig = {
  interval: 30000, // 30 segundos
  enabled: true,
};

// Tabs disponibles para filtrado
export const TABS_DISPOSITIVOS = [
  { value: "todos", label: "Todos", icon: "list" },
  { value: "activo", label: "Activos", icon: "check-circle" },
  { value: "inactivo", label: "Inactivos", icon: "x-circle" },
  { value: "mantenimiento", label: "Mantenimiento", icon: "rotate-cw" },
  { value: "alerta", label: "Alertas", icon: "alert-triangle" },
];

// Acciones disponibles para dispositivos
export const ACCIONES_DISPOSITIVO = [
  { value: "restart", label: "Reiniciar", icon: "rotate-cw", color: "blue" },
  { value: "shutdown", label: "Apagar", icon: "power", color: "red" },
  {
    value: "reset",
    label: "Reset de Fábrica",
    icon: "refresh-ccw",
    color: "amber",
  },
  {
    value: "update_firmware",
    label: "Actualizar Firmware",
    icon: "download",
    color: "green",
  },
  {
    value: "sync_time",
    label: "Sincronizar Hora",
    icon: "clock",
    color: "purple",
  },
  { value: "calibrate", label: "Calibrar", icon: "settings", color: "indigo" },
];

// Tipos de conexión con sus configuraciones
export const TIPOS_CONEXION = {
  Wifi: {
    icon: "wifi",
    color: "green",
    label: "Wi-Fi",
    description: "Conexión inalámbrica",
  },
  "4G": {
    icon: "4g",
    color: "purple",
    label: "4G",
    description: "Red móvil 4G",
  },
  Ethernet: {
    icon: "zap",
    color: "blue",
    label: "Ethernet",
    description: "Conexión por cable",
  },
  Bluetooth: {
    icon: "bluetooth",
    color: "indigo",
    label: "Bluetooth",
    description: "Conexión Bluetooth",
  },
};

// Estados de dispositivos con configuraciones
export const ESTADOS_DISPOSITIVO = {
  activo: {
    icon: "check-circle-2",
    color: "green",
    label: "Activo",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600",
    borderColor: "border-green-200 dark:border-green-800",
  },
  inactivo: {
    icon: "x-circle",
    color: "gray",
    label: "Inactivo",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-500",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  mantenimiento: {
    icon: "rotate-cw",
    color: "blue",
    label: "Mantenimiento",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  alerta: {
    icon: "alert-triangle",
    color: "amber",
    label: "Alerta",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
};

// Función para generar dispositivos simulados (solo como fallback)
export const generarDispositivosSimulados = (): Dispositivo[] => {
  // Retornar array vacío - ya no usamos datos simulados
  // Los dispositivos reales vienen de la API
  return [];
};

// Colores para niveles de batería
export const COLORES_BATERIA = {
  excelente: "text-green-600", // >= 80%
  bueno: "text-blue-600", // >= 50%
  bajo: "text-amber-600", // >= 20%
  critico: "text-red-600", // < 20%
};

// Colores para calidad de señal
export const COLORES_SENAL = {
  excelente: "text-green-600", // >= 80%
  buena: "text-blue-600", // >= 60%
  regular: "text-amber-600", // >= 40%
  mala: "text-red-600", // < 40%
};

// Configuración de ordenamiento
export const OPCIONES_ORDENAMIENTO = [
  { value: "nombre", label: "Nombre" },
  { value: "bateria", label: "Nivel de Batería" },
  { value: "ultimaTransmision", label: "Última Transmisión" },
  { value: "consumo", label: "Consumo Actual" },
  { value: "estado", label: "Estado" },
];

// Configuración de mensajes
export const MENSAJES = {
  cargando: "Cargando dispositivos...",
  sinDispositivos: "No hay dispositivos disponibles",
  sinResultados: "No se encontraron dispositivos con los filtros aplicados",
  errorCarga: "Error al cargar los dispositivos",
  comandoEnviado: "Comando enviado exitosamente",
  errorComando: "Error al enviar comando al dispositivo",
  conexionWebSocket: "Conectado en tiempo real",
  desconexionWebSocket: "Modo offline",
};

// Configuración de refreshing
export const REFRESH_CONFIG = {
  autoRefreshInterval: 30000, // 30 segundos
  manualRefreshCooldown: 2000, // 2 segundos entre refreshes manuales
  maxRetries: 3,
};
