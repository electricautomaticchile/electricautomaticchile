import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, Activity, Shield } from 'lucide-react';
import { Anomalia } from './types';
import { getSeverityInfo } from './utils';

interface TabInvestigacionProps {
  anomalias: Anomalia[];
}

export function TabInvestigacion({ anomalias }: TabInvestigacionProps) {
  const casosActivos = anomalias.filter(a => a.estado === 'investigating');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Casos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {casosActivos.map((anomalia) => (
              <div key={anomalia.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{anomalia.nombreCliente}</h4>
                  <Badge className={getSeverityInfo(anomalia.severidad).color}>
                    {getSeverityInfo(anomalia.severidad).text}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {anomalia.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Asignado a: {anomalia.asignadoA || 'Sin asignar'}
                  </span>
                  <Button size="sm" variant="outline">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
            {casosActivos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay casos en investigación
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Herramientas de Investigación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Validar Ubicación GPS
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Analizar Patrones
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Verificar Dispositivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
