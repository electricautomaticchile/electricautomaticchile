"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  ArrowUpDown,
  RotateCw
} from 'lucide-react';

// Datos simulados de dispositivos
const dispositivos = [
  {
    id: 'DEV001',
    nombre: 'Medidor Inteligente AC-750',
    ubicacion: 'Edificio Central - Piso 1',
    estado: 'activo',
    bateria: 95,
    ultimaTransmision: '18/05/2023 - 15:32',
    tipoConexion: 'Wifi',
    consumoActual: 24.5,
    firmware: 'v3.2.1'
  },
  {
    id: 'DEV002',
    nombre: 'Medidor Inteligente AC-750',
    ubicacion: 'Edificio Central - Piso 2',
    estado: 'activo',
    bateria: 87,
    ultimaTransmision: '18/05/2023 - 15:30',
    tipoConexion: '4G',
    consumoActual: 18.2,
    firmware: 'v3.2.1'
  },
  {
    id: 'DEV003',
    nombre: 'Medidor Inteligente AC-500',
    ubicacion: 'Edificio Norte - Piso 1',
    estado: 'inactivo',
    bateria: 12,
    ultimaTransmision: '15/05/2023 - 09:45',
    tipoConexion: 'Wifi',
    consumoActual: 0,
    firmware: 'v3.1.7'
  },
  {
    id: 'DEV004',
    nombre: 'Medidor Inteligente AC-750',
    ubicacion: 'Edificio Este - Piso 1',
    estado: 'mantenimiento',
    bateria: 65,
    ultimaTransmision: '17/05/2023 - 14:22',
    tipoConexion: 'Ethernet',
    consumoActual: 5.8,
    firmware: 'v3.2.0'
  },
  {
    id: 'DEV005',
    nombre: 'Medidor Inteligente AC-900',
    ubicacion: 'Edificio Central - Piso 3',
    estado: 'activo',
    bateria: 72,
    ultimaTransmision: '18/05/2023 - 15:28',
    tipoConexion: 'Ethernet',
    consumoActual: 32.7,
    firmware: 'v3.2.1'
  },
  {
    id: 'DEV006',
    nombre: 'Medidor Inteligente AC-750',
    ubicacion: 'Edificio Oeste - Piso 2',
    estado: 'alerta',
    bateria: 42,
    ultimaTransmision: '18/05/2023 - 14:15',
    tipoConexion: 'Wifi',
    consumoActual: 28.3,
    firmware: 'v3.2.1'
  }
];

const resumenDispositivos = {
  total: 42,
  activos: 38,
  inactivos: 2,
  mantenimiento: 1,
  alerta: 1,
  bateriaPromedio: 78
};

// Componente para el ícono de batería según nivel
const BateriaIcon = ({ nivel }: { nivel: number }) => {
  if (nivel >= 80) return <BatteryFull className="h-4 w-4 text-green-600" />;
  if (nivel >= 50) return <BatteryCharging className="h-4 w-4 text-blue-600" />;
  if (nivel >= 20) return <BatteryLow className="h-4 w-4 text-amber-600" />;
  return <BatteryWarning className="h-4 w-4 text-red-600" />;
};

// Componente para el estado con ícono
const EstadoDispositivo = ({ estado }: { estado: string }) => {
  switch (estado) {
    case 'activo':
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-600">Activo</span>
        </div>
      );
    case 'inactivo':
      return (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-500">Inactivo</span>
        </div>
      );
    case 'mantenimiento':
      return (
        <div className="flex items-center gap-1.5">
          <RotateCw className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-600">Mantenimiento</span>
        </div>
      );
    case 'alerta':
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-amber-600">Alerta</span>
        </div>
      );
    default:
      return null;
  }
};

interface DispositivosActivosProps {
  reducida?: boolean;
}

