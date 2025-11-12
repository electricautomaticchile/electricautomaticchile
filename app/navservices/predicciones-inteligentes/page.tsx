"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CloudSun, 
  TrendingUp, 
  BarChart3, 
  Zap,
  CheckCircle,
  ArrowRight,
  Thermometer,
  Calendar,
  Target
} from 'lucide-react';
import Link from "next/link";

export default function PrediccionesInteligentes() {
  const beneficios = [
    {
      icono: <TrendingUp className="h-5 w-5 text-green-600" />,
      titulo: "Reducción de Costos Operativos",
      descripcion: "Hasta 15% de ahorro en compra de energía mediante predicciones precisas",
      valor: "15%"
    },
    {
      icono: <Target className="h-5 w-5 text-blue-600" />,
      titulo: "Precisión de Predicciones",
      descripcion: "Algoritmos de IA con precisión superior al 85% en pronósticos",
      valor: "85%+"
    },
    {
      icono: <Calendar className="h-5 w-5 text-purple-600" />,
      titulo: "Planificación Proactiva",
      descripcion: "Anticipación de demanda hasta 7 días con alta confiabilidad",
      valor: "7 días"
    },
    {
      icono: <Zap className="h-5 w-5 text-orange-600" />,
      titulo: "Optimización de Red",
      descripcion: "Mejor distribución de carga y reducción de pérdidas técnicas",
      valor: "12%"
    }
  ];

  const caracteristicas = [
    {
      titulo: "Integración Meteorológica Avanzada",
      descripcion: "Conexión con múltiples fuentes de datos climáticos (OpenWeatherMap, WeatherAPI) para predicciones más precisas.",
      tecnologias: ["OpenWeatherMap API", "WeatherAPI", "Datos históricos", "Machine Learning"]
    },
    {
      titulo: "Análisis Predictivo por Zonas",
      descripcion: "Predicciones específicas por sectores geográficos considerando microclimas y patrones locales.",
      tecnologias: ["Segmentación geográfica", "Análisis de microclimas", "Patrones locales", "IA predictiva"]
    },
    {
      titulo: "Alertas Inteligentes",
      descripcion: "Sistema de alertas automáticas para picos de demanda, condiciones extremas y oportunidades de optimización.",
      tecnologias: ["Alertas en tiempo real", "Notificaciones push", "Dashboard web", "API REST"]
    },
    {
      titulo: "Optimización de Compra de Energía",
      descripcion: "Recomendaciones para compra de energía en mercados spot basadas en predicciones de demanda.",
      tecnologias: ["Análisis de mercado", "Optimización de costos", "Reportes automáticos", "Integración ERP"]
    }
  ];

  const casosUso = [
    {
      titulo: "Distribuidora Regional",
      problema: "Altos costos por compra de energía en horarios pico sin planificación",
      solucion: "Implementación de predictor de demanda con 72h de anticipación",
      resultado: "Reducción del 18% en costos de energía y mejora del 25% en planificación"
    },
    {
      titulo: "Empresa de Servicios Públicos",
      problema: "Dificultad para anticipar mantenimientos y gestión de carga",
      solucion: "Sistema predictivo integrado con factores climáticos y históricos",
      resultado: "Reducción del 30% en interrupciones no planificadas"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CloudSun className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Predicciones Inteligentes de Carga</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Sistema avanzado de predicción de demanda energética basado en inteligencia artificial, 
          datos meteorológicos y patrones históricos de consumo para optimizar la gestión de su red eléctrica.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            IA Avanzada
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Datos Meteorológicos
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Predicción 7 días
          </Badge>
        </div>
      </div>

      {/* Beneficios Clave */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-6 w-6 text-orange-600" />
            Beneficios Clave
          </CardTitle>
          <CardDescription>
            Impacto medible en la eficiencia operativa de su empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto">
                  {beneficio.icono}
                </div>
                <div className="text-2xl font-bold text-orange-600">
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

      {/* Características Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange-600" />
            Características Técnicas
          </CardTitle>
          <CardDescription>
            Tecnología de vanguardia para predicciones precisas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caracteristicas.map((caracteristica, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">{caracteristica.titulo}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {caracteristica.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {caracteristica.tecnologias.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Interactiva */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-orange-600" />
            Demo Interactiva
          </CardTitle>
          <CardDescription>
            Visualice cómo funciona nuestro sistema de predicciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Datos de Entrada</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Temperatura promedio</span>
                  <Badge>28°C</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Humedad relativa</span>
                  <Badge>75%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Consumo histórico</span>
                  <Badge>1,250 kWh</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm">Día de la semana</span>
                  <Badge>Lunes</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Predicción Generada</h4>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  1,485 kWh
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Demanda predicha para mañana
                </p>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Confianza: 92%</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Recomendación:</strong> Incrementar compra de energía en 18% 
                  para el período 14:00-18:00 debido a altas temperaturas previstas.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Casos de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-orange-600" />
            Casos de Éxito
          </CardTitle>
          <CardDescription>
            Resultados reales de nuestros clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {casosUso.map((caso, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">{caso.titulo}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-red-600 mb-2">Problema</h5>
                      <p className="text-sm text-muted-foreground">{caso.problema}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-600 mb-2">Solución</h5>
                      <p className="text-sm text-muted-foreground">{caso.solucion}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-600 mb-2">Resultado</h5>
                      <p className="text-sm text-muted-foreground">{caso.resultado}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            ¿Listo para optimizar su gestión energética?
          </h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Implemente nuestro sistema de predicciones inteligentes y comience a ver 
            resultados desde el primer mes. Nuestro equipo lo acompañará en todo el proceso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formulario">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
                Solicitar Demo Gratuita
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Descargar Caso de Estudio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}