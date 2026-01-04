import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp } from 'lucide-react';
import { Anomalia, EstadisticasAntifraude } from './types';

interface VistaReducidaProps {
  anomalias: Anomalia[];
  estadisticas: EstadisticasAntifraude | null;
}

export function VistaReducida({ anomalias, estadisticas }: VistaReducidaProps) {
  const anomaliasPendientes = anomalias.filter(a => a.estado === 'pending').length;
  const anomaliasCriticas = anomalias.filter(a => a.severidad === 'critical').length;

  return (
    <Card className="h-64 hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Sistema Anti-fraude
        </CardTitle>
        <CardDescription className="text-xs">
          Detección automática de anomalías
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {anomaliasCriticas}
              </div>
              <p className="text-xs text-muted-foreground">Críticas</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {anomaliasPendientes}
              </div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>

          {estadisticas && (
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-800 dark:text-green-200">
                  Tasa de Detección
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {estadisticas.tasaDeteccion}%
              </div>
            </div>
          )}

          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                Ahorro Estimado
              </span>
            </div>
            <div className="text-sm font-bold text-blue-600">
              ${estadisticas?.ahorroEstimado.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
