"use client";

import { EstadisticasConsumoProps } from "./types";
import { useEstadisticasConsumo } from "./useEstadisticasConsumo";
import { EstadisticasConsumoStats } from "./EstadisticasConsumoStats";
import { EstadisticasConsumoAcciones } from "./EstadisticasConsumoAcciones";
import { EstadisticasConsumoCharts } from "./EstadisticasConsumoCharts";
import { EstadisticasConsumoReducido } from "./EstadisticasConsumoReducido";

export function EstadisticasConsumo({
  reducida = false,
}: EstadisticasConsumoProps) {
  const {
    loading,
    periodoSeleccionado,
    datosConsumo,
    resumenEstadisticas,
    estadoExportacion,
    handleExportarEstadisticas,
    cerrarModalExportacion,
    setPeriodoSeleccionado,
  } = useEstadisticasConsumo();

  // Versión reducida del componente
  if (reducida) {
    return (
      <EstadisticasConsumoReducido
        datos={datosConsumo}
        resumen={resumenEstadisticas}
        loading={loading}
      />
    );
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        {/* Acciones y controles */}
        <EstadisticasConsumoAcciones
          periodoSeleccionado={periodoSeleccionado}
          onPeriodoChange={setPeriodoSeleccionado}
          onExportar={handleExportarEstadisticas}
          estadoExportacion={estadoExportacion}
          loading={loading}
        />

        {/* Estadísticas y métricas */}
        <EstadisticasConsumoStats
          resumen={resumenEstadisticas}
          periodoSeleccionado={periodoSeleccionado}
          loading={loading}
        />

        {/* Gráficos de estadísticas */}
        <EstadisticasConsumoCharts
          datos={datosConsumo}
          loading={loading}
          tipoGrafico="linea"
        />
      </div>
    </div>
  );
}
