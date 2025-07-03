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

// Función para generar dispositivos simulados
export const generarDispositivosSimulados = (): Dispositivo[] => {
  const dispositivos: Dispositivo[] = [
    {
      id: "DEV001",
      nombre: "Medidor Inteligente AC-750",
      ubicacion: "Edificio Central - Piso 1",
      estado: "activo",
      bateria: Math.floor(Math.random() * 15) + 85,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 3600000
      ).toLocaleString("es-CL"),
      tipoConexion: "Wifi",
      consumoActual: Math.floor(Math.random() * 20) + 20,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 10) + 20,
      senal: Math.floor(Math.random() * 20) + 80,
      ubicacionDetallada: {
        edificio: "Central",
        piso: 1,
        sala: "Sala Eléctrica A",
      },
    },
    {
      id: "DEV002",
      nombre: "Medidor Inteligente AC-750",
      ubicacion: "Edificio Central - Piso 2",
      estado: "activo",
      bateria: Math.floor(Math.random() * 15) + 75,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 1800000
      ).toLocaleString("es-CL"),
      tipoConexion: "4G",
      consumoActual: Math.floor(Math.random() * 15) + 15,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 8) + 22,
      senal: Math.floor(Math.random() * 15) + 85,
      ubicacionDetallada: {
        edificio: "Central",
        piso: 2,
        sala: "Cuarto Técnico B",
      },
    },
    {
      id: "DEV003",
      nombre: "Medidor Inteligente AC-500",
      ubicacion: "Edificio Norte - Piso 1",
      estado: Math.random() > 0.7 ? "inactivo" : "activo",
      bateria: Math.floor(Math.random() * 30) + 10,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 7200000
      ).toLocaleString("es-CL"),
      tipoConexion: "Wifi",
      consumoActual: Math.floor(Math.random() * 10),
      firmware: "v3.1.7",
      temperaturaOperacion: Math.floor(Math.random() * 5) + 25,
      senal: Math.floor(Math.random() * 30) + 50,
      ubicacionDetallada: {
        edificio: "Norte",
        piso: 1,
        sala: "Panel Principal",
      },
    },
    {
      id: "DEV004",
      nombre: "Medidor Inteligente AC-750",
      ubicacion: "Edificio Este - Piso 1",
      estado: Math.random() > 0.8 ? "mantenimiento" : "activo",
      bateria: Math.floor(Math.random() * 20) + 60,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 2400000
      ).toLocaleString("es-CL"),
      tipoConexion: "Ethernet",
      consumoActual: Math.floor(Math.random() * 8) + 5,
      firmware: "v3.2.0",
      temperaturaOperacion: Math.floor(Math.random() * 6) + 19,
      senal: 100, // Ethernet siempre 100%
      ubicacionDetallada: {
        edificio: "Este",
        piso: 1,
        sala: "Sala Servidores",
      },
    },
    {
      id: "DEV005",
      nombre: "Medidor Inteligente AC-900",
      ubicacion: "Edificio Central - Piso 3",
      estado: "activo",
      bateria: Math.floor(Math.random() * 15) + 70,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 900000
      ).toLocaleString("es-CL"),
      tipoConexion: "Ethernet",
      consumoActual: Math.floor(Math.random() * 25) + 25,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 7) + 21,
      senal: 100,
      ubicacionDetallada: {
        edificio: "Central",
        piso: 3,
        sala: "Centro de Control",
      },
    },
    {
      id: "DEV006",
      nombre: "Medidor Inteligente AC-750",
      ubicacion: "Edificio Oeste - Piso 2",
      estado: Math.random() > 0.6 ? "alerta" : "activo",
      bateria: Math.floor(Math.random() * 25) + 35,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 5400000
      ).toLocaleString("es-CL"),
      tipoConexion: "Wifi",
      consumoActual: Math.floor(Math.random() * 20) + 20,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 12) + 28,
      senal: Math.floor(Math.random() * 25) + 60,
      ubicacionDetallada: {
        edificio: "Oeste",
        piso: 2,
        sala: "Subestación C",
      },
    },
    {
      id: "DEV007",
      nombre: "Medidor Inteligente AC-500",
      ubicacion: "Edificio Sur - Piso 1",
      estado: "activo",
      bateria: Math.floor(Math.random() * 20) + 80,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 1200000
      ).toLocaleString("es-CL"),
      tipoConexion: "Bluetooth",
      consumoActual: Math.floor(Math.random() * 12) + 8,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 8) + 23,
      senal: Math.floor(Math.random() * 20) + 70,
      ubicacionDetallada: {
        edificio: "Sur",
        piso: 1,
        sala: "Almacén Técnico",
      },
    },
    {
      id: "DEV008",
      nombre: "Medidor Inteligente AC-900",
      ubicacion: "Edificio Central - Sótano",
      estado: Math.random() > 0.9 ? "mantenimiento" : "activo",
      bateria: Math.floor(Math.random() * 25) + 75,
      ultimaTransmision: new Date(
        Date.now() - Math.random() * 600000
      ).toLocaleString("es-CL"),
      tipoConexion: "Ethernet",
      consumoActual: Math.floor(Math.random() * 30) + 30,
      firmware: "v3.2.1",
      temperaturaOperacion: Math.floor(Math.random() * 5) + 18,
      senal: 100,
      ubicacionDetallada: {
        edificio: "Central",
        piso: -1,
        sala: "Subestación Principal",
      },
    },
  ];

  return dispositivos;
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
