"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Building2, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { apiService } from '@/lib/api/apiService';

interface EstadisticasGlobalesProps {
  reducida?: boolean;
}

export function EstadisticasGlobales({ reducida = false }: EstadisticasGlobalesProps) {
  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalCotizaciones: 0,
    cotizacionesPendientes: 0,
    clientesActivos: 0,
    facturacionTotal: 0,
    crecimientoMensual: 0,
    loading: true
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      // Cargar estadísticas de clientes
      const clientesResponse = await apiService.obtenerClientes();
      const cotizacionesResponse = await apiService.obtenerCotizaciones();
      const estadisticasCotResponse = await apiService.obtenerEstadisticasCotizaciones();

      if (clientesResponse.success && cotizacionesResponse.success) {
        const clientes = clientesResponse.data || [];
        const cotizaciones = cotizacionesResponse.data || [];
        const estadisticasCot = estadisticasCotResponse.data || {};

        // Calcular estadísticas
        const clientesActivos = clientes.filter(c => c.activo || c.esActivo).length;
        const cotizacionesPendientes = cotizaciones.filter(c => c.estado === 'pendiente').length;
        
        // Calcular facturación total aproximada
        const facturacionTotal = cotizaciones
          .filter(c => c.total && (c.estado === 'aprobada' || c.estado === 'convertida_cliente'))
          .reduce((sum, c) => sum + (c.total || 0), 0);

        setEstadisticas({
          totalClientes: clientes.length,
          totalCotizaciones: cotizaciones.length,
          cotizacionesPendientes,
          clientesActivos,
          facturacionTotal,
          crecimientoMensual: estadisticasCot.crecimientoMensual || 0,
          loading: false
        });
      } else {
        console.error('Error cargando estadísticas:', clientesResponse.error || cotizacionesResponse.error);
        setEstadisticas(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setEstadisticas(prev => ({ ...prev, loading: false }));
    }
  };

  if (reducida) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estadísticas Globales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estadisticas.loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Clientes</span>
                <Badge variant="secondary">{estadisticas.totalClientes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cotizaciones</span>
                <Badge variant="secondary">{estadisticas.totalCotizaciones}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pendientes</span>
                <Badge variant="destructive">{estadisticas.cotizacionesPendientes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Facturación</span>
                <Badge variant="default">${(estadisticas.facturacionTotal / 1000000).toFixed(1)}M</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (estadisticas.loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Clientes</CardTitle>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {estadisticas.totalClientes}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                {estadisticas.clientesActivos} activos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Cotizaciones</CardTitle>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-orange-900 dark:text-orange-100">
              {estadisticas.totalCotizaciones}
            </div>
            <div className="flex items-center mt-2">
              <Activity className="w-4 h-4 text-yellow-500 mr-1" />
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                {estadisticas.cotizacionesPendientes} pendientes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Facturación</CardTitle>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100">
              ${(estadisticas.facturacionTotal / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                +{estadisticas.crecimientoMensual.toFixed(1)}% mensual
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Rendimiento</CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-purple-900 dark:text-purple-100">
              {estadisticas.totalCotizaciones > 0 ? Math.round((estadisticas.clientesActivos / estadisticas.totalClientes) * 100) : 0}%
            </div>
            <div className="flex items-center mt-2">
              <Activity className="w-4 h-4 text-purple-500 mr-1" />
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Tasa de conversión
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-orange-100 dark:border-orange-900/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Progreso de Metas</CardTitle>
          <CardDescription>Indicadores de rendimiento mensual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Nuevos Clientes (Meta: 50)</span>
              <span>{Math.min(estadisticas.totalClientes, 50)}/50</span>
            </div>
            <Progress value={(estadisticas.totalClientes / 50) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Cotizaciones Procesadas (Meta: 100)</span>
              <span>{Math.min(estadisticas.totalCotizaciones, 100)}/100</span>
            </div>
            <Progress value={(estadisticas.totalCotizaciones / 100) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Facturación (Meta: $2M)</span>
              <span>${(estadisticas.facturacionTotal / 1000000).toFixed(1)}M/2M</span>
            </div>
            <Progress value={(estadisticas.facturacionTotal / 2000000) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 