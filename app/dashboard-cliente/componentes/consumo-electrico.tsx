"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, TrendingUp, DollarSign, Clock, BarChart2 } from 'lucide-react';

// Datos de ejemplo
const datosMensuales = [
  { mes: 'Enero', consumo: 240, costo: 35600 },
  { mes: 'Febrero', consumo: 228, costo: 33800 },
  { mes: 'Marzo', consumo: 235, costo: 34900 },
  { mes: 'Abril', consumo: 242, costo: 36000 },
  { mes: 'Mayo', consumo: 246, costo: 36500 },
  { mes: 'Junio', consumo: 255, costo: 37800 },
  { mes: 'Julio', consumo: 268, costo: 39700 },
  { mes: 'Agosto', consumo: 270, costo: 40100 },
  { mes: 'Septiembre', consumo: 262, costo: 38900 },
  { mes: 'Octubre', consumo: 250, costo: 37100 },
  { mes: 'Noviembre', consumo: 245, costo: 36400 },
  { mes: 'Diciembre', consumo: 255, costo: 37800 }
];

const datosDiarios = [
  { dia: 'Lunes', consumo: 8.2 },
  { dia: 'Martes', consumo: 7.9 },
  { dia: 'Miércoles', consumo: 8.3 },
  { dia: 'Jueves', consumo: 8.4 },
  { dia: 'Viernes', consumo: 8.6 },
  { dia: 'Sábado', consumo: 9.2 },
  { dia: 'Domingo', consumo: 8.7 }
];

const datosHorarios = [
  { hora: '00:00', consumo: 0.4 },
  { hora: '01:00', consumo: 0.3 },
  { hora: '02:00', consumo: 0.3 },
  { hora: '03:00', consumo: 0.2 },
  { hora: '04:00', consumo: 0.2 },
  { hora: '05:00', consumo: 0.3 },
  { hora: '06:00', consumo: 0.5 },
  { hora: '07:00', consumo: 0.7 },
  { hora: '08:00', consumo: 0.9 },
  { hora: '09:00', consumo: 0.8 },
  { hora: '10:00', consumo: 0.7 },
  { hora: '11:00', consumo: 0.7 },
  { hora: '12:00', consumo: 0.8 },
  { hora: '13:00', consumo: 0.9 },
  { hora: '14:00', consumo: 0.9 },
  { hora: '15:00', consumo: 0.8 },
  { hora: '16:00', consumo: 0.7 },
  { hora: '17:00', consumo: 0.8 },
  { hora: '18:00', consumo: 1.0 },
  { hora: '19:00', consumo: 1.2 },
  { hora: '20:00', consumo: 1.3 },
  { hora: '21:00', consumo: 1.1 },
  { hora: '22:00', consumo: 0.9 },
  { hora: '23:00', consumo: 0.5 }
];

interface ConsumoElectricoProps {
  reducida?: boolean;
}

type DatoMensual = typeof datosMensuales[0];
type DatoDiario = typeof datosDiarios[0];
type DatoHorario = typeof datosHorarios[0];
type TipoDatos = DatoMensual | DatoDiario | DatoHorario;

