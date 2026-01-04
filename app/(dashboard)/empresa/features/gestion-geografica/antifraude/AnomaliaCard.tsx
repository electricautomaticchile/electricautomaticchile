import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Activity, Users, ExternalLink } from 'lucide-react';
import { Anomalia } from './types';
import { getSeverityInfo, getStatusInfo, getTypeInfo } from './utils';

interface AnomaliaCardProps {
  anomalia: Anomalia;
}

export function AnomaliaCard({ anomalia }: AnomaliaCardProps) {
  const severityInfo = getSeverityInfo(anomalia.severidad);
  const statusInfo = getStatusInfo(anomalia.estado);
  const typeInfo = getTypeInfo(anomalia.tipoAnomalia);
  const IconComponent = typeInfo.icon;

  return (
    <Card className="border-muted">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{anomalia.nombreCliente}</h4>
                <Badge className={severityInfo.color}>
                  {severityInfo.text}
                </Badge>
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.text}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Medidor: {anomalia.numeroDispositivo} • {typeInfo.text}
              </p>
              <p className="text-sm mb-3">{anomalia.descripcion}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(anomalia.fechaDeteccion).toLocaleString('es-CL')}
                </div>
                {anomalia.valorEsperado && anomalia.valorDetectado && (
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Esperado: {anomalia.valorEsperado.toFixed(2)} / Detectado: {anomalia.valorDetectado.toFixed(2)}
                  </div>
                )}
                {anomalia.asignadoA && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {anomalia.asignadoA}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <ExternalLink className="h-3 w-3 mr-1" />
              Investigar
            </Button>
          </div>
        </div>

        {anomalia.notasInvestigacion && (
          <div className="p-3 bg-muted rounded-lg">
            <h5 className="text-sm font-medium mb-1">Notas de Investigación:</h5>
            <p className="text-sm text-muted-foreground">
              {anomalia.notasInvestigacion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
