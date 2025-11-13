import { Layers } from "lucide-react";

export function LeyendaMapa() {
  return (
    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[1000] pointer-events-auto">
      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-blue-600" />
        Estado de Medidores
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
          <span className="text-xs font-medium">
            Activo - Funcionando correctamente
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-md"></div>
          <span className="text-xs font-medium">
            Sospechoso - Requiere revisión
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
          <span className="text-xs font-medium">
            Fraude - Anomalía detectada
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-400 shadow-md"></div>
          <span className="text-xs font-medium">Inactivo - Sin conexión</span>
        </div>
      </div>
    </div>
  );
}
