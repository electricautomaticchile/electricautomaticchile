"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Shield, 
  MapPin, 
  Navigation,
  CheckCircle,
  ArrowRight,
  Eye,
  AlertTriangle,
  TrendingDown,
  Users,
  Activity,
  Zap
} from 'lucide-react';
import Link from "next/link";

export default function MapasInteligentes() {
  const beneficios = [
    {
      icono: <Shield className="h-5 w-5 text-red-600" />,
      titulo: "Reducción de Fraudes",
      descripcion: "Detección automática de anomalías GPS y ubicaciones sospechosas",
      valor: "25%"
    },
    {
      icono: <TrendingDown className="h-5 w-5 text-green-600" />,
      titulo: "Reducción de Pérdidas",
      descripcion: "Menor pérdida de energía por conexiones no autorizadas",
      valor: "18%"
    },
    {
      icono: <Navigation className="h-5 w-5 text-blue-600" />,
      titulo: "Optimización de Rutas",
      descripcion: "Rutas optimizadas para mantenimiento y lecturas de medidores",
      valor: "30%"
    },
    {
      icono: <Activity className="h-5 w-5 text-purple-600" />,
      titulo: "Tiempo de Respuesta",
      descripcion: "Respuesta más rápida a incidencias y emergencias",
      valor: "40%"
    }
  ];

  const caracteristicas = [
    {
      titulo: "Mapas Interactivos Avanzados",
      descripcion: "Visualización en tiempo real de toda su red eléctrica con múltiples capas de información.",
      tecnologias: ["Mapbox GL JS", "Google Maps Platform", "Clustering inteligente", "Capas personalizables"]
    },
    {
      titulo: "Sistema Anti-fraude GPS",
      descripcion: "Detección automática de anomalías en ubicaciones de medidores usando IA y validación cruzada.",
      tecnologias: ["Validación GPS", "Street View API", "Detección de movimientos", "Análisis de patrones"]
    },
    {
      titulo: "Geocoding Inteligente",
      descripción: "Validación automática de direcciones y coordenadas con múltiples fuentes de datos.",
      tecnologias: ["Google Geocoding", "OpenStreetMap", "Validación cruzada", "Cache inteligente"]
    },
    {
      titulo: "Análisis Geoespacial",
      descripcion: "Análisis avanzado de patrones geográficos y optimización de la red de distribución.",
      tecnologias: ["Análisis de clusters", "Optimización de rutas", "Heatmaps", "Reportes geográficos"]
    }
  ];

  const tiposAnomalias = [
    {
      tipo: "Ubicación Incorrecta",
      descripcion: "Medidor reporta ubicación diferente a la dirección registrada",
      frecuencia: "45%",
      severidad: "Alta",
      accion: "Inspección física inmediata"
    },
    {
      tipo: "Movimiento Imposible",
      descripcion: "Dispositivo reporta movimiento a velocidades imposibles",
      frecuencia: "28%",
      severidad: "Crítica",
      accion: "Verificación de integridad del dispositivo"
    },
    {
      tipo: "Manipulación de Señal",
      descripcion: "Patrones anómalos en la señal GPS del dispositivo",
      frecuencia: "18%",
      severidad: "Media",
      accion: "Revisión de conectividad y hardware"
    },
    {
      tipo: "Clonación de Dispositivo",
      descripcion: "Múltiples dispositivos con el mismo identificador",
      frecuencia: "9%",
      severidad: "Crítica",
      accion: "Investigación forense completa"
    }
  ];

  const casosExito = [
    {
      cliente: "Distribuidora Eléctrica Regional",
      problema: "Pérdidas no técnicas del 12% por conexiones fraudulentas",
      solucion: "Implementación de mapas inteligentes con GPS anti-fraude",
      resultado: "Reducción de pérdidas a 7.2% en 6 meses, ahorro de $2.3M USD anuales"
    },
    {
      cliente: "Cooperativa Eléctrica Rural",
      problema: "Dificultad para localizar medidores en zonas rurales extensas",
      solucion: "Sistema de mapas con geocoding preciso y rutas optimizadas",
      resultado: "Reducción del 35% en tiempo de mantenimiento, mejora del 50% en respuesta a emergencias"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Map className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Mapas Inteligentes con GPS Anti-fraude</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Sistema avanzado de mapas interactivos con detección automática de fraudes GPS, 
          geocoding inteligente y optimización de rutas para maximizar la eficiencia operativa 
          y minimizar las pérdidas no técnicas.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            GPS Anti-fraude
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Detección IA
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Mapas Interactivos
          </Badge>
        </div>
      </div>

      {/* Beneficios Clave */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Beneficios Clave
          </CardTitle>
          <CardDescription>
            Impacto directo en la rentabilidad y eficiencia operativa
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

      {/* Características Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Map className="h-6 w-6 text-blue-600" />
            Características Técnicas
          </CardTitle>
          <CardDescription>
            Tecnología de vanguardia para mapas inteligentes
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

      {/* Sistema Anti-fraude */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Sistema Anti-fraude GPS
          </CardTitle>
          <CardDescription>
            Detección automática de anomalías y fraudes en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Tipos de Anomalías Detectadas</h4>
              <div className="space-y-3">
                {tiposAnomalias.map((anomalia, index) => (
                  <Card key={index} className="border-muted bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-sm">{anomalia.tipo}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {anomalia.frecuencia}
                          </Badge>
                          <Badge 
                            variant={anomalia.severidad === 'Crítica' ? 'destructive' : 
                                   anomalia.severidad === 'Alta' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {anomalia.severidad}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {anomalia.descripcion}
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        Acción: {anomalia.accion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Proceso de Detección</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
                  <div>
                    <h5 className="font-semibold text-sm">Monitoreo Continuo</h5>
                    <p className="text-xs text-muted-foreground">
                      Validación GPS cada 15 minutos con múltiples fuentes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</div>
                  <div>
                    <h5 className="font-semibold text-sm">Análisis con IA</h5>
                    <p className="text-xs text-muted-foreground">
                      Algoritmos de machine learning detectan patrones anómalos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</div>
                  <div>
                    <h5 className="font-semibold text-sm">Validación Cruzada</h5>
                    <p className="text-xs text-muted-foreground">
                      Verificación con Street View y datos satelitales
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</div>
                  <div>
                    <h5 className="font-semibold text-sm">Alerta Automática</h5>
                    <p className="text-xs text-muted-foreground">
                      Notificación inmediata al equipo de investigación
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Interactiva */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Demo Interactiva del Sistema
          </CardTitle>
          <CardDescription>
            Visualice cómo funciona nuestro sistema de mapas inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Panel de Control</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Medidores Monitoreados</span>
                  </div>
                  <Badge>1,247</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Anomalías Detectadas</span>
                  </div>
                  <Badge variant="destructive">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Fraudes Confirmados</span>
                  </div>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Ahorro Estimado</span>
                  </div>
                  <Badge className="bg-green-600">$45,200</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Mapa en Tiempo Real</h4>
              <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg relative overflow-hidden">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 p-4">
                  {/* Medidores simulados */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-12 left-8 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  
                  {/* Leyenda */}
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Normal</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Sospechoso</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Fraude</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Casos de Éxito */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Casos de Éxito
          </CardTitle>
          <CardDescription>
            Resultados reales de nuestros clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {casosExito.map((caso, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">{caso.cliente}</h4>
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
      <Card className="border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Proteja su red eléctrica con tecnología de vanguardia
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Implemente nuestro sistema de mapas inteligentes con GPS anti-fraude y 
            comience a reducir pérdidas desde el primer día. ROI garantizado en 6 meses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formulario">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Solicitar Demo en Vivo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Descargar Whitepaper
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}