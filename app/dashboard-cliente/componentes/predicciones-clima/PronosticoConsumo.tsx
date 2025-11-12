"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface PronosticoData {
  today: number;
  tomorrow: number;
  dayAfter: number;
  trend: 'up' | 'down' | 'stable';
  mainRecommendation: string;
  confidence: number;
  weather: {
    today: { temp: number; humidity: number; desc: string };
    tomorrow: { temp: number; humidity: number; desc: string };
    dayAfter: { temp: number; humidity: number; desc: string };
  };
}

interface PronosticoConsumoProps {
  reducida?: boolean;
  ubicacion?: { lat: number; lng: number };
}

export function PronosticoConsumo({ reducida = false, ubicacion }: PronosticoConsumoProps) {
  const [pronostico, setPronostico] = useState<PronosticoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Datos de ejemplo para desarrollo
  const datosEjemplo: PronosticoData = {
    today: 8.5,
    tomorrow: 12.3,
    dayAfter: 9.8,
    trend: 'up',
    mainRecommendation: 'Se esperan temperaturas más altas mañana. Configure el AC a 24°C para optimizar consumo.',
    confidence: 0.85,
    weather: {
      today: { temp: 22, humidity: 65, desc: 'Parcialmente nublado' },
      tomorrow: { temp: 28, humidity: 70, desc: 'Soleado y cálido' },
      dayAfter: { temp: 25, humidity: 60, desc: 'Mayormente soleado' }
    }
  };

  useEffect(() => {
    cargarPronostico();
  }, [ubicacion]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarPronostico = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se haría la llamada real a la API
      // const response = await fetch('/api/predicciones/consumo', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ubicacion })
      // });
      // const data = await response.json();
      
      setPronostico(datosEjemplo);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Error al cargar el pronóstico de consumo');
      console.error('Error loading consumption forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600 dark:text-red-400';
      case 'down': return 'text-green-600 dark:text-green-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up': return 'Aumento esperado';
      case 'down': return 'Reducción esperada';
      default: return 'Consumo estable';
    }
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            Pronóstico de Consumo
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

  if (error || !pronostico) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            Pronóstico de Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              {error || 'No se pudo cargar el pronóstico'}
            </p>
            <Button variant="outline" size="sm" onClick={cargarPronostico}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    return (
      <Card className="h-48 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            Pronóstico de Consumo
          </CardTitle>
          <CardDescription className="text-xs">
            Predicción basada en clima
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hoy</span>
              <span className="font-semibold">{pronostico.today} kWh</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mañana</span>
              <span className="font-semibold">{pronostico.tomorrow} kWh</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {getTrendIcon(pronostico.trend)}
              <span className={`text-xs font-medium ${getTrendColor(pronostico.trend)}`}>
                {getTrendText(pronostico.trend)}
              </span>
            </div>
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
                <Thermometer className="h-6 w-6 text-orange-600" />
                Pronóstico de Consumo Eléctrico
              </CardTitle>
              <CardDescription>
                Predicción basada en condiciones meteorológicas
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                Confianza: {Math.round(pronostico.confidence * 100)}%
              </Badge>
              <p className="text-xs text-muted-foreground">
                {lastUpdate && `Actualizado: ${lastUpdate.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Predicciones por día */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Hoy', consumption: pronostico.today, weather: pronostico.weather.today },
              { label: 'Mañana', consumption: pronostico.tomorrow, weather: pronostico.weather.tomorrow },
              { label: 'Pasado mañana', consumption: pronostico.dayAfter, weather: pronostico.weather.dayAfter }
            ].map((day, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-sm">{day.label}</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      {day.consumption} kWh
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        {day.weather.temp}°C
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Droplets className="h-3 w-3" />
                        {day.weather.humidity}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {day.weather.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tendencia */}
          <Card className="border-muted mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getTrendIcon(pronostico.trend)}
                <div>
                  <h4 className="font-semibold text-sm">Tendencia de Consumo</h4>
                  <p className={`text-sm ${getTrendColor(pronostico.trend)}`}>
                    {getTrendText(pronostico.trend)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendación principal */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2 text-orange-800 dark:text-orange-200">
                Recomendación Principal
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {pronostico.mainRecommendation}
              </p>
            </CardContent>
          </Card>

          {/* Botón de actualización */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={cargarPronostico} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Pronóstico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}