import { DatoBase } from "./types";

// Colores para los gráficos
export const SECTOR_COLORS = [
  "#ea580c", // Naranja principal
  "#f97316", // Naranja secundario
  "#22c55e", // Verde
  "#3b82f6", // Azul
  "#f59e0b", // Amarillo
  "#8b5cf6", // Púrpura
  "#ef4444", // Rojo
  "#06b6d4", // Cyan
];

export const AREA_COLORS = [
  "#1e40af", // Azul oscuro
  "#ea580c", // Naranja
  "#059669", // Verde esmeralda
  "#7c3aed", // Púrpura
  "#dc2626", // Rojo
];

export const HORARIO_COLORS = [
  "#312e81", // Índigo oscuro (madrugada)
  "#1e40af", // Azul (mañana)
  "#059669", // Verde (media mañana)
  "#f59e0b", // Amarillo (almuerzo)
  "#ea580c", // Naranja (tarde)
  "#dc2626", // Rojo (noche)
];

// Datos base para simulación
export const SECTORES_BASE: DatoBase[] = [
  { nombre: "Iluminación", base: 2450, variacion: 0.15 },
  { nombre: "Climatización", base: 2100, variacion: 0.25 },
  { nombre: "Equipos de oficina", base: 1750, variacion: 0.1 },
  { nombre: "Servidores", base: 1400, variacion: 0.05 },
  { nombre: "Cocina/Comedor", base: 700, variacion: 0.2 },
  { nombre: "Otros", base: 350, variacion: 0.3 },
];

export const AREAS_BASE: DatoBase[] = [
  { nombre: "Piso 1 - Recepción", base: 1050, variacion: 0.1 },
  { nombre: "Piso 2 - Oficinas", base: 2450, variacion: 0.15 },
  { nombre: "Piso 3 - Administración", base: 1750, variacion: 0.12 },
  { nombre: "Piso 4 - Desarrollo", base: 1925, variacion: 0.18 },
  { nombre: "Piso 5 - Gerencia", base: 1575, variacion: 0.08 },
];

export const FRANJAS_BASE: DatoBase[] = [
  { nombre: "00:00 - 06:00", base: 875, variacion: 0.2 },
  { nombre: "06:00 - 09:00", base: 1225, variacion: 0.25 },
  { nombre: "09:00 - 12:00", base: 2100, variacion: 0.15 },
  { nombre: "12:00 - 14:00", base: 1400, variacion: 0.2 },
  { nombre: "14:00 - 18:00", base: 2275, variacion: 0.18 },
  { nombre: "18:00 - 00:00", base: 875, variacion: 0.22 },
];

// Opciones de períodos
export const PERIODOS_DISPONIBLES = [
  { value: "nov-2023", label: "Noviembre 2023" },
  { value: "oct-2023", label: "Octubre 2023" },
  { value: "sep-2023", label: "Septiembre 2023" },
  { value: "ano-2023", label: "Todo 2023" },
];

// Configuración de charts
export const CHART_CONFIG = {
  pie: {
    innerRadius: 20,
    outerRadius: 80,
    paddingAngle: 2,
  },
  pieReducida: {
    innerRadius: 20,
    outerRadius: 40,
    paddingAngle: 2,
  },
  bar: {
    height: 400,
  },
  radial: {
    innerRadius: "10%",
    outerRadius: "80%",
  },
};