export function ConsumoElectrico({ reducida = false }: ConsumoElectricoProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mensual');
  const [añoSeleccionado, setAñoSeleccionado] = useState('2023');
  const [mesSeleccionado, setMesSeleccionado] = useState('Noviembre');
  const [consumoActual, setConsumoActual] = useState(245.8);
  const [costoEstimado, setCostoEstimado] = useState(36450);
  const [consumoDiarioPromedio, setConsumoDiarioPromedio] = useState(8.5);
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, aquí cargaríamos los datos desde una API
    // Este efecto simula la actualización del consumo en tiempo real
    const interval = setInterval(() => {
      // Añadir una pequeña variación aleatoria al consumo
      const variacion = (Math.random() * 0.4) - 0.2; // Entre -0.2 y 0.2
      const nuevoConsumo = Math.round((consumoActual + variacion) * 10) / 10;
      setConsumoActual(nuevoConsumo);
      setCostoEstimado(Math.round(nuevoConsumo * 148.3)); // Tarifa simulada
    }, 60000); // Actualizar cada minuto
    
    return () => clearInterval(interval);
  }, [consumoActual]);
  
  // Renderizar gráfico básico según los datos seleccionados
  const renderizarGrafico = () => {
    let datos: TipoDatos[] = [];
    
    switch (periodoSeleccionado) {
      case 'mensual':
        datos = datosMensuales;
        break;
      case 'diario':
        datos = datosDiarios;
        break;
      case 'horario':
        datos = datosHorarios;
        break;
      default:
        datos = datosMensuales;
    }
    
    const maxConsumo = Math.max(...datos.map(d => d.consumo));
    
    return (
      <div className="h-60 flex items-end space-x-2 mt-4">
        {datos.map((dato, index) => {
          const altura = (dato.consumo / maxConsumo) * 100;
          let etiqueta = '';
          
          if (periodoSeleccionado === 'mensual' && 'mes' in dato) {
            etiqueta = dato.mes.substring(0, 3);
          } else if (periodoSeleccionado === 'diario' && 'dia' in dato) {
            etiqueta = dato.dia.substring(0, 3);
          } else if (periodoSeleccionado === 'horario' && 'hora' in dato) {
            etiqueta = dato.hora;
          }
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-orange-500 rounded-t-sm" 
                style={{ height: `${altura}%` }}
              ></div>
              <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                {etiqueta}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Obtener el consumo máximo del periodo actual
  const obtenerConsumoMaximo = () => {
    if (periodoSeleccionado === 'mensual') {
      return Math.max(...datosMensuales.map(d => d.consumo));
    } else if (periodoSeleccionado === 'diario') {
      return Math.max(...datosDiarios.map(d => d.consumo));
    } else {
      return Math.max(...datosHorarios.map(d => d.consumo));
    }
  };
  
  // Obtener promedio de consumo del periodo actual
  const obtenerConsumoPromedio = () => {
    let datos: TipoDatos[] = [];
    
    switch (periodoSeleccionado) {
      case 'mensual':
        datos = datosMensuales;
        break;
      case 'diario':
        datos = datosDiarios;
        break;
      case 'horario':
        datos = datosHorarios;
        break;
      default:
        datos = datosMensuales;
    }
    
    const suma = datos.reduce((acc, dato) => acc + dato.consumo, 0);
    return (suma / datos.length).toFixed(1);
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Consumo Eléctrico
          </CardTitle>
          <CardDescription>
            Consumo actual y estadísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Consumo Actual</div>
              <div className="text-2xl font-bold">{consumoActual} kWh</div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                {(consumoActual - 240).toFixed(1)} kWh vs. Mes anterior
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Costo Estimado</div>
              <div className="text-2xl font-bold">${costoEstimado.toLocaleString('es-CL')}</div>
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                Promedio: {consumoDiarioPromedio} kWh/día
              </div>
            </div>
          </div>
          
          <div className="h-28 mt-4">
            <div className="flex items-end space-x-1 h-full">
              {datosMensuales.slice(-6).map((dato, index) => {
                const altura = (dato.consumo / 300) * 100; // 300 como valor máximo de referencia
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-orange-500 rounded-t-sm" 
                      style={{ height: `${altura}%` }}
                    ></div>
                    <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                      {dato.mes.substring(0, 3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-orange-600" />
          Consumo Eléctrico
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Consumo Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {consumoActual} kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
              {(consumoActual - 240).toFixed(1)} kWh vs. Mes anterior
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Costo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              ${costoEstimado.toLocaleString('es-CL')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Tarifa: $148,3/kWh
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Consumo Diario Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {consumoDiarioPromedio} kWh
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4 inline mr-1" />
              Actualizado hace 1 hora
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="mensual" className="mb-4" onValueChange={setPeriodoSeleccionado}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="mensual">Mensual</TabsTrigger>
            <TabsTrigger value="diario">Diario</TabsTrigger>
            <TabsTrigger value="horario">Por Hora</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {periodoSeleccionado === 'mensual' && (
              <Select defaultValue="2023" onValueChange={setAñoSeleccionado}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {periodoSeleccionado === 'diario' && (
              <Select defaultValue="Noviembre" onValueChange={setMesSeleccionado}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {datosMensuales.map((dato, index) => (
                    <SelectItem key={index} value={dato.mes}>{dato.mes}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <TabsContent value="mensual" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Consumo Mensual {añoSeleccionado}</CardTitle>
              <CardDescription>
                Consumo y costos por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderizarGrafico()}
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Máximo Consumo</div>
                  <div className="text-xl font-bold">{obtenerConsumoMaximo()} kWh</div>
                  <div className="text-xs text-gray-500">Agosto</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Promedio Mensual</div>
                  <div className="text-xl font-bold">{obtenerConsumoPromedio()} kWh</div>
                  <div className="text-xs text-gray-500">En {añoSeleccionado}</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Costo Anual</div>
                  <div className="text-xl font-bold">$445.600</div>
                  <div className="text-xs text-gray-500">Estimado {añoSeleccionado}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diario" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Consumo Diario {mesSeleccionado} {añoSeleccionado}</CardTitle>
              <CardDescription>
                Consumo por día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderizarGrafico()}
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Día Mayor Consumo</div>
                  <div className="text-xl font-bold">9.2 kWh</div>
                  <div className="text-xs text-gray-500">Sábado</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Día Menor Consumo</div>
                  <div className="text-xl font-bold">7.9 kWh</div>
                  <div className="text-xs text-gray-500">Martes</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Promedio Diario</div>
                  <div className="text-xl font-bold">{obtenerConsumoPromedio()} kWh</div>
                  <div className="text-xs text-gray-500">{mesSeleccionado}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="horario" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Consumo Por Hora</CardTitle>
              <CardDescription>
                Patrón típico de consumo en 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderizarGrafico()}
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Hora Pico</div>
                  <div className="text-xl font-bold">1.3 kWh</div>
                  <div className="text-xs text-gray-500">20:00</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Hora Valle</div>
                  <div className="text-xl font-bold">0.2 kWh</div>
                  <div className="text-xs text-gray-500">03:00 - 04:00</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Consumo Promedio</div>
                  <div className="text-xl font-bold">{obtenerConsumoPromedio()} kWh</div>
                  <div className="text-xs text-gray-500">Por hora</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-orange-600" />
          Consejos de ahorro
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>Su consumo es un 2.3% más alto que el mes anterior. Considere revisar los electrodomésticos de mayor uso.</li>
          <li>El mayor consumo ocurre durante las horas de la noche (18:00 - 22:00). Intente distribuir el uso de electrodomésticos a lo largo del día.</li>
          <li>El consumo del fin de semana es notablemente mayor. Puede reducir costos limitando el uso de electrodomésticos de alto consumo.</li>
        </ul>
      </div>
    </div>
  );
} 