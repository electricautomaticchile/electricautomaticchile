import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';
import { Anomalia } from './types';
import { AnomaliaCard } from './AnomaliaCard';

interface TabAnomaliasProps {
  anomalias: Anomalia[];
}

export function TabAnomalias({ anomalias }: TabAnomaliasProps) {
  if (anomalias.length === 0) {
    return (
      <Card className="border-muted">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No hay anomalías que mostrar</h3>
          <p className="text-sm text-muted-foreground">
            No se encontraron anomalías con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {anomalias.map((anomalia) => (
        <AnomaliaCard key={anomalia.id} anomalia={anomalia} />
      ))}
    </div>
  );
}
