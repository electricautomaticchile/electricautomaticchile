import { MapPin, AlertTriangle, CheckCircle, Eye } from "lucide-react";

interface EstadisticasFlotantesProps {
  stats: {
    total: number;
    activos: number;
    sospechosos: number;
    fraudes: number;
    anomaliasTotal: number;
  };
}

export function EstadisticasFlotantes({ stats }: EstadisticasFlotantesProps) {
  return (
    <div className="absolute top-4 left-4 space-y-2 z-[1000] pointer-events-auto">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs text-muted-foreground">Total Medidores</p>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="text-xs opacity-90">Activos</p>
            <p className="text-lg font-bold">{stats.activos}</p>
          </div>
        </div>
      </div>

      {stats.sospechosos > 0 && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <div>
              <p className="text-xs opacity-90">Sospechosos</p>
              <p className="text-lg font-bold">{stats.sospechosos}</p>
            </div>
          </div>
        </div>
      )}

      {stats.fraudes > 0 && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="text-xs opacity-90">Fraudes Detectados</p>
              <p className="text-lg font-bold">{stats.fraudes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
