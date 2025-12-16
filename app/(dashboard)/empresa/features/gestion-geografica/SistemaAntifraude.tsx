"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Download,
  Eye,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';

interface AnomaliaGPS {
  id: string;
  meterId: string;
  customerName: string;
  type: 'location_mismatch' | 'impossible_movement' | 'signal_tampering' | 'device_cloning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  description: string;
  coordinates: { lat: number; lng: number };
  expectedCoordinates?: { lat: number; lng: number };
  distance?: number;
  evidence: {
    streetViewUrl?: string;
    satelliteImageUrl?: string;
    movementPattern?: Array<{ lat: number; lng: number }>;
    signalStrength?: number;
  };
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  investigationNotes?: string;
  assignedTo?: string;
}

interface EstadisticasAntifraude {
  totalAnomalias: number;
  anomaliasCriticas: number;
  fraudesConfirmados: number;
  tasaDeteccion: number;
  ahorroEstimado: number;
  tiempoPromedioResolucion: number;
}

interface SistemaAntifraude {
  reducida?: boolean;
}

export function SistemaAntifraude({ reducida = false }: SistemaAntifraude) {
  const [anomalias, setAnomalias] = useState<AnomaliaGPS[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAntifraude | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('pending');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState<'anomalias' | 'investigacion' | 'estadisticas'>('anomalias');

  // TODO: Conectar con API real
  const datosAnomalias: AnomaliaGPS[] = [
    {
      id: 'anom_001',
      meterId: 'meter_003',
      customerName: 'Carlos Silva',
      type: 'location_mismatch',
      severity: 'critical',
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Ubicación GPS no coincide con dirección registrada (850m de diferencia)',
      coordinates: { lat: -33.4569, lng: -70.6483 },
      expectedCoordinates: { lat: -33.4489, lng: -70.6693 },
      distance: 850,
      evidence: {
        streetViewUrl: 'https://maps.googleapis.com/maps/api/streetview?...',
        satelliteImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?...'
      },
      status: 'investigating',
      assignedTo: 'Inspector Juan Pérez'
    },
    {
      id: 'anom_002',
      meterId: 'meter_002',
      customerName: 'María González',
      type: 'impossible_movement',
      severity: 'high',
      detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: 'Movimiento imposible detectado: 2500m/h (500m en 12min)',
      coordinates: { lat: -33.4372, lng: -70.6506 },
      distance: 500,
      evidence: {
        movementPattern: [
          { lat: -33.4372, lng: -70.6506 },
          { lat: -33.4420, lng: -70.6550 }
        ]
      },
      status: 'pending'
    },
    {
      id: 'anom_003',
      meterId: 'meter_005',
      customerName: 'Roberto Díaz',
      type: 'signal_tampering',
      severity: 'medium',
      detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'Patrón anómalo: 4 anomalías en las últimas 24 horas',
      coordinates: { lat: -33.4250, lng: -70.6100 },
      evidence: {
        signalStrength: 15
      },
      status: 'resolved',
      investigationNotes: 'Problema de conectividad resuelto. Antena GPS reemplazada.'
    },
    {
      id: 'anom_004',
      meterId: 'meter_007',
      customerName: 'Ana Torres',
      type: 'device_cloning',
      severity: 'critical',
      detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      description: 'Número de serie del dispositivo inválido o sospechoso',
      coordinates: { lat: -33.4100, lng: -70.5900 },
      evidence: {},
      status: 'investigating',
      assignedTo: 'Inspector María López'
    }
  ];

  const estadisticasData: EstadisticasAntifraude = {
    totalAnomalias: 47,
    anomaliasCriticas: 8,
    fraudesConfirmados: 12,
    tasaDeteccion: 94.2,
    ahorroEstimado: 125000, // USD
    tiempoPromedioResolucion: 18 // horas
  };

  useEffect(() => {
    cargarDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarDatos = async () => {
    setLoading(true);
    
    try {
      // TODO: Llamar a API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnomalias(datosAnomalias);
      setEstadisticas(estadisticasData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const anomaliasFiltradas = anomalias.filter(anomalia => {
    const matchesSeverity = filtroSeveridad === 'todos' || anomalia.severity === filtroSeveridad;
    const matchesStatus = filtroEstado === 'todos' || anomalia.status === filtroEstado;
    const matchesSearch = busqueda === '' || 
      anomalia.customerName.toLowerCase().includes(busqueda.toLowerCase()) ||
      anomalia.description.toLowerCase().includes(busqueda.toLowerCase()) ||
      anomalia.meterId.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityInfo = (severity: AnomaliaGPS['severity']) => {
    switch (severity) {
      case 'low':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'Baja' };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', text: 'Media' };
      case 'high':
        return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', text: 'Alta' };
      case 'critical':
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', text: 'Crítica' };
    }
  };

  const getStatusInfo = (status: AnomaliaGPS['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', text: 'Pendiente' };
      case 'investigating':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'Investigando' };
      case 'resolved':
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', text: 'Resuelto' };
      case 'false_positive':
        return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', text: 'Falso Positivo' };
    }
  };

  const getTypeInfo = (type: AnomaliaGPS['type']) => {
    switch (type) {
      case 'location_mismatch':
        return { icon: <MapPin className="h-4 w-4" />, text: 'Ubicación Incorrecta' };
      case 'impossible_movement':
        return { icon: <Activity className="h-4 w-4" />, text: 'Movimiento Imposible' };
      case 'signal_tampering':
        return { icon: <AlertTriangle className="h-4 w-4" />, text: 'Manipulación de Señal' };
      case 'device_cloning':
        return { icon: <Shield className="h-4 w-4" />, text: 'Clonación de Dispositivo' };
    }
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-64" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Sistema Anti-fraude GPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    const anomaliasPendientes = anomalias.filter(a => a.status === 'pending').length;
    const anomaliasCriticas = anomalias.filter(a => a.severity === 'critical').length;

    return (
      <Card className="h-64 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Sistema Anti-fraude GPS
          </CardTitle>
          <CardDescription className="text-xs">
            Detección automática de anomalías
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {anomaliasCriticas}
                </div>
                <p className="text-xs text-muted-foreground">Críticas</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {anomaliasPendientes}
                </div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>

            {estadisticas && (
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800 dark:text-green-200">
                    Tasa de Detección
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {estadisticas.tasaDeteccion}%
                </div>
              </div>
            )}

            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  Ahorro Estimado
                </span>
              </div>
              <div className="text-sm font-bold text-blue-600">
                ${estadisticas?.ahorroEstimado.toLocaleString()}
              </div>
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
                <Shield className="h-6 w-6 text-red-600" />
                Sistema Anti-fraude GPS
              </CardTitle>
              <CardDescription>
                Detección automática y análisis de anomalías en ubicaciones de medidores
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
              <Button variant="outline" size="sm" onClick={cargarDatos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estadísticas principales */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.totalAnomalias}</div>
                  <p className="text-xs text-muted-foreground">Total Anomalías</p>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{estadisticas.anomaliasCriticas}</div>
                  <p className="text-xs text-muted-foreground">Críticas</p>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{estadisticas.fraudesConfirmados}</div>
                  <p className="text-xs text-muted-foreground">Fraudes</p>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{estadisticas.tasaDeteccion}%</div>
                  <p className="text-xs text-muted-foreground">Detección</p>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${(estadisticas.ahorroEstimado / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-muted-foreground">Ahorro USD</p>
                </CardContent>
              </Card>
              <Card className="border-muted">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{estadisticas.tiempoPromedioResolucion}h</div>
                  <p className="text-xs text-muted-foreground">Resolución</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Controles de filtrado */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por cliente, medidor o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroSeveridad} onValueChange={setFiltroSeveridad}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="critical">Críticas</SelectItem>
                  <SelectItem value="high">Altas</SelectItem>
                  <SelectItem value="medium">Medias</SelectItem>
                  <SelectItem value="low">Bajas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="investigating">Investigando</SelectItem>
                <SelectItem value="resolved">Resueltos</SelectItem>
                <SelectItem value="false_positive">Falsos Positivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs de contenido */}
          <Tabs value={vistaActiva} onValueChange={(value) => setVistaActiva(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="anomalias">Anomalías Detectadas</TabsTrigger>
              <TabsTrigger value="investigacion">Panel de Investigación</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas Avanzadas</TabsTrigger>
            </TabsList>

            <TabsContent value="anomalias" className="space-y-4">
              <div className="space-y-4">
                {anomaliasFiltradas.map((anomalia) => {
                  const severityInfo = getSeverityInfo(anomalia.severity);
                  const statusInfo = getStatusInfo(anomalia.status);
                  const typeInfo = getTypeInfo(anomalia.type);

                  return (
                    <Card key={anomalia.id} className="border-muted">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {typeInfo.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{anomalia.customerName}</h4>
                                <Badge className={severityInfo.color}>
                                  {severityInfo.text}
                                </Badge>
                                <Badge variant="outline" className={statusInfo.color}>
                                  {statusInfo.text}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Medidor: {anomalia.meterId} • {typeInfo.text}
                              </p>
                              <p className="text-sm mb-3">{anomalia.description}</p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {anomalia.detectedAt.toLocaleString('es-CL')}
                                </div>
                                {anomalia.distance && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {anomalia.distance}m de diferencia
                                  </div>
                                )}
                                {anomalia.assignedTo && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {anomalia.assignedTo}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {anomalia.evidence.streetViewUrl && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Street View
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Investigar
                            </Button>
                          </div>
                        </div>

                        {anomalia.investigationNotes && (
                          <div className="p-3 bg-muted rounded-lg">
                            <h5 className="text-sm font-medium mb-1">Notas de Investigación:</h5>
                            <p className="text-sm text-muted-foreground">
                              {anomalia.investigationNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {anomaliasFiltradas.length === 0 && (
                  <Card className="border-muted">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No hay anomalías que mostrar</h3>
                      <p className="text-sm text-muted-foreground">
                        No se encontraron anomalías con los filtros aplicados.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="investigacion" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Casos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {anomalias.filter(a => a.status === 'investigating').map((anomalia) => (
                        <div key={anomalia.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{anomalia.customerName}</h4>
                            <Badge className={getSeverityInfo(anomalia.severity).color}>
                              {getSeverityInfo(anomalia.severity).text}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {anomalia.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Asignado a: {anomalia.assignedTo}
                            </span>
                            <Button size="sm" variant="outline">
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      ))}
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
                        Ver Street View
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
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tipos de Anomalías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ubicación Incorrecta</span>
                        <Badge variant="outline">45%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Movimiento Imposible</span>
                        <Badge variant="outline">28%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manipulación de Señal</span>
                        <Badge variant="outline">18%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Clonación de Dispositivo</span>
                        <Badge variant="outline">9%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tendencias Mensuales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Gráfico de tendencias de detección
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}