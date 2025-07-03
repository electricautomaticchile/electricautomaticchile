import { DatoSector } from "./types";
import { PieChartReducido } from "./ConsumoSectorialCharts";

interface ConsumoSectorialReducidoProps {
  datos: DatoSector[];
  loading: boolean;
}

export function ConsumoSectorialReducido({
  datos,
  loading,
}: ConsumoSectorialReducidoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500">Mayor consumo</div>
          <div className="text-lg font-bold text-blue-600">
            {datos.length > 0 ? datos[0].nombre : "Iluminación"}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500">Menor consumo</div>
          <div className="text-lg font-bold text-green-600">
            {datos.length > 0 ? datos[datos.length - 1].nombre : "Otros"}
          </div>
        </div>
      </div>

      <PieChartReducido data={datos} loading={loading} />

      <div className="space-y-2">
        {datos.slice(0, 3).map((sector, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sector.color }}
              ></div>
              <span className="text-sm">{sector.nombre}</span>
            </div>
            <div className="text-sm font-medium">{sector.porcentaje}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
