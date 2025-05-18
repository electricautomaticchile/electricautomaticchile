"use client"

import React, { useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface ChartDataPoint {
  x: string | number;
  y: number | null;
}

interface ChartSeries {
  id: string;
  data: ChartDataPoint[];
  color?: string;
}

interface BarChartData {
  [key: string]: string | number;
}

type ChartType = 'bar' | 'line';

interface EnhancedChartProps {
  type: ChartType;
  data: ChartSeries[] | BarChartData[];
  title: string;
  description?: string;
  height?: number;
  keys?: string[];
  indexBy?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  enableAnimation?: boolean;
  enableExport?: boolean;
  enableZoom?: boolean;
  colorScheme?: string[];
  className?: string;
}

export function EnhancedChart({
  type,
  data,
  title,
  description,
  height = 400,
  keys,
  indexBy = 'x',
  xAxisLabel = 'X',
  yAxisLabel = 'Y',
  enableAnimation = true,
  enableExport = true,
  enableZoom = true,
  colorScheme = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  className,
}: EnhancedChartProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animación simplificada para que coincida con los tipos esperados
  const shouldAnimate = enableAnimation && !isRefreshing;

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    let csvContent = '';
    
    if (type === 'line') {
      // Para gráficos de línea
      const lineData = data as ChartSeries[];
      
      // Crear encabezados
      const headers = ['x', ...lineData.map(series => series.id)];
      csvContent += headers.join(',') + '\n';
      
      // Recopilar todos los valores x únicos
      const allXValues = new Set<string | number>();
      lineData.forEach(series => {
        series.data.forEach(point => {
          allXValues.add(point.x);
        });
      });
      
      // Ordenar valores x
      const sortedXValues = Array.from(allXValues).sort();
      
      // Para cada valor x, obtener los valores y correspondientes
      sortedXValues.forEach(x => {
        const row = [x];
        
        lineData.forEach(series => {
          const point = series.data.find(p => p.x === x);
          row.push(point ? (point.y ?? '') : '');
        });
        
        csvContent += row.join(',') + '\n';
      });
    } else {
      // Para gráficos de barras
      const barData = data as BarChartData[];
      
      if (!keys || !indexBy) {
        console.error('Se requieren keys e indexBy para exportar datos de gráficos de barras');
        return;
      }
      
      // Crear encabezados
      csvContent += [indexBy, ...keys].join(',') + '\n';
      
      // Crear filas
      barData.forEach(item => {
        const row = [item[indexBy]];
        keys.forEach(key => {
          row.push(item[key] ?? '');
        });
        csvContent += row.join(',') + '\n';
      });
    }
    
    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aplicar zoom al contenido del gráfico
  const chartHeight = useMemo(() => height * zoomLevel, [height, zoomLevel]);

  // Refrescar animación
  const refreshAnimation = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 100);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex space-x-2">
            {enableZoom && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                  title="Acercar"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                  title="Alejar"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </>
            )}
            {enableAnimation && (
              <Button
                variant="outline"
                size="icon"
                onClick={refreshAnimation}
                title="Refrescar animación"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {enableExport && (
              <Button
                variant="outline"
                size="icon"
                onClick={exportToCSV}
                title="Exportar a CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight, transition: 'height 0.3s ease' }}>
          {type === 'bar' && keys && (
            <ResponsiveBar
              data={data as BarChartData[]}
              keys={keys}
              indexBy={indexBy}
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={colorScheme}
              animate={shouldAnimate}
              borderRadius={4}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: xAxisLabel,
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxisLabel,
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          )}
          {type === 'line' && (
            <ResponsiveLine
              data={data as ChartSeries[]}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: xAxisLabel,
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxisLabel,
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              colors={colorScheme}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              animate={shouldAnimate}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 