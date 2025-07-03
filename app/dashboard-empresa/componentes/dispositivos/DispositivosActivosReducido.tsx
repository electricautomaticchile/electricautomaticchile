import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { IconoConexion } from "./DispositivosActivosIconos";
import { DispositivosReducidoProps } from "./types";

export function DispositivosActivosReducido({
  dispositivos,
  resumen,
  loading,
}: DispositivosReducidoProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
            >
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between p-2"
            >
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen rápido */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Activos
          </div>
          <div className="text-xl font-bold text-green-600">
            {resumen.activos}
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Con alerta
          </div>
          <div className="text-xl font-bold text-amber-600">
            {resumen.alerta}
          </div>
        </div>
      </div>

      {/* Batería promedio */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Batería promedio
          </span>
          <span className="text-sm font-bold text-blue-600">
            {resumen.bateriaPromedio}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              resumen.bateriaPromedio >= 80
                ? "bg-green-600"
                : resumen.bateriaPromedio >= 50
                  ? "bg-blue-600"
                  : resumen.bateriaPromedio >= 20
                    ? "bg-amber-600"
                    : "bg-red-600"
            }`}
            style={{ width: `${resumen.bateriaPromedio}%` }}
          ></div>
        </div>
      </div>

      {/* Lista compacta de dispositivos */}
      <div className="space-y-2">
        {dispositivos.slice(0, 4).map((dispositivo, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <IconoConexion
                tipo={dispositivo.tipoConexion}
                senal={dispositivo.senal}
              />
              <span className="text-sm font-medium">{dispositivo.id}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Nivel de batería simple */}
              <div className="flex items-center gap-1">
                <div className="w-6 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${
                      dispositivo.bateria >= 80
                        ? "bg-green-600"
                        : dispositivo.bateria >= 50
                          ? "bg-blue-600"
                          : dispositivo.bateria >= 20
                            ? "bg-amber-600"
                            : "bg-red-600"
                    }`}
                    style={{ width: `${dispositivo.bateria}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {dispositivo.bateria}%
                </span>
              </div>

              {/* Estado */}
              <div
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  dispositivo.estado === "activo"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : dispositivo.estado === "alerta"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                      : dispositivo.estado === "mantenimiento"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                }`}
              >
                {dispositivo.estado}
              </div>
            </div>
          </div>
        ))}

        {dispositivos.length > 4 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">
              +{dispositivos.length - 4} dispositivos más
            </span>
          </div>
        )}
      </div>

      {/* Métricas adicionales compactas */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
          <div className="text-gray-500 dark:text-gray-400 mb-1">
            Señal promedio
          </div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {resumen.senalPromedio}%
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
          <div className="text-gray-500 dark:text-gray-400 mb-1">
            Consumo total
          </div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {resumen.consumoTotal} kWh
          </div>
        </div>
      </div>
    </div>
  );
}
