"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, Download, Calendar, Clock, AlertCircle, Activity } from 'lucide-react';

// Simulación de un componente de gráficos 
// (en una implementación real se usaría recharts u otra librería)
const DummyChart = ({ tipo }: { tipo: string }) => {
  return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <BarChart2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        <p className="text-gray-500">Gráfico de {tipo}</p>
        <p className="text-xs text-gray-400 mt-1">
          (Esta es una visualización simulada)
        </p>
      </div>
    </div>
  );
};

// Datos simulados
const datosTendencia = [
  { mes: 'Ene', consumo: 4250 },
  { mes: 'Feb', consumo: 3980 },
  { mes: 'Mar', consumo: 4120 },
  { mes: 'Abr', consumo: 4350 },
  { mes: 'May', consumo: 4580 },
  { mes: 'Jun', consumo: 4720 },
  { mes: 'Jul', consumo: 4950 },
  { mes: 'Ago', consumo: 5100 },
  { mes: 'Sep', consumo: 4870 },
  { mes: 'Oct', consumo: 4650 },
  { mes: 'Nov', consumo: 4520 },
  { mes: 'Dic', consumo: 4380 }
];

// Resumen de estadísticas
const resumenEstadisticas = {
  consumoMensual: 4520,
  variacionMensual: -2.8,
  consumoAnual: 54270,
  variacionAnual: 5.2,
  pico: {
    valor: 250.5,
    fecha: '15/11/2023',
    hora: '19:35'
  },
  horarioPico: '18:00 - 21:00',
  eficienciaEnergetica: 87.5
};

interface EstadisticasConsumoProps {
  reducida?: boolean;
}

export function EstadisticasConsumo({ reducida = false }: EstadisticasConsumoProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Consumo Mensual</div>
          <div className="text-2xl font-bold">{resumenEstadisticas.consumoMensual.toLocaleString('es-CL')} kWh</div>
          <div className={`text-xs flex items-center ${
            resumenEstadisticas.variacionMensual >= 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {resumenEstadisticas.variacionMensual >= 0 ? '+' : ''}{resumenEstadisticas.variacionMensual}% vs. mes anterior
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div>
            <div className="text-gray-500">Pico de consumo</div>
            <div className="font-medium">{resumenEstadisticas.pico.valor} kWh</div>
          </div>
          <div>
            <div className="text-gray-500">Horario pico</div>
            <div className="font-medium">{resumenEstadisticas.horarioPico}</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Versión completa del componente
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-600" />
          Estadísticas de Consumo
        </h2>
        
        <div className="flex items-center gap-3">
          <Select defaultValue={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nov-2023">Noviembre 2023</SelectItem>
              <SelectItem value="oct-2023">Octubre 2023</SelectItem>
              <SelectItem value="sep-2023">Septiembre 2023</SelectItem>
              <SelectItem value="ago-2023">Agosto 2023</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Consumo Mensual</CardTitle>
            <CardDescription>
              Período actual (Nov 2023)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {resumenEstadisticas.consumoMensual.toLocaleString('es-CL')} <span className="text-base text-gray-500">kWh</span>
            </div>
            <div className={`text-sm flex items-center mt-1 ${
              resumenEstadisticas.variacionMensual >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {resumenEstadisticas.variacionMensual >= 0 ? '+' : ''}{resumenEstadisticas.variacionMensual}% vs. mes anterior
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pico de Consumo</CardTitle>
            <CardDescription>
              Valor máximo registrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {resumenEstadisticas.pico.valor} <span className="text-base text-gray-500">kWh</span>
            </div>
            <div className="text-sm flex flex-col mt-1">
              <span className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {resumenEstadisticas.pico.fecha}
              </span>
              <span className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {resumenEstadisticas.pico.hora} hrs
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eficiencia Energética</CardTitle>
            <CardDescription>
              Índice de optimización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {resumenEstadisticas.eficienciaEnergetica}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${resumenEstadisticas.eficienciaEnergetica}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="diario" className="mb-6">
        <TabsList>
          <TabsTrigger value="diario">Consumo Diario</TabsTrigger>
          <TabsTrigger value="mensual">Consumo Mensual</TabsTrigger>
          <TabsTrigger value="horario">Consumo por Hora</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diario" className="mt-4">
          <DummyChart tipo="consumo diario" />
          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">Observaciones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Se observa un pico de consumo los días lunes y viernes. El consumo mínimo se registra los domingos, aproximadamente un 40% inferior al promedio semanal.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mensual" className="mt-4">
          <DummyChart tipo="consumo mensual" />
          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">Observaciones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  El consumo mensual muestra una tendencia creciente en los últimos 3 meses. Los meses de mayor consumo son julio y agosto, coincidiendo con la temporada de invierno.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="horario" className="mt-4">
          <DummyChart tipo="consumo por hora" />
          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-300">Observaciones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  El horario de mayor consumo se concentra entre las 18:00 y 21:00 horas. Se recomienda evitar el uso de equipos de alto consumo durante este período para optimizar costos.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones de Ahorro</CardTitle>
          <CardDescription>
            Basadas en sus patrones de consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 rounded-full bg-green-500 mt-1"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-200">Programe equipos de alto consumo fuera de horas pico:</span> Trasladar el uso de equipos de alto consumo al horario de 10:00 a 16:00 horas podría reducir su factura en aproximadamente un 12%.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 rounded-full bg-green-500 mt-1"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-200">Optimice la iluminación:</span> Según su patrón de consumo, la iluminación representa aproximadamente el 18% del consumo total. Completar la migración a tecnología LED podría generar un ahorro adicional del 8%.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 rounded-full bg-green-500 mt-1"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-200">Configure sistemas de climatización:</span> Ajustar la temperatura de los sistemas de climatización en 1°C podría representar un ahorro de energía de aproximadamente 7% en su consumo mensual.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 