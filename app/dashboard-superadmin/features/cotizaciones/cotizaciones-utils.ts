// Función para formatear el tipo de servicio
export const formatServicio = (servicio: string): string => {
  if (servicio === "cotizacion_reposicion") return "Sistema de Reposición";
  if (servicio === "cotizacion_monitoreo") return "Sistema de Monitoreo";
  if (servicio === "cotizacion_mantenimiento") return "Mantenimiento";
  if (servicio === "cotizacion_completa") return "Solución Integral";
  return servicio
    .replace("cotizacion_", "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Constantes
export const ITEMS_POR_PAGINA = 10;

// Función para obtener estadísticas de cotizaciones
export const getEstadisticas = (cotizaciones: any[]) => {
  return {
    total: cotizaciones.length,
    pendientes: cotizaciones.filter((c) => c.estado === "pendiente").length,
    aprobadas: cotizaciones.filter((c) => c.estado === "aprobada").length,
    cotizadas: cotizaciones.filter((c) => c.estado === "cotizada").length,
    enRevision: cotizaciones.filter((c) => c.estado === "en_revision").length,
    urgentes: cotizaciones.filter((c) => c.plazo === "urgente").length,
  };
};
