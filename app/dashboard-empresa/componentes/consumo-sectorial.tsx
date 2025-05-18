"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, PieChart, BarChart, CalendarDays, Building } from 'lucide-react';

// Componente para mostrar un gráfico ficticio
const DummyChart = ({ tipo, altura = 200 }: { tipo: string; altura?: number }) => {
  return (
    <div 
      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center" 
      style={{ height: `${altura}px` }}
    >
      <div className="text-center">
        {tipo === 'pie' ? (
          <PieChart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        ) : (
          <BarChart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        )}
        <p className="text-gray-500">Gráfico de {tipo}</p>
        <p className="text-xs text-gray-400 mt-1">
          (Esta es una visualización simulada)
        </p>
      </div>
    </div>
  );
};

// Datos simulados de consumo por sector
const datosSectores = [
  { nombre: 'Iluminación', consumo: 2450, porcentaje: 28 },
  { nombre: 'Climatización', consumo: 2100, porcentaje: 24 },
  { nombre: 'Equipos de oficina', consumo: 1750, porcentaje: 20 },
  { nombre: 'Servidores', consumo: 1400, porcentaje: 16 },
  { nombre: 'Cocina/Comedor', consumo: 700, porcentaje: 8 },
  { nombre: 'Otros', consumo: 350, porcentaje: 4 }
];

// Datos simulados de consumo por área
const datosAreas = [
  { nombre: 'Piso 1 - Recepción', consumo: 1050, porcentaje: 12 },
  { nombre: 'Piso 2 - Oficinas', consumo: 2450, porcentaje: 28 },
  { nombre: 'Piso 3 - Administración', consumo: 1750, porcentaje: 20 },
  { nombre: 'Piso 4 - Desarrollo', consumo: 1925, porcentaje: 22 },
  { nombre: 'Piso 5 - Gerencia', consumo: 1575, porcentaje: 18 }
];

// Datos simulados de franjas horarias
const datosFranjasHorarias = [
  { franja: '00:00 - 06:00', consumo: 875, porcentaje: 10 },
  { franja: '06:00 - 09:00', consumo: 1225, porcentaje: 14 },
  { franja: '09:00 - 12:00', consumo: 2100, porcentaje: 24 },
  { franja: '12:00 - 14:00', consumo: 1400, porcentaje: 16 },
  { franja: '14:00 - 18:00', consumo: 2275, porcentaje: 26 },
  { franja: '18:00 - 00:00', consumo: 875, porcentaje: 10 }
];

// Formatear consumo en kWh
const formatearConsumo = (valor: number) => {
  return `${valor.toLocaleString('es-CL')} kWh`;
};

interface ConsumoSectorialProps {
  reducida?: boolean;
}

export function ConsumoSectorial({ reducida = false }: ConsumoSectorialProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Mayor consumo</div>
            <div className="text-lg font-bold text-blue-600">Iluminación</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Menor consumo</div>
            <div className="text-lg font-bold text-green-600">Otros</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {datosSectores.slice(0, 3).map((sector, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm">{sector.nombre}</span>
              </div>
              <div className="text-sm font-medium">{sector.porcentaje}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Versión completa del componente
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-orange-600" />
          Consumo por Sector
        </h2>
        
        <Select defaultValue={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nov-2023">Noviembre 2023</SelectItem>
            <SelectItem value="oct-2023">Octubre 2023</SelectItem>
            <SelectItem value="sep-2023">Septiembre 2023</SelectItem>
            <SelectItem value="ago-2023">Agosto 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="sectores">
        <TabsList className="w-full">
          <TabsTrigger value="sectores" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Por Equipamiento
          </TabsTrigger>
          <TabsTrigger value="areas" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Por Área
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Por Horario
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sectores" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <DummyChart tipo="pie" altura={250} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Distribución del Consumo por Equipamiento</h3>
              <div className="space-y-3">
                {datosSectores.map((sector, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{sector.nombre}</span>
                      <span className="font-medium">{formatearConsumo(sector.consumo)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-orange-500' : 
                          index === 2 ? 'bg-green-500' : 
                          index === 3 ? 'bg-purple-500' : 
                          index === 4 ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} 
                        style={{ width: `${sector.porcentaje}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">{sector.porcentaje}% del consumo total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900">
            <h3 className="text-lg font-medium text-orange-800 dark:text-orange-300 mb-2">Recomendaciones de Ahorro</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Iluminación (28%):</strong> Considere reemplazar la iluminación actual por tecnología LED de bajo consumo y configurar sensores de movimiento en áreas de poco tránsito.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Climatización (24%):</strong> Ajustar la temperatura de los sistemas de climatización en 1°C podría representar un ahorro de aproximadamente 7% en este sector.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Equipos de oficina (20%):</strong> Configure todos los equipos en modo de ahorro energético y programe su apagado automático fuera del horario laboral.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="areas" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <DummyChart tipo="bar" altura={250} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Distribución del Consumo por Área</h3>
              <div className="space-y-3">
                {datosAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{area.nombre}</span>
                      <span className="font-medium">{formatearConsumo(area.consumo)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-orange-500' : 
                          index === 2 ? 'bg-green-500' : 
                          index === 3 ? 'bg-purple-500' : 'bg-yellow-500'
                        }`} 
                        style={{ width: `${area.porcentaje}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">{area.porcentaje}% del consumo total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900">
            <h3 className="text-lg font-medium text-orange-800 dark:text-orange-300 mb-2">Análisis por Área</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Piso 2 - Oficinas (28%):</strong> El mayor consumo se registra en esta área debido a la alta densidad de equipos informáticos y sistemas de iluminación.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Piso 4 - Desarrollo (22%):</strong> El consumo elevado se debe principalmente a equipos servidores y estaciones de trabajo que permanecen encendidos durante horarios extendidos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Piso 1 - Recepción (12%):</strong> A pesar de su menor tamaño, el consumo es significativo debido a sistemas de iluminación permanente y equipos de seguridad.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="horarios" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <DummyChart tipo="bar" altura={250} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Distribución del Consumo por Horario</h3>
              <div className="space-y-3">
                {datosFranjasHorarias.map((franja, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{franja.franja}</span>
                      <span className="font-medium">{formatearConsumo(franja.consumo)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          index === 0 ? 'bg-indigo-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-green-500' : 
                          index === 3 ? 'bg-yellow-500' : 
                          index === 4 ? 'bg-orange-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${franja.porcentaje}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">{franja.porcentaje}% del consumo total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900">
            <h3 className="text-lg font-medium text-orange-800 dark:text-orange-300 mb-2">Optimización por Horario</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Horario pico (14:00 - 18:00):</strong> Se recomienda programar sistemas de climatización para reducir su potencia durante estos periodos sin afectar el confort.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Horario valle (00:00 - 06:00):</strong> El consumo en este periodo corresponde principalmente a sistemas esenciales y servidores. Considere revisar qué equipos no esenciales podrían apagarse.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Aprovechamiento tarifario:</strong> Considere programar actividades de alto consumo energético en franjas horarias con tarifas reducidas para optimizar costos.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 