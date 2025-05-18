"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Battery, Zap, Wifi, LightbulbIcon, TrendingDownIcon, AlertTriangleIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Componente simulado de gráfico de área
const AreaChartSimulation = () => {
  return (
    <div className="relative h-40 w-full mt-4 mb-2">
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden rounded-md">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-orange-500/0"></div>
        <svg viewBox="0 0 100 30" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path 
            fill="none" 
            stroke="rgb(234, 88, 12)" 
            strokeWidth="0.6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M0,20 Q10,15 20,18 T40,12 T60,20 T80,10 T100,15" 
          />
          <path 
            fill="rgba(234, 88, 12, 0.1)" 
            d="M0,30 L0,20 Q10,15 20,18 T40,12 T60,20 T80,10 T100,15 L100,30 Z" 
          />
        </svg>
      </div>
      <div className="absolute bottom-0 w-full flex justify-between px-1 text-xs text-muted-foreground">
        <span>12 AM</span>
        <span className="hidden xs:inline">4 AM</span>
        <span>8 AM</span>
        <span className="hidden xs:inline">12 PM</span>
        <span>4 PM</span>
        <span className="hidden xs:inline">8 PM</span>
      </div>
    </div>
  );
};

export default function Component() {
  return (
    <Card className="w-full border-orange-500/10">
      <CardHeader className="border-b border-border/50 bg-muted/30 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-2">
              Control de Consumo 
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs">En línea</Badge>
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Monitoreo en tiempo real del consumo eléctrico para optimizar costos
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 self-end sm:self-auto">
            <Battery className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <span className="text-xs sm:text-sm font-medium">98%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Panel de consumo actual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Consumo Actual</h3>
              <Badge variant="outline" className="text-orange-500 text-xs">Tiempo real</Badge>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-background p-4 sm:p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500" />
                <div className="text-right">
                  <span className="text-2xl sm:text-4xl font-bold">2.4</span>
                  <span className="text-lg sm:text-xl ml-1">kWh</span>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-end mt-1">
                    <TrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span>5% menos que ayer</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consumo del día</span>
                <span className="font-medium">17.8 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consumo mensual</span>
                <span className="font-medium">342.5 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proyección mensual</span>
                <span className="font-medium">520.3 kWh</span>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm text-muted-foreground mt-4 hidden sm:block">
              <p className="leading-relaxed">
                Monitorea tu consumo en tiempo real para detectar picos y tomar 
                decisiones inmediatas. Los datos se actualizan cada 30 segundos.
              </p>
            </div>
          </div>
          
          {/* Panel de análisis y gráficos */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Tendencia diaria</h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-muted-foreground">Datos en vivo</span>
                </div>
              </div>
              
              <AreaChartSimulation />
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-4">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-500/10 p-1.5 sm:p-2 rounded-full">
                    <LightbulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Ahorro potencial</p>
                    <p className="text-xs text-muted-foreground">15% mensual</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <div className="bg-amber-500/10 p-1.5 sm:p-2 rounded-full">
                    <AlertTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Hora pico</p>
                    <p className="text-xs text-muted-foreground">19:00 - 21:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Sección de consejos */}
        <div className="mt-6 sm:mt-8 border-t border-border/50 pt-4 sm:pt-6">
          <div className="flex items-start gap-2 mb-3 sm:mb-4">
            <LightbulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mt-1 shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Consejos de optimización</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Recomendaciones personalizadas para reducir tu consumo eléctrico
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-4">
            <div className="flex gap-2 sm:gap-3 items-start group">
              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500 mt-0.5">1</div>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="font-medium text-foreground">Programa tus electrodomésticos</span> para que funcionen durante horas 
                de baja demanda (entre las 10:00 AM y 4:00 PM).
              </p>
            </div>
            
            <div className="flex gap-2 sm:gap-3 items-start group">
              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500 mt-0.5">2</div>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="font-medium text-foreground">Mantén la temperatura óptima</span> del aire acondicionado a 24°C 
                para maximizar la eficiencia energética.
              </p>
            </div>
            
            <div className="flex gap-2 sm:gap-3 items-start group">
              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500 mt-0.5">3</div>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="font-medium text-foreground">Utiliza iluminación LED</span> y aprovecha la luz natural durante 
                el día para reducir el consumo en iluminación.
              </p>
            </div>
            
            <div className="flex gap-2 sm:gap-3 items-start group">
              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500 mt-0.5">4</div>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="font-medium text-foreground">Desconecta los dispositivos</span> en modo de espera, que pueden 
                representar hasta un 10% del consumo total.
              </p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button variant="outline" className="text-xs sm:text-sm">
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Programar optimizaciones
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
