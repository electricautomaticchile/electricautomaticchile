"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Map, 
  Layers, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Zap,
  Users,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';

interface MedidorMapa {
  id: string;
  customerId: string;
  customerName: string;
  coordinates: { lat: number; lng: number };
  address: string;
  status: 'active' | 'inactive' | 'suspicious' | 'fraud_detected';
  consumption: number;
  lastReading: Date;
  anomalies: number;
  deviceInfo: {
    serialNumber: string;
    model: string;
  };
}

interface MapaLayer {
  id: string;
  name: string;
  type: 'meters' | 'consumption' | 'anomalies' | 'weather' | 'zones';
  visible: boolean;
  color: string;
}

interface MapaInteractivoProps {
  reducida?: boolean;
}

export function MapaInteractivo({ reducida = false }: MapaInteractivoProps) {
  const [medidores, setMedidores] = useState<MedidorMapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'mapa' | 'lista' | 'clusters'>('mapa');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [capasActivas, setCapasActivas] = useState<MapaLayer[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo para desarrollo
  const datosEjemplo: MedidorMapa[] = [
    {
      id: 'meter_001',
      customerId: 'cust_001',
      customerName: 'Juan Pérez',
      coordinates: { lat: -33.4489, lng: -70.6693 },
      address: 'Av. Providencia 1234, Santiago',
      status: 'active',
      consumption: 245.8,
      lastReading: new Date(Date.now() - 2 * 60 * 60 * 1000),
      anomalies: 0,
      deviceInfo: { serialNumber: 'EAC001234', model: 'SmartMeter Pro' }
    },
    {
      id: 'meter_002',
      customerId: 'cust_002',
      customerName: 'María González',
      coordinates: { lat: -33.4372, lng: -70.6506 },
      address: 'Las Condes 567, Santiago',
      status: 'suspicious',
      consumption: 189.2,
      lastReading: new Date(Date.now() - 4 * 60 * 60 * 1000),
      anomalies: 2,
      deviceInfo: { serialNumber: 'EAC001235', model: 'SmartMeter Pro' }
    },
    {
      id: 'meter_003',
      customerId: 'cust_003',
      customerName: 'Carlos Silva',
      coordinates: { lat: -33.4569, lng: -70.6483 },
      address: 'Ñuñoa 890, Santiago',
      status: 'fraud_detected',
      consumption: 0,
      lastReading: new Date(Date.now() - 24 * 60 * 60 * 1000),
      anomalies: 5,
      deviceInfo: { serialNumber: 'EAC001236', model: 'SmartMeter Pro' }
    },
    {
      id: 'meter_004',
      customerId: 'cust_004',
      customerName: 'Ana Martínez',
      coordinates: { lat: -33.4378, lng: -70.6504 },
      address: 'Vitacura 321, Santiago',
      status: 'active',
      consumption: 312.5,
      lastReading: new Date(Date.now() - 1 * 60 * 60 * 1000),
      anomalies: 0,
      deviceInfo: { serialNumber: 'EAC001237', model: 'SmartMeter Pro' }
    }
  ];

  const capasDisponibles: MapaLayer[] = [
    { id: 'meters', name: 'Medidores', type: 'meters', visible: true, color: '#3b82f6' },
    { id: 'consumption', name: 'Consumo', type: 'consumption', visible: false, color: '#f59e0b' },
    { id: 'anomalies', name: 'Anomalías', type: 'anomalies', visible: true, color: '#ef4444' },
    { id: 'weather', name: 'Clima', type: 'weather', visible: false, color: '#10b981' },
    { id: 'zones', name: 'Zonas', type: 'zones', visible: false, color: '#8b5cf6' }
  ];

  useEffect(() => {
    cargarDatos();
    setCapasActivas(capasDisponibles);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarDatos = async () => {
    setLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMedidores(datosEjemplo);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const medidoresFiltrados = medidores.filter(medidor => {
    const matchesStatus = filtroEstado === 'todos' || medidor.status === filtroEstado;
    const matchesSearch = busqueda === '' || 
      medidor.customerName.toLowerCase().includes(busqueda.toLowerCase()) ||
      medidor.address.toLowerCase().includes(busqueda.toLowerCase()) ||
      medidor.deviceInfo.serialNumber.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const toggleCapa = (capaId: string) => {
    setCapasActivas(prev => prev.map(capa => 
      capa.id === capaId ? { ...capa, visible: !capa.visible } : capa
    ));
  };

  const getStatusInfo = (status: MedidorMapa['status']) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-500', text: 'Activo', textColor: 'text-green-600' };
      case 'inactive':
        return { color: 'bg-gray-500', text: 'Inactivo', textColor: 'text-gray-600' };
      case 'suspicious':
        return { color: 'bg-yellow-500', text: 'Sospechoso', textColor: 'text-yellow-600' };
      case 'fraud_detected':
        return { color: 'bg-red-500', text: 'Fraude', textColor: 'text-red-600' };
    }
  };

  const getEstadisticas = () => {
    const total = medidores.length;
    const activos = medidores.filter(m => m.status === 'active').length;
    const sospechosos = medidores.filter(m => m.status === 'suspicious').length;
    const fraudes = medidores.filter(m => m.status === 'fraud_detected').length;
    const consumoTotal = medidores.reduce((sum, m) => sum + m.consumption, 0);
    const anomaliasTotal = medidores.reduce((sum, m) => sum + m.anomalies, 0);

    return { total, activos, sospechosos, fraudes, consumoTotal, anomaliasTotal };
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-64" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Mapa Interactivo
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

  const stats = getEstadisticas();

  if (reducida) {
    return (
      <Card className="h-64 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Mapa Interactivo
          </CardTitle>
          <CardDescription className="text-xs">
            {stats.total} medidores monitoreados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {stats.activos}
                </div>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {stats.fraudes}
                </div>
                <p className="text-xs text-muted-foreground">Fraudes</p>
              </div>
            </div>

            {stats.anomaliasTotal > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-700 dark:text-red-300">
                  {stats.anomaliasTotal} anomalías detectadas
                </span>
              </div>
            )}

            <div className="h-12 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center">
              <Map className="h-6 w-6 text-blue-600" />
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
                <Map className="h-6 w-6 text-blue-600" />
                Mapa Interactivo de Red Eléctrica
              </CardTitle>
              <CardDescription>
                Visualización geográfica de medidores con detección de anomalías GPS
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={cargarDatos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Medidores</p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
                <p className="text-xs text-muted-foreground">Activos</p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.sospechosos}</div>
                <p className="text-xs text-muted-foreground">Sospechosos</p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.fraudes}</div>
                <p className="text-xs text-muted-foreground">Fraudes</p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(stats.consumoTotal / 1000).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">MWh Total</p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.anomaliasTotal}</div>
                <p className="text-xs text-muted-foreground">Anomalías</p>
              </CardContent>
            </Card>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar medidor, cliente o dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="suspicious">Sospechosos</SelectItem>
                  <SelectItem value="fraud_detected">Fraudes</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Panel de capas */}
          <Card className="border-muted mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Capas del Mapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {capasActivas.map((capa) => (
                  <div key={capa.id} className="flex items-center gap-3">
                    <Switch
                      checked={capa.visible}
                      onCheckedChange={() => toggleCapa(capa.id)}
                    />
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: capa.color }}
                      ></div>
                      <span className="text-sm">{capa.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs de visualización */}
          <Tabs value={vistaActiva} onValueChange={(value) => setVistaActiva(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mapa">Vista de Mapa</TabsTrigger>
              <TabsTrigger value="lista">Lista de Medidores</TabsTrigger>
              <TabsTrigger value="clusters">Análisis por Clusters</TabsTrigger>
            </TabsList>

            <TabsContent value="mapa" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg overflow-hidden">
                    {/* Simulación de mapa interactivo */}
                    <div className="absolute inset-0 p-4">
                      {medidoresFiltrados.map((medidor, index) => {
                        const statusInfo = getStatusInfo(medidor.status);
                        const x = 20 + (index % 4) * 20; // Distribución simulada
                        const y = 20 + Math.floor(index / 4) * 25;
                        
                        return (
                          <div
                            key={medidor.id}
                            className="absolute cursor-pointer group"
                            style={{ left: `${x}%`, top: `${y}%` }}
                          >
                            <div className={`w-4 h-4 rounded-full ${statusInfo.color} animate-pulse`}></div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-48">
                              <div className="space-y-1">
                                <p className="font-semibold text-sm">{medidor.customerName}</p>
                                <p className="text-xs text-muted-foreground">{medidor.address}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={statusInfo.textColor}>
                                    {statusInfo.text}
                                  </Badge>
                                  <span className="text-xs">{medidor.consumption} kWh</span>
                                </div>
                                {medidor.anomalies > 0 && (
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">
                                      {medidor.anomalies} anomalías
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Leyenda */}
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">Activo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Sospechoso</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">Fraude</span>
                        </div>
                      </div>
                    </div>

                    {/* Controles de zoom */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button size="sm" variant="secondary">+</Button>
                      <Button size="sm" variant="secondary">-</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lista" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-3">Cliente</th>
                          <th className="text-left p-3">Dirección</th>
                          <th className="text-left p-3">Estado</th>
                          <th className="text-left p-3">Consumo</th>
                          <th className="text-left p-3">Anomalías</th>
                          <th className="text-left p-3">Última Lectura</th>
                          <th className="text-left p-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medidoresFiltrados.map((medidor) => {
                          const statusInfo = getStatusInfo(medidor.status);
                          return (
                            <tr key={medidor.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">
                                <div>
                                  <p className="font-medium">{medidor.customerName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {medidor.deviceInfo.serialNumber}
                                  </p>
                                </div>
                              </td>
                              <td className="p-3">
                                <p className="text-xs">{medidor.address}</p>
                              </td>
                              <td className="p-3">
                                <Badge variant="outline" className={statusInfo.textColor}>
                                  {statusInfo.text}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="font-medium">{medidor.consumption} kWh</span>
                              </td>
                              <td className="p-3">
                                {medidor.anomalies > 0 ? (
                                  <Badge variant="destructive">
                                    {medidor.anomalies}
                                  </Badge>
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </td>
                              <td className="p-3">
                                <span className="text-xs">
                                  {medidor.lastReading.toLocaleString('es-CL')}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clusters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Análisis por Zonas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Zona Norte</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Medidores: 15</div>
                          <div>Consumo: 3.2 MWh</div>
                          <div>Anomalías: 2</div>
                          <div>Eficiencia: 94%</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Zona Centro</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Medidores: 22</div>
                          <div>Consumo: 4.8 MWh</div>
                          <div>Anomalías: 1</div>
                          <div>Eficiencia: 97%</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Zona Sur</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Medidores: 18</div>
                          <div>Consumo: 3.9 MWh</div>
                          <div>Anomalías: 4</div>
                          <div>Eficiencia: 89%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patrones de Consumo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Gráfico de patrones de consumo por zona
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