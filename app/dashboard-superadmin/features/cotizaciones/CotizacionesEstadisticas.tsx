interface Estadisticas {
  total: number;
  pendientes: number;
  aprobadas: number;
  cotizadas: number;
  enRevision: number;
  urgentes: number;
}

interface CotizacionesEstadisticasProps {
  estadisticas: Estadisticas;
  reducida?: boolean;
}

export function CotizacionesEstadisticas({
  estadisticas,
  reducida = false,
}: CotizacionesEstadisticasProps) {
  if (reducida) {
    return (
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {estadisticas.total}
          </div>
          <div className="text-xs text-orange-800 dark:text-orange-300">
            Total cotizaciones
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {estadisticas.pendientes}
          </div>
          <div className="text-xs text-yellow-800 dark:text-yellow-300">
            Pendientes
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {estadisticas.cotizadas}
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-300">
            Cotizadas
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {estadisticas.aprobadas}
          </div>
          <div className="text-xs text-green-800 dark:text-green-300">
            Aprobadas
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {estadisticas.total}
        </div>
        <div className="text-sm text-orange-800 dark:text-orange-300">
          Total cotizaciones
        </div>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
          {estadisticas.pendientes}
        </div>
        <div className="text-sm text-yellow-800 dark:text-yellow-300">
          Pendientes
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {estadisticas.enRevision}
        </div>
        <div className="text-sm text-blue-800 dark:text-blue-300">
          Revisadas
        </div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {estadisticas.cotizadas}
        </div>
        <div className="text-sm text-purple-800 dark:text-purple-300">
          Cotizadas
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          {estadisticas.aprobadas}
        </div>
        <div className="text-sm text-green-800 dark:text-green-300">
          Aprobadas
        </div>
      </div>
    </div>
  );
}
