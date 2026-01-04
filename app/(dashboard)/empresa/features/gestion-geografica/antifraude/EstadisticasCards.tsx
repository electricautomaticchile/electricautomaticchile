import { Card, CardContent } from "@/components/ui/card";
import { EstadisticasAntifraude } from './types';

interface EstadisticasCardsProps {
  estadisticas: EstadisticasAntifraude;
}

export function EstadisticasCards({ estadisticas }: EstadisticasCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{estadisticas.totalAnomalias}</div>
          <p className="text-xs text-muted-foreground">Total Anomalías</p>
        </CardContent>
      </Card>
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{estadisticas.anomaliasCriticas}</div>
          <p className="text-xs text-muted-foreground">Críticas</p>
        </CardContent>
      </Card>
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{estadisticas.fraudesConfirmados}</div>
          <p className="text-xs text-muted-foreground">Fraudes</p>
        </CardContent>
      </Card>
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{estadisticas.tasaDeteccion}%</div>
          <p className="text-xs text-muted-foreground">Detección</p>
        </CardContent>
      </Card>
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${(estadisticas.ahorroEstimado / 1000).toFixed(0)}K
          </div>
          <p className="text-xs text-muted-foreground">Ahorro USD</p>
        </CardContent>
      </Card>
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{estadisticas.tiempoPromedioResolucion}h</div>
          <p className="text-xs text-muted-foreground">Resolución</p>
        </CardContent>
      </Card>
    </div>
  );
}
