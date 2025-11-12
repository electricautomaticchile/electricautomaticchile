"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Thermometer, 
  Wind, 
  Sun, 
  Cloud, 
  Droplets,
  CheckCircle,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

interface ConsejoAhorro {
  id: string;
  categoria: 'climatizacion' | 'iluminacion' | 'electrodomesticos' | 'general';
  titulo: string;
  descripcion: string;
  ahorroEstimado: number; // porcentaje
  prioridad: 'alta' | 'media' | 'baja';
  aplicado: boolean;
  condicionClimatica: string;
}

interface ConsejosAhorroProps {
  reducida?: boolean;
  condicionesClimaticas?: {
    temperatura: number;
    humedad: number;
    descripcion: string;
  };
}

export function ConsejosAhorro({ reducida = false, condicionesClimaticas }: ConsejosAhorroProps) {
  const [consejos, setConsejos] = useState<ConsejoAhorro[]>([]);
  const [loading, setLoading] = useState(true);
  const [ahorroTotal, setAhorroTotal] = useState(0);

  // Datos de ejemplo basados en condiciones climáticas
  const generarConsejos = (condiciones?: { temperatura: number; humedad: number; descripcion: string }) => {
    const temp = condiciones?.temperatura || 25;
    const humedad = condiciones?.humedad || 60;
    
    const consejosBase: ConsejoAhorro[] = [];

    // Consejos basados en temperatura
    if (temp > 26) {
      consejosBase.push({
        id: 'ac-temp',
        categoria: 'climatizacion',
        titulo: 'Optimizar temperatura del aire acondicionado',
        descripcion: 'Configure el AC a 24°C. Cada grado menos aumenta el consumo en 8%.',
        ahorroEstimado: 15,
        prioridad: 'alta',
        aplicado: false,
        condicionClimatica: 'Día caluroso'
      });

      consejosBase.push({
        id: 'ventiladores',
        categoria: 'climatizacion',
        titulo: 'Usar ventiladores de techo',
        descripcion: 'Los ventiladores permiten sentir 3°C menos con menor consumo energético.',
        ahorroEstimado: 10,
        prioridad: 'media',
        aplicado: false,
        condicionClimatica: 'Temperatura elevada'
      });

      consejosBase.push({
        id: 'cortinas',
        categoria: 'general',
        titulo: 'Cerrar cortinas durante el día',
        descripcion: 'Bloquee el sol directo para reducir la carga térmica interior.',
        ahorroEstimado: 8,
        prioridad: 'media',
        aplicado: false,
        condicionClimatica: 'Sol intenso'
      });
    }

    if (temp < 18) {
      consejosBase.push({
        id: 'calefaccion-temp',
        categoria: 'climatizacion',
        titulo: 'Ajustar temperatura de calefacción',
        descripcion: 'Configure la calefacción a 20°C máximo para eficiencia óptima.',
        ahorroEstimado: 12,
        prioridad: 'alta',
        aplicado: false,
        condicionClimatica: 'Día frío'
      });

      consejosBase.push({
        id: 'aislamiento',
        categoria: 'general',
        titulo: 'Mejorar aislamiento térmico',
        descripcion: 'Selle ventanas y puertas para evitar pérdidas de calor.',
        ahorroEstimado: 15,
        prioridad: 'alta',
        aplicado: false,
        condicionClimatica: 'Temperatura baja'
      });
    }

    // Consejos basados en humedad
    if (humedad > 70) {
      consejosBase.push({
        id: 'deshumidificador',
        categoria: 'climatizacion',
        titulo: 'Usar deshumidificador',
        descripcion: 'Reduzca la humedad para mejorar el confort térmico sin bajar tanto la temperatura.',
        ahorroEstimado: 7,
        prioridad: 'media',
        aplicado: false,
        condicionClimatica: 'Alta humedad'
      });
    }

    // Consejos generales siempre aplicables
    consejosBase.push({
      id: 'led-lights',
      categoria: 'iluminacion',
      titulo: 'Cambiar a iluminación LED',
      descripcion: 'Las luces LED consumen 80% menos energía que las incandescentes.',
      ahorroEstimado: 20,
      prioridad: 'alta',
      aplicado: false,
      condicionClimatica: 'Siempre aplicable'
    });

    consejosBase.push({
      id: 'electrodomesticos-eficientes',
      categoria: 'electrodomesticos',
      titulo: 'Usar electrodomésticos en horarios valle',
      descripcion: 'Use lavadora, lavavajillas y otros equipos durante la madrugada.',
      ahorroEstimado: 25,
      prioridad: 'media',
      aplicado: false,
      condicionClimatica: 'Tarifa diferenciada'
    });

    consejosBase.push({
      id: 'standby-power',
      categoria: 'electrodomesticos',
      titulo: 'Desconectar equipos en standby',
      descripcion: 'Los equipos en standby pueden representar hasta 10% del consumo total.',
      ahorroEstimado: 10,
      prioridad: 'baja',
      aplicado: false,
      condicionClimatica: 'Siempre aplicable'
    });

    return consejosBase.sort((a, b) => {
      const prioridadOrder = { alta: 3, media: 2, baja: 1 };
      return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    });
  };

  useEffect(() => {
    cargarConsejos();
  }, [condicionesClimaticas]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarConsejos = async () => {
    setLoading(true);
    
    try {
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const nuevosConsejos = generarConsejos(condicionesClimaticas);
      setConsejos(nuevosConsejos);
      
      // Calcular ahorro total potencial
      const ahorro = nuevosConsejos.reduce((total, consejo) => total + consejo.ahorroEstimado, 0);
      setAhorroTotal(Math.min(ahorro, 50)); // Máximo 50% de ahorro
    } catch (error) {
      console.error('Error loading savings tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoAplicado = (consejoId: string) => {
    setConsejos(prev => prev.map(consejo => 
      consejo.id === consejoId 
        ? { ...consejo, aplicado: !consejo.aplicado }
        : consejo
    ));
  };

  const getCategoriaIcon = (categoria: ConsejoAhorro['categoria']) => {
    switch (categoria) {
      case 'climatizacion': return <Thermometer className="h-4 w-4" />;
      case 'iluminacion': return <Lightbulb className="h-4 w-4" />;
      case 'electrodomesticos': return <Wind className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getPrioridadColor = (prioridad: ConsejoAhorro['prioridad']) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'baja': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Consejos de Ahorro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    const consejosTop = consejos.slice(0, 2);
    
    return (
      <Card className="h-48 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Consejos de Ahorro
          </CardTitle>
          <CardDescription className="text-xs">
            Ahorro potencial: {ahorroTotal}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {consejosTop.map((consejo) => (
              <div key={consejo.id} className="flex items-start gap-2">
                <div className="mt-1">
                  {getCategoriaIcon(consejo.categoria)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{consejo.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    Ahorro: {consejo.ahorroEstimado}%
                  </p>
                </div>
              </div>
            ))}
            {consejos.length > 2 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{consejos.length - 2} consejos más
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-orange-600" />
                Consejos de Ahorro Energético
              </CardTitle>
              <CardDescription>
                Recomendaciones personalizadas basadas en el clima actual
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {ahorroTotal}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ahorro potencial
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Condiciones climáticas actuales */}
          {condicionesClimaticas && (
            <Card className="border-muted mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{condicionesClimaticas.temperatura}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{condicionesClimaticas.humedad}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{condicionesClimaticas.descripcion}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de consejos */}
          <div className="space-y-4">
            {consejos.map((consejo) => (
              <Card 
                key={consejo.id} 
                className={`border-muted transition-all ${
                  consejo.aplicado ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getCategoriaIcon(consejo.categoria)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{consejo.titulo}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={getPrioridadColor(consejo.prioridad)}>
                            {consejo.prioridad}
                          </Badge>
                          <Badge variant="outline" className="text-green-600">
                            -{consejo.ahorroEstimado}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {consejo.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Condición: {consejo.condicionClimatica}
                        </span>
                        <Button
                          variant={consejo.aplicado ? "default" : "outline"}
                          size="sm"
                          onClick={() => marcarComoAplicado(consejo.id)}
                          className={consejo.aplicado ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {consejo.aplicado ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aplicado
                            </>
                          ) : (
                            'Marcar como aplicado'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen de ahorro */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">
                    Potencial de Ahorro Total
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Aplicando todos los consejos recomendados
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {ahorroTotal}%
                  </div>
                  <p className="text-xs text-green-600">
                    en su factura mensual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de actualización */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={cargarConsejos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Consejos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}