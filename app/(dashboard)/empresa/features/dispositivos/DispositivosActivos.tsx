"use client";

import { DispositivosActivosProps } from "./types";
import { useDispositivosActivos } from "./useDispositivosActivos";
import { DispositivosActivosStats } from "./DispositivosActivosStats";
import { DispositivosActivosAcciones } from "./DispositivosActivosAcciones";
import { DispositivosActivosTabla } from "./DispositivosActivosTabla";
import { DispositivosActivosReducido } from "./DispositivosActivosReducido";

export function DispositivosActivos({
  reducida = false,
}: DispositivosActivosProps) {
  const {
    loading,
    dispositivos,
    dispositivosOriginales,
    resumenDispositivos,
    filtros,
    isWebSocketConnected,
    cambiarBusqueda,
    cambiarTabActiva,
    controlarDispositivo,
    refrescarDatos,
  } = useDispositivosActivos();

  // Versión reducida del componente
  if (reducida) {
    return (
      <DispositivosActivosReducido
        dispositivos={dispositivosOriginales}
        resumen={resumenDispositivos}
        loading={loading}
      />
    );
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        {/* Acciones y controles */}
        <DispositivosActivosAcciones
          busqueda={filtros.busqueda}
          onBusquedaChange={cambiarBusqueda}
          tabActiva={filtros.tabActiva}
          onTabChange={cambiarTabActiva}
          loading={loading}
          onRefresh={refrescarDatos}
          totalDispositivos={resumenDispositivos.total}
          isWebSocketConnected={isWebSocketConnected}
        />

        {/* Estadísticas y resumen */}
        <DispositivosActivosStats
          resumen={resumenDispositivos}
          loading={loading}
        />

        {/* Tabla/grid de dispositivos */}
        <DispositivosActivosTabla
          dispositivos={dispositivos}
          loading={loading}
          onControl={controlarDispositivo}
        />
      </div>
    </div>
  );
}
