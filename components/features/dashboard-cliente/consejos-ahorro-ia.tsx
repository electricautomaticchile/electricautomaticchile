"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingDown, Zap, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { analizarBoletasConIA } from '@/lib/api/services/aiService';
import { useBoletasCliente } from '@/hooks/queries';
import { useApi } from '@/hooks/useApi';
import { LoadingState } from '@/components/shared';

export function ConsejosAhorroIA() {
  const { user, isRealAuthenticated } = useApi();
  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();
  
  const { data: boletas = [], isLoading } = useBoletasCliente(
    isRealAuthenticated ? clienteId : null
  );

  const [consejos, setConsejos] = useState<any>(null);
  const [analizando, setAnalizando] = useState(false);

  const analizarConsumo = useCallback(async () => {
    setAnalizando(true);
    try {
      const ultimasTres = boletas.slice(-3).map(b => ({
        periodo: b.periodo,
        consumoTotal: b.consumoKwh,
        monto: b.monto,
      }));

      const resultado = await analizarBoletasConIA(ultimasTres);
      setConsejos(resultado);
    } catch (error) {
      console.error('Error analizando consumo:', error);
    } finally {
      setAnalizando(false);
    }
  }, [boletas]);

  useEffect(() => {
    if (boletas.length >= 3) {
      analizarConsumo();
    }
  }, [boletas.length, analizarConsumo]);

  if (isLoading) {
    return <LoadingState message="Cargando análisis..." />;
  }

  if (boletas.length < 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Consejos de Ahorro con IA
          </CardTitle>
          <CardDescription>
            Necesitas al menos 3 boletas para generar consejos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Tienes {boletas.length} de 3 boletas necesarias</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 dark:border-purple-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Consejos de Ahorro con IA
            </CardTitle>
            <CardDescription>
              Análisis inteligente de tus últimas 3 boletas
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={analizarConsumo}
            disabled={analizando}
          >
            {analizando ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {analizando ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              <p className="text-sm text-muted-foreground">Analizando tu consumo...</p>
            </div>
          </div>
        ) : consejos ? (
          <>
            {consejos.ahorroEstimado > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Ahorro Potencial
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {consejos.ahorroEstimado.toFixed(0)} kWh/mes
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Aproximadamente ${(consejos.ahorroEstimado * 185).toFixed(0)} CLP
                    </p>
                  </div>
                </div>
              </div>
            )}

            {consejos.horasPico && consejos.horasPico.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  Horas Pico Detectadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {consejos.horasPico.map((hora: number) => (
                    <Badge key={hora} variant="outline" className="bg-orange-50 dark:bg-orange-900/20">
                      {hora}:00 - {hora + 1}:00
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Evita usar electrodomésticos de alto consumo en estas horas
                </p>
              </div>
            )}

            {consejos.recomendaciones && consejos.recomendaciones.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Recomendaciones Personalizadas
                </h3>
                <div className="space-y-3">
                  {consejos.recomendaciones.map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{rec.titulo}</h4>
                            <Badge
                              variant={
                                rec.impacto === 'alto'
                                  ? 'default'
                                  : rec.impacto === 'medio'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs"
                            >
                              {rec.impacto === 'alto' ? 'Alto impacto' : rec.impacto === 'medio' ? 'Medio impacto' : 'Bajo impacto'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {rec.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {consejos.consejos && consejos.consejos.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Análisis de tu consumo
                </h4>
                <ul className="space-y-1">
                  {consejos.consejos.map((consejo: string, idx: number) => (
                    <li key={idx} className="text-sm text-blue-800 dark:text-blue-200">
                      • {consejo}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-2 text-purple-400" />
            <p>Haz clic en el botón para analizar tu consumo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
