import { 
  ColoresAlerta, 
  ConfiguracionFiltros, 
  MensajesAlerta,
  ConfiguracionSimulacion,
  ResumenAlertas,
  TipoAlerta
} from './types';

// Colores y estilos para cada tipo de alerta
export const COLORES_ALERTA: ColoresAlerta = {
  error: {
    icon: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/10",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-300",
    badge: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
  },
  advertencia: {
    icon: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
    badge: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
  },
  informacion: {
    icon: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-300",
    badge: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
  },
  exito: {
    icon: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-300",
    badge: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
  }
};

// Configuración de filtros disponibles
export const CONFIGURACION_FILTROS: ConfiguracionFiltros = {
  tipos: [
    { value: "todos", label: "Todos", variant: "default" },
    { value: "error", label: "Críticas", variant: "destructive" },
    { 
      value: "advertencia", 
      label: "Advertencias", 
      variant: "default",
      className: "bg-amber-600 hover:bg-amber-700"
    },
    { 
      value: "informacion", 
      label: "Información", 
      variant: "default",
      className: "bg-blue-600 hover:bg-blue-700"
    }
  ],
  estados: [
    { value: "todos", label: "Todas" },
    { value: "no_leidas", label: "No leídas", showCount: true },
    { value: "leidas", label: "Leídas" }
  ]
};

// Mensajes del sistema
export const MENSAJES_ALERTA: MensajesAlerta = {
  simulacionExitosa: "Nueva alerta generada correctamente",
  asignacionExitosa: "La alerta ha sido asignada al técnico disponible",
  resolucionExitosa: "La alerta ha sido marcada como resuelta",
  eliminacionExitosa: "La alerta ha sido eliminada correctamente",
  errorGeneral: "Ha ocurrido un error. Inténtalo nuevamente",
  sinAlertas: "No hay alertas activas en este momento",
  sinResultados: "No se encontraron alertas que coincidan con la búsqueda"
};

// Configuración para la simulación de alertas
export const CONFIGURACION_SIMULACION: ConfiguracionSimulacion = {
  tipos: ["error", "advertencia", "informacion", "exito"],
  mensajes: [
    "Dispositivo desconectado inesperadamente",
    "Nivel de batería crítico detectado",
    "Actualización de firmware completada",
    "Sistema de respaldo activado",
    "Consumo anómalo en sector norte",
    "Conexión restablecida correctamente",
    "Temperatura del dispositivo elevada",
    "Mantenimiento programado pendiente",
    "Fallo en sensor de humedad",
    "Pérdida de señal WiFi detectada",
    "Reinicio automático completado",
    "Umbral de consumo superado",
    "Calibración de sensores necesaria",
    "Backup de datos completado exitosamente",
    "Detección de movimiento anómalo",
    "Sistema de emergencia activado"
  ],
  ubicaciones: [
    "Edificio Central - Piso 1",
    "Edificio Norte - Piso 2", 
    "Edificio Este - Planta Baja",
    "Edificio Oeste - Piso 3",
    "Sala de Servidores",
    "Centro de Control",
    "Laboratorio de Pruebas",
    "Área de Producción A",
    "Área de Producción B",
    "Oficinas Administrativas",
    "Estacionamiento Subterráneo",
    "Terraza - Equipos Clima"
  ],
  dispositivos: {
    prefijo: "DEV",
    rangoNumerico: [1, 999]
  }
};

// Resumen de alertas por defecto (para inicialización)
export const RESUMEN_ALERTAS_DEFAULT: ResumenAlertas = {
  total: 0,
  errorCritico: 0,
  advertencia: 0,
  informacion: 0,
  exito: 0,
  noLeidas: 0,
  importantes: 0,
  resueltas: 0
};

// Configuración de actualización automática
export const CONFIG_ACTUALIZACION = {
  habilitada: true,
  intervalo: 30000, // 30 segundos
  maxAlertas: 100,
  tiempoRetencion: 24 * 60 * 60 * 1000 // 24 horas en ms
};

// Configuración de notificaciones
export const CONFIG_NOTIFICACIONES = {
  tiempoAutoOcultar: 5000, // 5 segundos
  mostrarContadores: true,
  agruparPorTipo: true,
  sonidoHabilitado: false
};

// Textos descriptivos para cada tipo de alerta
export const DESCRIPCIONES_TIPO = {
  error: "Requieren atención inmediata",
  advertencia: "Requieren revisión próxima", 
  informacion: "Notificaciones del sistema",
  exito: "Operaciones completadas"
};

// Etiquetas para tipos de alerta
export const ETIQUETAS_TIPO = {
  error: "Crítico",
  advertencia: "Advertencia",
  informacion: "Información", 
  exito: "Éxito"
};

// Función para generar ID único de dispositivo
export const generarIdDispositivo = (): string => {
  const { prefijo, rangoNumerico } = CONFIGURACION_SIMULACION.dispositivos;
  const numero = Math.floor(Math.random() * (rangoNumerico[1] - rangoNumerico[0] + 1)) + rangoNumerico[0];
  return `${prefijo}${String(numero).padStart(3, "0")}`;
};

// Función para generar alerta aleatoria
export const generarAlertaAleatoria = () => {
  const { tipos, mensajes, ubicaciones } = CONFIGURACION_SIMULACION;
  
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
  const ubicacion = ubicaciones[Math.floor(Math.random() * ubicaciones.length)];
  const dispositivo = generarIdDispositivo();
  
  return {
    tipo,
    mensaje,
    ubicacion,
    dispositivo,
    importante: tipo === "error" || tipo === "advertencia"
  };
};

// Configuración de layouts responsive
export const LAYOUTS = {
  reducido: {
    maxAlertas: 3,
    mostrarStats: true,
    mostrarAcciones: false
  },
  completo: {
    maxAlertas: -1, // sin límite
    mostrarStats: true,
    mostrarAcciones: true,
    mostrarFiltros: true
  }
};

// Configuración de animaciones
export const ANIMACIONES = {
  duracionFadeIn: 300,
  duracionExpansion: 200,
  delayStagger: 50
};

// Umbrales para alertas críticas
export const UMBRALES_CRITICOS = {
  alertasCriticas: 5,
  alertasNoLeidas: 10,
  tiempoSinRespuesta: 60 // minutos
};

// Configuración de accesibilidad
export const CONFIG_ACCESIBILIDAD = {
  tiempoLecturaMinimo: 3000, // 3 segundos
  contrasteMinimoRatio: 4.5,
  teclaRapidaExpandir: "Enter",
  teclaRapidaMarcar: "Space"
};
