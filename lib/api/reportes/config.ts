// Configuraciones y constantes para el sistema de reportes

export const REPORTE_CONFIG = {
  // URLs base
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",

  // Timeouts
  timeout: {
    normal: 30000, // 30 segundos
    large: 120000, // 2 minutos para reportes grandes
    massive: 300000, // 5 minutos para reportes masivos
  },

  // Límites de tamaño
  limits: {
    maxRecords: 100000, // Máximo registros por reporte
    maxFileSizeMB: 50, // Máximo tamaño archivo
    maxConcurrentDownloads: 3, // Descargas simultáneas
    retryAttempts: 3, // Intentos de reintento
  },

  // Formatos soportados
  formats: {
    excel: {
      extension: "xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    csv: { extension: "csv", mimeType: "text/csv" },
  },
};

// Tipos de reportes disponibles
export const TIPOS_REPORTE = {
  clientes: {
    label: "Clientes",
    description: "Reporte de clientes registrados",
    icon: "Users",
    estimatedTimePerRecord: 0.1, // ms por registro
  },
  empresas: {
    label: "Empresas",
    description: "Reporte de empresas del sistema",
    icon: "Building2",
    estimatedTimePerRecord: 0.2,
  },
  cotizaciones: {
    label: "Cotizaciones",
    description: "Reporte de cotizaciones generadas",
    icon: "FileText",
    estimatedTimePerRecord: 0.15,
  },
  dispositivos: {
    label: "Dispositivos",
    description: "Reporte de dispositivos IoT",
    icon: "Cpu",
    estimatedTimePerRecord: 0.05,
  },
  estadisticas: {
    label: "Estadísticas",
    description: "Reporte de estadísticas de consumo",
    icon: "BarChart3",
    estimatedTimePerRecord: 0.3,
  },
  "consumo-sectorial": {
    label: "Consumo Sectorial",
    description: "Reporte de consumo por sector",
    icon: "Zap",
    estimatedTimePerRecord: 0.25,
  },
};

// Pasos del progress con mensajes
export const PROGRESS_STEPS = {
  init: {
    percentage: 0,
    message: "Iniciando generación de reporte...",
  },
  request: {
    percentage: 25,
    message: "Solicitando datos al servidor...",
  },
  connecting: {
    percentage: 30,
    message: "Conectando con el servidor...",
  },
  processing: {
    percentage: 60,
    message: "Procesando respuesta del servidor...",
  },
  download: {
    percentage: 90,
    message: "Preparando descarga...",
  },
  complete: {
    percentage: 100,
    message: "Reporte generado exitosamente",
  },
  error: {
    percentage: 0,
    message: "Error en la generación del reporte",
  },
};

// Configuración de headers para requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  network: "Error de conexión con el servidor",
  timeout: "La operación ha tardado demasiado tiempo",
  unauthorized: "No tiene permisos para generar este reporte",
  notFound: "El reporte solicitado no existe",
  serverError: "Error interno del servidor",
  invalidConfig: "Configuración de reporte inválida",
  fileTooLarge: "El archivo generado es demasiado grande",
  tooManyRecords: "Demasiados registros para procesar",
};

// Configuración CSV por defecto
export const CSV_CONFIG = {
  separator: ",",
  encoding: "utf-8",
  includeHeaders: true,
  dateFormat: "DD/MM/YYYY",
  currencyFormat: "es-CL",
};

// Configuración de formateadores por tipo
export const FORMATTERS = {
  date: (value: any): string => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("es-CL");
  },

  currency: (value: any): string => {
    if (typeof value !== "number") return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  },

  number: (value: any): string => {
    if (typeof value !== "number") return "";
    return new Intl.NumberFormat("es-CL").format(value);
  },

  boolean: (value: any): string => {
    return value ? "Sí" : "No";
  },

  string: (value: any): string => {
    if (typeof value === "string") {
      // Escapar comillas y saltos de línea para CSV
      let escaped = value.replace(/"/g, '""');
      if (
        escaped.includes(",") ||
        escaped.includes("\n") ||
        escaped.includes('"')
      ) {
        escaped = `"${escaped}"`;
      }
      return escaped;
    }
    return value || "";
  },
};

// Configuración de columnas por defecto para cada tipo de reporte
export const DEFAULT_COLUMNS = {
  clientes: [
    { key: "nombre", header: "Nombre", type: "string" as const },
    { key: "correo", header: "Correo", type: "string" as const },
    { key: "telefono", header: "Teléfono", type: "string" as const },
    { key: "fechaRegistro", header: "Fecha Registro", type: "date" as const },
    { key: "activo", header: "Activo", type: "boolean" as const },
  ],
  empresas: [
    { key: "nombreEmpresa", header: "Empresa", type: "string" as const },
    { key: "rut", header: "RUT", type: "string" as const },
    { key: "correo", header: "Correo", type: "string" as const },
    { key: "ciudad", header: "Ciudad", type: "string" as const },
    { key: "estado", header: "Estado", type: "string" as const },
  ],
  cotizaciones: [
    { key: "numero", header: "Número", type: "string" as const },
    { key: "cliente", header: "Cliente", type: "string" as const },
    { key: "servicio", header: "Servicio", type: "string" as const },
    { key: "monto", header: "Monto", type: "currency" as const },
    { key: "fecha", header: "Fecha", type: "date" as const },
    { key: "estado", header: "Estado", type: "string" as const },
  ],
};

// Configuración de cache
export const CACHE_CONFIG = {
  enabled: true,
  ttl: 300000, // 5 minutos
  maxSize: 100, // 100 MB
  prefix: "reporte_cache_",
};

// URLs de endpoints específicos
export const ENDPOINTS = {
  clientes: "/api/reportes/clientes",
  empresas: "/api/reportes/empresas",
  cotizaciones: "/api/reportes/cotizaciones",
  dispositivos: "/api/reportes/dispositivos",
  estadisticas: "/api/reportes/estadisticas",
  "consumo-sectorial": "/api/reportes/consumo-sectorial",
  historial: "/api/reportes/historial",
  estadisticasReportes: "/api/reportes/estadisticas-reportes",
};

// Configuración de debug
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === "development",
  logRequests: true,
  logResponses: true,
  logProgress: true,
  logErrors: true,
};