export function DispositivosActivos({ reducida = false }: DispositivosActivosProps) {
  const [tabActiva, setTabActiva] = useState("todos");
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Activos</div>
            <div className="text-xl font-bold text-green-600">{resumenDispositivos.activos}</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Con alerta</div>
            <div className="text-xl font-bold text-amber-600">{resumenDispositivos.alerta}</div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {dispositivos.slice(0, 3).map((dispositivo, index) => (
            <div key={index} className="flex items-center justify-between p-1.5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Battery className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-sm font-medium">{dispositivo.id}</span>
              </div>
              <div className={`text-xs px-1.5 py-0.5 rounded ${
                dispositivo.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                dispositivo.estado === 'alerta' ? 'bg-amber-100 text-amber-800' : 
                dispositivo.estado === 'mantenimiento' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {dispositivo.estado}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Versión completa del componente
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Battery className="h-6 w-6 text-orange-600" />
            Dispositivos Activos
          </h2>
          <p className="text-gray-500 mt-1">
            Monitoreo de todos los dispositivos instalados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar dispositivo..."
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Dispositivo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estado de Dispositivos</CardTitle>
            <CardDescription>Resumen general del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">{resumenDispositivos.total}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Activos</div>
                <div className="text-2xl font-bold text-green-600">{resumenDispositivos.activos}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Inactivos</div>
                <div className="text-2xl font-bold text-gray-500">{resumenDispositivos.inactivos}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Alertas</div>
                <div className="text-2xl font-bold text-amber-600">{resumenDispositivos.alerta}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Salud del Sistema</CardTitle>
            <CardDescription>Nivel de batería y estado de conexión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Batería promedio</div>
                <div className="text-2xl font-bold">{resumenDispositivos.bateriaPromedio}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Dispositivos con alerta</div>
                <div className="text-2xl font-bold text-amber-600">{resumenDispositivos.alerta + resumenDispositivos.inactivos}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Cobertura</div>
                <div className="text-2xl font-bold text-green-600">93%</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${resumenDispositivos.bateriaPromedio}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={tabActiva} onValueChange={setTabActiva} className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="todos">Todos ({resumenDispositivos.total})</TabsTrigger>
          <TabsTrigger value="activos">Activos ({resumenDispositivos.activos})</TabsTrigger>
          <TabsTrigger value="inactivos">Inactivos ({resumenDispositivos.inactivos})</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento ({resumenDispositivos.mantenimiento})</TabsTrigger>
          <TabsTrigger value="alerta">Con alerta ({resumenDispositivos.alerta})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3 flex items-center gap-1 cursor-pointer">
                ID <ArrowUpDown className="h-3 w-3" />
              </th>
              <th scope="col" className="px-4 py-3">Dispositivo</th>
              <th scope="col" className="px-4 py-3">Ubicación</th>
              <th scope="col" className="px-4 py-3">Estado</th>
              <th scope="col" className="px-4 py-3">Batería</th>
              <th scope="col" className="px-4 py-3">Última transmisión</th>
              <th scope="col" className="px-4 py-3">Consumo actual</th>
              <th scope="col" className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dispositivos.map((dispositivo, index) => (
              <tr 
                key={index} 
                className="bg-white border-b dark:bg-slate-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <td className="px-4 py-3 font-medium">
                  {dispositivo.id}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{dispositivo.nombre}</div>
                  <div className="text-xs text-gray-500">{dispositivo.firmware} • {dispositivo.tipoConexion}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {dispositivo.ubicacion}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EstadoDispositivo estado={dispositivo.estado} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <BateriaIcon nivel={dispositivo.bateria} />
                    <span>{dispositivo.bateria}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {dispositivo.ultimaTransmision}
                </td>
                <td className="px-4 py-3 font-medium">
                  {dispositivo.consumoActual > 0 ? 
                    `${dispositivo.consumoActual} kWh` : 
                    <span className="text-gray-500">Sin datos</span>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {dispositivos.length} de {resumenDispositivos.total} dispositivos
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  );
} 