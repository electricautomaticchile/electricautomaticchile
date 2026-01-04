"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, RefreshCw, Download } from 'lucide-react';
import { antifraudeService } from '@/lib/api/services/antifraudeService';
import { Anomalia, EstadisticasAntifraude } from './types';
import { VistaReducida } from './VistaReducida';
import { EstadisticasCards } from './EstadisticasCards';
import { FiltrosAnomalias } from './FiltrosAnomalias';
import { TabAnomalias } from './TabAnomalias';
import { TabInvestigacion } from './TabInvestigacion';
import { TabEstadisticas } from './TabEstadisticas';

interface SistemaAntifraudeProps {
  reducida?: boolean;
}

export function SistemaAntifraude({ reducida = false }: SistemaAntifraudeProps) {
  const [anomalias, setAnomalias] = useState<Anomalia[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAntifraude | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('pending');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActiva, setVistaActiva] = useState<'anomalias' | 'investigacion' | 'estadisticas'>('anomalias');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    
    try {
      const [anomaliasData, estadisticasData] = await Promise.all([
        antifraudeService.detectarAnomalias(),
        antifraudeService.obtenerEstadisticas(),
      ]);
      
      setAnomalias(anomaliasData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error cargando datos antifraude:', error);
    } finally {
      setLoading(false);
    }
  };

  const anomaliasFiltradas = anomalias.filter(anomalia => {
    const matchesSeverity = filtroSeveridad === 'todos' || anomalia.severidad === filtroSeveridad;
    const matchesStatus = filtroEstado === 'todos' || anomalia.estado === filtroEstado;
    const matchesSearch = busqueda === '' || 
      anomalia.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      anomalia.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      anomalia.numeroDispositivo.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Card className={reducida ? "h-64" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Sistema Anti-fraude
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
    return <VistaReducida anomalias={anomalias} estadisticas={estadisticas} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Sistema Anti-fraude
              </CardTitle>
              <CardDescription>
                Detección automática y análisis de anomalías en consumo eléctrico
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
          {estadisticas && <EstadisticasCards estadisticas={estadisticas} />}

          <FiltrosAnomalias
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroSeveridad={filtroSeveridad}
            setFiltroSeveridad={setFiltroSeveridad}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
          />

          <Tabs value={vistaActiva} onValueChange={(value) => setVistaActiva(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="anomalias">Anomalías Detectadas</TabsTrigger>
              <TabsTrigger value="investigacion">Panel de Investigación</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas Avanzadas</TabsTrigger>
            </TabsList>

            <TabsContent value="anomalias" className="space-y-4">
              <TabAnomalias anomalias={anomaliasFiltradas} />
            </TabsContent>

            <TabsContent value="investigacion" className="space-y-4">
              <TabInvestigacion anomalias={anomalias} />
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-4">
              <TabEstadisticas estadisticas={estadisticas} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
