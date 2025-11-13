"use client";

import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Map,
  Shield,
  CheckCircle,
  ArrowRight,
  Eye,
  AlertTriangle,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function MapasInteligentes() {
  const mapRef = useRef<HTMLDivElement>(null);

  // Dispositivos con direcciones reales en Las Condes
  const dispositivos = [
    {
      lat: -33.4172,
      lng: -70.6064,
      status: "normal",
      nombre: "Parque Araucano, Av. Presidente Riesco 5330",
    },
    {
      lat: -33.4126,
      lng: -70.5756,
      status: "normal",
      nombre: "Mall Parque Arauco, Av. Kennedy 5413",
    },
    {
      lat: -33.4089,
      lng: -70.5447,
      status: "normal",
      nombre: "Clínica Las Condes, Lo Fontecilla 441",
    },
    {
      lat: -33.4152,
      lng: -70.6012,
      status: "sospechoso",
      nombre: "Costanera Center, Av. Andrés Bello 2425",
    },
    {
      lat: -33.4069,
      lng: -70.5733,
      status: "normal",
      nombre: "Municipalidad de Las Condes, Apoquindo 6570",
    },
    {
      lat: -33.4183,
      lng: -70.5989,
      status: "fraude",
      nombre: "Torre Titanium, Isidora Goyenechea 2800",
    },
    {
      lat: -33.4115,
      lng: -70.5486,
      status: "normal",
      nombre: "Estadio San Carlos de Apoquindo, Camino Las Flores 13000",
    },
    {
      lat: -33.4134,
      lng: -70.6089,
      status: "sospechoso",
      nombre: "Edificio Corporativo, Nueva Costanera 3736",
    },
    {
      lat: -33.4098,
      lng: -70.5912,
      status: "normal",
      nombre: "Hotel W Santiago, Isidora Goyenechea 3000",
    },
    {
      lat: -33.4201,
      lng: -70.5845,
      status: "fraude",
      nombre: "Edificio El Golf, Av. El Golf 99",
    },
  ];

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !(window as any).google?.maps) return;

      try {
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: -33.412, lng: -70.55 },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
        });

        // Agregar marcadores
        dispositivos.forEach((dispositivo) => {
          let color = "#10b981";
          if (dispositivo.status === "sospechoso") color = "#f59e0b";
          if (dispositivo.status === "fraude") color = "#ef4444";

          const marker = new (window as any).google.maps.Marker({
            position: { lat: dispositivo.lat, lng: dispositivo.lng },
            map: map,
            title: dispositivo.nombre,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <strong style="color: #000000;">${dispositivo.nombre}</strong><br/>
                <span style="color: ${color}; font-weight: bold;">
                  ${dispositivo.status === "normal" ? "Normal" : dispositivo.status === "sospechoso" ? "Sospechoso" : "Fraude"}
                </span>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    const loadGoogleMaps = () => {
      if (typeof window === "undefined" || !mapRef.current) return;

      // Verificar si ya está cargado
      if ((window as any).google?.maps) {
        initMap();
        return;
      }

      // Verificar si ya hay un script cargándose
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", initMap);
        return;
      }

      // Cargar el script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error("Error loading Google Maps");
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const caracteristicas = [
    {
      titulo: "Mapas Interactivos Avanzados",
      descripcion:
        "Visualización en tiempo real de toda su red eléctrica con múltiples capas de información.",
      tecnologias: [
        "Mapbox GL JS",
        "Google Maps Platform",
        "Clustering inteligente",
        "Capas personalizables",
      ],
    },
    {
      titulo: "Sistema Anti-fraude GPS",
      descripcion:
        "Detección automática de anomalías en ubicaciones de medidores usando IA y validación cruzada.",
      tecnologias: [
        "Validación GPS",
        "Street View API",
        "Detección de movimientos",
        "Análisis de patrones",
      ],
    },
    {
      titulo: "Geocoding Inteligente",
      descripción:
        "Validación automática de direcciones y coordenadas con múltiples fuentes de datos.",
      tecnologias: [
        "Google Geocoding",
        "OpenStreetMap",
        "Validación cruzada",
        "Cache inteligente",
      ],
    },
    {
      titulo: "Análisis Geoespacial",
      descripcion:
        "Análisis avanzado de patrones geográficos y optimización de la red de distribución.",
      tecnologias: [
        "Análisis de clusters",
        "Optimización de rutas",
        "Heatmaps",
        "Reportes geográficos",
      ],
    },
  ];

  const tiposAnomalias = [
    {
      tipo: "Ubicación Incorrecta",
      descripcion:
        "Medidor reporta ubicación diferente a la dirección registrada",
      frecuencia: "45%",
      severidad: "Alta",
      accion: "Inspección física inmediata",
    },
    {
      tipo: "Movimiento Imposible",
      descripcion: "Dispositivo reporta movimiento a velocidades imposibles",
      frecuencia: "28%",
      severidad: "Crítica",
      accion: "Verificación de integridad del dispositivo",
    },
    {
      tipo: "Manipulación de Señal",
      descripcion: "Patrones anómalos en la señal GPS del dispositivo",
      frecuencia: "18%",
      severidad: "Media",
      accion: "Revisión de conectividad y hardware",
    },
    {
      tipo: "Clonación de Dispositivo",
      descripcion: "Múltiples dispositivos con el mismo identificador",
      frecuencia: "9%",
      severidad: "Crítica",
      accion: "Investigación forense completa",
    },
  ];

  const casosExito = [
    {
      cliente: "Distribuidora Eléctrica Regional",
      problema: "Pérdidas no técnicas del 12% por conexiones fraudulentas",
      solucion: "Implementación de mapas inteligentes con GPS anti-fraude",
      resultado:
        "Reducción de pérdidas a 7.2% en 6 meses, ahorro de $2.3M USD anuales",
    },
    {
      cliente: "Cooperativa Eléctrica Rural",
      problema: "Dificultad para localizar medidores en zonas rurales extensas",
      solucion: "Sistema de mapas con geocoding preciso y rutas optimizadas",
      resultado:
        "Reducción del 35% en tiempo de mantenimiento, mejora del 50% en respuesta a emergencias",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Map className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">
            Mapas Inteligentes con GPS Anti-fraude
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Sistema avanzado de mapas interactivos con detección automática de
          fraudes GPS, geocoding inteligente y optimización de rutas para
          maximizar la eficiencia operativa y minimizar las pérdidas no
          técnicas.
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
                  <h4 className="font-semibold mb-3">
                    {caracteristica.titulo}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {caracteristica.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {caracteristica.tecnologias.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="text-xs"
                      >
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
                  <Card
                    key={index}
                    className="border-muted bg-white dark:bg-gray-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-sm">
                          {anomalia.tipo}
                        </h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {anomalia.frecuencia}
                          </Badge>
                          <Badge
                            variant={
                              anomalia.severidad === "Crítica"
                                ? "destructive"
                                : anomalia.severidad === "Alta"
                                  ? "default"
                                  : "secondary"
                            }
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
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">
                      Monitoreo Continuo
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Validación GPS cada 15 minutos con múltiples fuentes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Análisis con IA</h5>
                    <p className="text-xs text-muted-foreground">
                      Algoritmos de machine learning detectan patrones anómalos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">
                      Validación Cruzada
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Verificación con Street View y datos satelitales
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    4
                  </div>
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
              <h4 className="font-semibold">
                Mapa en Tiempo Real - Las Condes
              </h4>
              <div className="h-64 rounded-lg relative overflow-hidden border-2 border-border">
                {/* Google Maps con marcadores */}
                <div ref={mapRef} className="w-full h-full bg-muted"></div>

                {/* Leyenda superpuesta */}
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg text-xs z-10">
                  <div className="font-semibold mb-2">
                    Estado de Dispositivos
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Normal (6)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Sospechoso (2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Fraude (2)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Haz clic en los marcadores para ver detalles de cada dispositivo
              </p>
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
                      <h5 className="text-sm font-medium text-red-600 mb-2">
                        Problema
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {caso.problema}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-600 mb-2">
                        Solución
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {caso.solucion}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-600 mb-2">
                        Resultado
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {caso.resultado}
                      </p>
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
            Implemente nuestro sistema de mapas inteligentes con GPS anti-fraude
            y comience a reducir pérdidas desde el primer día. ROI garantizado
            en 6 meses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formulario">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Solicitar Demo en Vivo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Descargar Whitepaper
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
