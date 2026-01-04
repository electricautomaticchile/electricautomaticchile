import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { EstadisticasAntifraude } from './types';
import { getTypeInfo } from './utils';

interface TabEstadisticasProps {
  estadisticas: EstadisticasAntifraude | null;
}

export function TabEstadisticas({ estadisticas }: TabEstadisticasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Anomalías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {estadisticas && Object.entries(estadisticas.porTipo).map(([tipo, cantidad]) => {
              const total = estadisticas.totalAnomalias;
              const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(0) : 0;
              return (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm">{getTypeInfo(tipo).text}</span>
                  <Badge variant="outline">{porcentaje}%</Badge>
                </div>
              );
            })}
            {(!estadisticas || Object.keys(estadisticas.porTipo).length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay datos disponibles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tendencias Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Gráfico de tendencias de detección
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
