"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wind, 
  BarChart3, 
  TrendingUp, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Droplets,
  Eye,
  Heart,
  Activity
} from 'lucide-react';
import Link from "next/link";

export default function AnalyticsAmbientales() {
  const beneficios = [
    {
      icono: <Lightbulb className="h-5 w-5 text-green-600" />,
      titulo: "Insights Únicos",
      descripcion: "Correlaciones exclusivas entre calidad del aire y patrones de consumo",
      valor: "Único"
    },
    {
      icono: <TrendingUp className="h-5 w-5 text-blue-600" />,
      titulo: "Ahorro Energético",
      descripcion: "Identificación de oportunidades de eficiencia basadas en factores ambientales",
      valor: "12%"
    },
    {
      icono: <Activity className="h-5 w-5 text-purple-600" />,
      titulo: "Monitoreo Continuo",
      descripcion: "Análisis 24/7 de múltiples estaciones de calidad del aire",
      valor: "24/7"
    },
    {
      icono: <Heart className="h-5 w-5 text-red-600" />,
      titulo: "Impacto en Salud",
      descripcion: "Reportes de sustentabilidad y impacto ambiental para stakeholders",
      valor: "ESG"
    }
  ];

  const correlaciones = [
    {
      factor: "PM2.5 vs Purificadores de Aire",
      correlacion: 88,
      descripcion: "Fuerte correlación entre niveles de PM2.5 y uso de purificadores domésticos",
      impacto: "Aumento del 25% en consumo durante días de alta contaminación"
    },
    {
      factor: "AQI vs Sistemas HVAC",
      correlacion: 72,
      descripcion: "Correlación significativa entre índice de calidad del aire y uso de climatización",
      impacto: "Incremento del 15% en filtración y ventilación forzada"
    },
    {
      factor: "Ozono vs Consumo Nocturno",
      correlacion: 65,
      descripcion: "Relación entre niveles de ozono y patrones de consumo en horarios nocturnos",
      impacto: "Variación del 8% en demanda base nocturna"
    },
    {
      factor: "Humedad + PM10 vs AC",
      correlacion: 79,
      descripcion: "Correlación combinada entre humedad, partículas gruesas y aire acondicionado",
      impacto: "Predicción mejorada del 18% en picos de demanda"
    }
  ];

  const fuentes = [
    {
      nombre: "OpenAQ",
      descripcion: "Red global de estaciones de monitoreo de calidad del aire",
      cobertura: "Global",
      parametros: ["PM2.5", "PM10", "NO2", "SO2", "O3", "CO"]
    },
    {
      nombre: "AirVisual",
      descripcion: "Datos de calidad del aire en tiempo real con alta precisión",
      cobertura: "Ciudades principales",
      parametros: ["AQI", "PM2.5", "PM10", "Pronósticos"]
    },
    {
      nombre: "Estaciones Locales",
      descripcion: "Integración con estaciones meteorológicas y de calidad del aire locales",
      cobertura: "Regional",
      parametros: ["Todos los contaminantes", "Datos históricos"]
    }
  ];

  const aplicaciones = [
    {
      titulo: "Optimización de Sistemas HVAC",
      descripcion: "Ajuste automático de filtración y ventilación basado en calidad del aire exterior",
      beneficios: ["Reducción de costos operativos", "Mejor calidad del aire interior", "Mantenimiento predictivo"]
    },
    {
      titulo: "Gestión de Demanda Inteligente",
      descripcion: "Predicción de picos de consumo considerando factores de calidad del aire",
      beneficios: ["Planificación mejorada", "Reducción de costos de energía", "Mejor gestión de red"]
    },
    {
      titulo: "Reportes de Sustentabilidad",
      descripcion: "Análisis del impacto ambiental del consumo energético y recomendaciones ESG",
      beneficios: ["Cumplimiento normativo", "Imagen corporativa", "Certificaciones verdes"]
    },
    {
      titulo: "Alertas de Salud Pública",
      descripcion: "Sistema de alertas para clientes sobre calidad del aire y recomendaciones de consumo",
      beneficios: ["Valor agregado al cliente", "Diferenciación competitiva", "Responsabilidad social"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wind className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Analytics Ambientales</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Análisis avanzado de correlaciones entre calidad del aire y patrones de consumo eléctrico. 
          Obtenga insights únicos para optimizar su red energética y generar valor agregado para sus clientes.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Calidad del Aire
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Correlaciones IA
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Reportes ESG
          </Badge>
        </div>
      </div>

      {/* Beneficios Clave */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Beneficios Clave
          </CardTitle>
          <CardDescription>
            Valor agregado único en el mercado energético
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto">
                  {beneficio.icono}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {beneficio.valor}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{beneficio.titulo}</h4>
                  <p className="text-xs text-muted-foreground">{beneficio.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Correlaciones Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Correlaciones Identificadas
          </CardTitle>
          <CardDescription>
            Patrones descubiertos mediante análisis de big data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {correlaciones.map((item, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{item.factor}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{item.descripcion}</p>
                      <p className="text-sm text-blue-600 font-medium">{item.impacto}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {item.correlacion}%
                      </div>
                      <Badge variant={item.correlacion > 80 ? "default" : item.correlacion > 70 ? "secondary" : "outline"}>
                        {item.correlacion > 80 ? "Fuerte" : item.correlacion > 70 ? "Moderada" : "Débil"}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.correlacion}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuentes de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Fuentes de Datos
          </CardTitle>
          <CardDescription>
            Integración con múltiples fuentes de calidad del aire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fuentes.map((fuente, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">{fuente.nombre}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{fuente.descripcion}</p>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-blue-600">Cobertura:</span>
                      <Badge variant="outline" className="ml-2 text-xs">{fuente.cobertura}</Badge>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-600">Parámetros:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {fuente.parametros.map((param, paramIndex) => (
                          <Badge key={paramIndex} variant="secondary" className="text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo de Correlación */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-600" />
            Ejemplo de Correlación en Tiempo Real
          </CardTitle>
          <CardDescription>
            Visualice cómo los factores ambientales impactan el consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Condiciones Ambientales Actuales</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">PM2.5</span>
                  </div>
                  <Badge variant="destructive">45 μg/m³</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">AQI</span>
                  </div>
                  <Badge variant="secondary">Insalubre</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Humedad</span>
                  </div>
                  <Badge>78%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Impacto Predicho en Consumo</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Purificadores de Aire</span>
                    <span className="text-lg font-bold text-red-600">+28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sistemas HVAC</span>
                    <span className="text-lg font-bold text-orange-600">+15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Ventilación Natural</span>
                    <span className="text-lg font-bold text-green-600">-35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aplicaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            Aplicaciones Prácticas
          </CardTitle>
          <CardDescription>
            Casos de uso reales para su negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aplicaciones.map((app, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">{app.titulo}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{app.descripcion}</p>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-blue-600">Beneficios:</h5>
                    <ul className="space-y-1">
                      {app.beneficios.map((beneficio, bIndex) => (
                        <li key={bIndex} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Descubra correlaciones únicas en su red eléctrica
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Sea pionero en analytics ambientales para el sector energético. 
            Nuestro sistema le dará ventajas competitivas únicas y nuevas fuentes de valor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formulario">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Solicitar Análisis Piloto
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Ver Casos de Estudio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}