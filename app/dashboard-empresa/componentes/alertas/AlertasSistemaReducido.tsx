import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Bell, Battery, Clock } from "lucide-react";
import { AlertasSistemaReducidoProps } from './types';
import { IconoAlertaReducido, IndicadorEstado } from './AlertasSistemaIconos';
import { LAYOUTS } from './config';

export function AlertasSistemaReducido({ 
  alertas, 
  resumen, 
  loading 
}: AlertasSistemaReducidoProps) {

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Resumen skeleton */}
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Alertas skeleton */}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas principales en grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Críticas</div>
          <div className="text-xl font-bold text-red-600">
            {resumen.errorCritico}
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Advertencias</div>
          <div className="text-xl font-bold text-amber-600">
            {resumen.advertencia}
          </div>
        </div>
      </div>

      {/* Resumen de no leídas e importantes */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">No leídas</span>
          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {resumen.noLeidas}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Bell className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {resumen.importantes} importantes
          </span>
        </div>
      </div>

      {/* Lista de alertas recientes (máximo 3) */}
      <div className="space-y-2">
        {alertas.slice(0, LAYOUTS.reducido.maxAlertas).map((alerta, index) => (
          <AlertaReducidaItem key={alerta.id || index} alerta={alerta} />
        ))}
        
        {/* Indicador de más alertas */}
        {alertas.length > LAYOUTS.reducido.maxAlertas && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{alertas.length - LAYOUTS.reducido.maxAlertas} alertas más
            </span>
          </div>
        )}
      </div>

      {/* Sin alertas */}
      {alertas.length === 0 && (
        <div className="text-center py-4">
          <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay alertas activas
          </p>
        </div>
      )}
    </div>
  );
}

// Componente individual para alerta en versión reducida
function AlertaReducidaItem({ alerta }: { alerta: any }) {
  const getBgClass = (tipo: string) => {
    switch (tipo) {
      case "error":
        return "border-red-100 bg-red-50 dark:border-red-800 dark:bg-red-900/10";
      case "advertencia":
        return "border-amber-100 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10";
      case "exito":
        return "border-green-100 bg-green-50 dark:border-green-800 dark:bg-green-900/10";
      default:
        return "border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10";
    }
  };

  return (
    <div
      className={`p-2 border rounded-lg transition-all hover:shadow-sm ${getBgClass(alerta.tipo)}`}
    >
      <div className="flex items-start gap-2">
        <IconoAlertaReducido tipo={alerta.tipo} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {alerta.mensaje}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-1">
            {alerta.dispositivo && (
              <>
                <Battery className="h-3 w-3" />
                {alerta.dispositivo}
              </>
            )}
            {alerta.dispositivo && alerta.fecha && " • "}
            {alerta.fecha && (
              <>
                <Clock className="h-3 w-3" />
                {alerta.fecha}
              </>
            )}
          </div>
        </div>
        <IndicadorEstado leida={alerta.leida} />
      </div>
    </div>
  );
}

// Componente extra compacto para dashboards muy pequeños
export function AlertasSistemaMiniatura({ resumen }: { resumen: any }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-orange-600" />
        <div>
          <div className="text-sm font-medium">Alertas</div>
          <div className="text-xs text-gray-500">
            {resumen.noLeidas} sin leer
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {resumen.errorCritico > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-red-600">
              {resumen.errorCritico}
            </span>
          </div>
        )}
        {resumen.advertencia > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-medium text-amber-600">
              {resumen.advertencia}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
