import {
  DatoConsumo,
  EstadisticasResumen,
  ColoresGrafico,
  PeriodoDisponible,
  AlertasConsumo,
} from "./types";

// Colores para los gráficos
export const COLORES: ColoresGrafico = {
  primary: "#ea580c",
  secondary: "#f97316",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gradient: ["#ea580c", "#f97316"],
};

// Períodos disponibles para selección
export const PERIODOS_DISPONIBLES: PeriodoDisponible[] = [
  {
    value: "nov-2023",
    label: "Noviembre 2023",
    fechaInicio: "2023-11-01",
    fechaFin: "2023-11-30",
    activo: true,
  },
  {
    value: "oct-2023",
    label: "Octubre 2023",
    fechaInicio: "2023-10-01",
    fechaFin: "2023-10-31",
    activo: true,
  },
  {
    value: "sep-2023",
    label: "Septiembre 2023",
    fechaInicio: "2023-09-01",
    fechaFin: "2023-09-30",
    activo: true,
  },
  {
    value: "ano-2023",
    label: "Todo 2023",
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-31",
    activo: true,
  },
  {
    value: "ultimo-trimestre",
    label: "Último Trimestre",
    fechaInicio: "2023-09-01",
    fechaFin: "2023-11-30",
    activo: true,
  },
];

// Configuración de alertas por defecto
export const ALERTAS_DEFAULT: AlertasConsumo = {
  picoElevado: {
    umbral: 200, // kWh
    activa: true,
  },
  eficienciaBaja: {
    umbral: 75, // porcentaje
    activa: true,
  },
  costoElevado: {
    umbral: 180000, // pesos chilenos
    activa: true,
  },
  consumoAnomalo: {
    desviacion: 25, // porcentaje sobre promedio
    activa: true,
  },
};

// Estadísticas de resumen por defecto
export const ESTADISTICAS_RESUMEN_DEFAULT: EstadisticasResumen = {
  consumoMensual: 4520,
  variacionMensual: -2.8,
  consumoAnual: 54270,
  variacionAnual: 5.2,
  pico: {
    valor: 250.5,
    fecha: "15/11/2023",
    hora: "19:35",
  },
  horarioPico: "18:00 - 21:00",
  eficienciaEnergetica: 87.5,
  costoMensual: 156780,
  ahorroPotencial: 18500,
};

// Función para generar datos simulados
export const generarDatosConsumo = (
  tipo: "diario" | "mensual" | "horario"
): DatoConsumo[] => {
  switch (tipo) {
    case "diario":
      return Array.from({ length: 30 }, (_, i) => ({
        periodo: `${i + 1}/11`,
        consumo:
          Math.floor(Math.random() * 100) + 120 + (i % 7 === 0 ? -20 : 0), // Domingos menos consumo
        costo: Math.floor(Math.random() * 3000) + 4000,
        eficiencia: Math.floor(Math.random() * 20) + 80,
      }));

    case "mensual":
      return Array.from({ length: 12 }, (_, i) => ({
        periodo: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ][i],
        consumo:
          Math.floor(Math.random() * 800) + 3800 + (i > 5 && i < 9 ? 400 : 0), // Invierno mayor consumo
        costo: Math.floor(Math.random() * 30000) + 120000,
        eficiencia: Math.floor(Math.random() * 15) + 82,
      }));

    case "horario":
      return Array.from({ length: 24 }, (_, i) => ({
        periodo: `${i.toString().padStart(2, "0")}:00`,
        consumo:
          Math.floor(Math.random() * 50) +
          (i >= 8 && i <= 18 ? 80 : 30) + // Horario laboral
          (i >= 18 && i <= 21 ? 40 : 0), // Horario pico
        costo: Math.floor(Math.random() * 2000) + 1500,
        eficiencia: Math.floor(Math.random() * 25) + 70,
      }));

    default:
      return [];
  }
};

// Configuraciones de gráficos por tipo
export const CONFIGURACIONES_GRAFICO = {
  linea: {
    altura: 300,
    strokeWidth: 2,
    dot: true,
    animationDuration: 800,
  },
  area: {
    altura: 350,
    strokeWidth: 2,
    fillOpacity: 0.6,
    animationDuration: 1000,
  },
  barras: {
    altura: 300,
    radius: [4, 4, 0, 0],
    animationDuration: 600,
  },
  pie: {
    altura: 300,
    innerRadius: 60,
    outerRadius: 120,
    paddingAngle: 5,
  },
};

// Mensajes del sistema
export const MENSAJES = {
  cargando: "Cargando estadísticas...",
  errorCarga: "Error al cargar las estadísticas",
  exportacionExitosa: "Estadísticas exportadas exitosamente",
  errorExportacion: "Error al exportar las estadísticas",
  sinDatos: "No hay datos disponibles para el período seleccionado",
  configuracionGuardada: "Configuración guardada correctamente",
};

// Configuración de exportación
export const CONFIGURACION_EXPORTACION = {
  formatos: ["excel", "csv", "pdf"] as const,
  tipos: ["mensual", "diario", "horario"] as const,
  limitesRegistros: {
    excel: 1000000,
    csv: 500000,
    pdf: 10000,
  },
  templates: {
    basico: "template-basico",
    completo: "template-completo",
    ejecutivo: "template-ejecutivo",
  },
};

// Configuración de actualización automática
export const CONFIG_ACTUALIZACION = {
  intervalo: 300000, // 5 minutos
  habilitada: true,
  intentosMaximos: 3,
  timeoutRequest: 30000, // 30 segundos
};

// Umbrales para análisis de tendencias
export const UMBRALES_TENDENCIA = {
  variacionMinima: 2, // porcentaje mínimo para considerar cambio significativo
  alertaVariacion: 15, // porcentaje para alertas de variación alta
  eficienciaMinima: 80, // porcentaje mínimo de eficiencia esperada
  costoMaximo: 200000, // costo máximo mensual esperado
};

// Configuración de tooltips
export const CONFIG_TOOLTIPS = {
  mostrarAnimacion: true,
  retardo: 150,
  estilo: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #374151",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    color: "white",
  },
};

// Datos de ejemplo para pruebas
export const DATOS_EJEMPLO = {
  consumoMensual: generarDatosConsumo("mensual"),
  consumoDiario: generarDatosConsumo("diario"),
  consumoHorario: generarDatosConsumo("horario"),
};

// Configuración de colores para diferentes tipos de datos
export const COLORES_DATOS = {
  consumo: COLORES.primary,
  costo: COLORES.success,
  eficiencia: COLORES.info,
  alerta: COLORES.warning,
  error: COLORES.danger,
  neutral: "#6b7280",
};

// Configuración de unidades
export const UNIDADES = {
  consumo: "kWh",
  costo: "CLP",
  eficiencia: "%",
  potencia: "kW",
  temperatura: "°C",
};

// Configuración de formatos de número
export const FORMATOS_NUMERO = {
  consumo: {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  },
  costo: {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  },
  porcentaje: {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  },
};

// Configuración de validaciones
export const VALIDACIONES = {
  consumoMinimo: 0,
  consumoMaximo: 10000,
  eficienciaMinima: 0,
  eficienciaMaxima: 100,
  periodoMaximoAnos: 5,
};

// Configuración de cache
export const CONFIG_CACHE = {
  duracionDatos: 300000, // 5 minutos
  duracionEstadisticas: 600000, // 10 minutos
  maxRegistros: 1000,
  limpiezaAutomatica: true,
};
