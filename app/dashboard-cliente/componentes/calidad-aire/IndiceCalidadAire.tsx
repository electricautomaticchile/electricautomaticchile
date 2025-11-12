"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wind, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Thermometer,
  Droplets,
  Eye,
  Heart
} from 'lucide-react';

interface CalidadAireData {
  aqi: number; // 1-5 scale
  nivel: 'bueno' | 'moderado' | 'insalubre_sensibles' | 'insalubre' | 'muy_insalubre';
  pm25: number;
  pm10: number;
  descripcion: string;
  recomendaciones: string[];
  impactoConsumo: {
    purificadores: number; // % aumento
    hvac: number; // % aumento
    ventilacion: number; // % cambio
  };
  timestamp: Date;
}

interface IndiceCalidadAireProps {
  reducida?: boolean;
  ubicacion?: { lat: number; lng: number };
  onImpactoConsumo?: (impacto: CalidadAireData['impactoConsumo']) => void;
}

export function IndiceCalidadAire({ 
  reducida = false, 
  ubicacion,
  onImpactoConsumo 
}: IndiceCalidadAireProps) {
  const [calidadAire, setCalidadAire] = useState<CalidadAireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de ejemplo para desarrollo
  const datosEjemplo: CalidadAireData = {
    aqi: 3,
    nivel: 'insalubre_sensibles',
    pm25: 45.2,
    pm10: 78.5,
    descripcion: 'Calidad del aire insalubre para grupos sensibles',
    recomendaciones: [
      'Mantenga ventanas cerradas',
      'Use purificadores de aire en interiores',
      'Limite actividades al aire libre',
      'Considere usar mascarilla al salir'
    ],
    impactoConsumo: {
      purificadores: 25,
      hvac: 15,
      ventilacion: -30
    },
    timestamp: new Date()
  };

  useEffect(() => {
    cargarCalidadAire();
  }, [ubicacion]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (calidadAire && onImpactoConsumo) {
      onImpactoConsumo(calidadAire.impactoConsumo);
    }
  }, [calidadAire, onImpactoConsumo]);

  const cargarCalidadAire = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // En producción, aquí se haría la llamada real a la API
      // const response = await fetch('/api/calidad-aire', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ubicacion })
      // });
      // const data = await response.json();
      
      setCalidadAire(datosEjemplo);
    } catch (err) {
      setError('Error al cargar datos de calidad del aire');
      console.error('Error loading air quality data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNivelInfo = (nivel: CalidadAireData['nivel']) => {
    switch (nivel) {
      case 'bueno':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          icon: <CheckCircle className="h-4 w-4" />,
          texto: 'Bueno'
        };
      case 'moderado':
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          icon: <Eye className="h-4 w-4" />,
          texto: 'Moderado'
        };
      case 'insalubre_sensibles':
        return {
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          icon: <AlertTriangle className="h-4 w-4" />,
          texto: 'Insalubre para sensibles'
        };
      case 'insalubre':
        return {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          icon: <AlertTriangle className="h-4 w-4" />,
          texto: 'Insalubre'
        };
      case 'muy_insalubre':
        return {
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          icon: <Heart className="h-4 w-4" />,
          texto: 'Muy insalubre'
        };
    }
  };

  const getAQIProgress = (aqi: number) => {
    return (aqi / 5) * 100;
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-600" />
            Calidad del Aire
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

  if (error || !calidadAire) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-600" />
            Calidad del Aire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              {error || 'No se pudieron cargar los datos'}
            </p>
            <Button variant="outline" size="sm" onClick={cargarCalidadAire}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nivelInfo = getNivelInfo(calidadAire.nivel);

  if (reducida) {
    return (
      <Card className="h-48 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-600" />
            Calidad del Aire
          </CardTitle>
          <CardDescription className="text-xs">
            AQI: {calidadAire.aqi}/5
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {nivelInfo.icon}
              <span className={`font-semibold text-sm ${nivelInfo.color}`}>
                {nivelInfo.texto}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>PM2.5</span>
                <span>{calidadAire.pm25} μg/m³</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>PM10</span>
                <span>{calidadAire.pm10} μg/m³</span>
              </div>
            </div>
            <div className="pt-2">
              <Progress value={getAQIProgress(calidadAire.aqi)} className="h-2" />
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
                <Wind className="h-6 w-6 text-blue-600" />
                Índice de Calidad del Aire
              </CardTitle>
              <CardDescription>
                Monitoreo en tiempo real de la calidad del aire exterior
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${nivelInfo.bgColor}`}>
                {nivelInfo.icon}
                <span className={`font-semibold ${nivelInfo.color}`}>
                  {nivelInfo.texto}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Actualizado: {calidadAire.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Índice AQI principal */}
          <Card className="border-muted mb-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {calidadAire.aqi}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Índice AQI (1-5)
                  </div>
                </div>
                <Progress 
                  value={getAQIProgress(calidadAire.aqi)} 
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground">
                  {calidadAire.descripcion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detalles de contaminantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">PM2.5</h4>
                    <p className="text-xs text-muted-foreground">
                      Partículas finas
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {calidadAire.pm25}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      μg/m³
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min((calidadAire.pm25 / 100) * 100, 100)} 
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">PM10</h4>
                    <p className="text-xs text-muted-foreground">
                      Partículas gruesas
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {calidadAire.pm10}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      μg/m³
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min((calidadAire.pm10 / 150) * 100, 100)} 
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>
          </div>

          {/* Impacto en consumo energético */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                Impacto en Consumo Energético
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wind className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Purificadores</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    +{calidadAire.impactoConsumo.purificadores}%
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Uso recomendado
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">HVAC</span>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    +{calidadAire.impactoConsumo.hvac}%
                  </div>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    Filtración extra
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Droplets className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Ventilación</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {calidadAire.impactoConsumo.ventilacion}%
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Reducir apertura
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calidadAire.recomendaciones.map((recomendacion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <p className="text-sm">{recomendacion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botón de actualización */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={cargarCalidadAire} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Datos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}