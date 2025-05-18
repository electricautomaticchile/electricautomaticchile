"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Battery,
  BarChart2,
  ArrowDownUp
} from 'lucide-react';

// Datos simulados de alertas
const alertas = [
  {
    id: 'ALT001',
    tipo: 'error',
    mensaje: 'Pérdida de conexión con dispositivo',
    ubicacion: 'Edificio Norte - Piso 1',
    dispositivo: 'DEV003',
    fecha: '15/05/2023',
    hora: '09:45',
    estado: 'activa',
    detalles: 'El dispositivo ha perdido conexión con el servidor central. Se ha intentado reconectar automáticamente sin éxito.',
    asignado: null
  },
  {
    id: 'ALT002',
    tipo: 'advertencia',
    mensaje: 'Nivel de batería bajo',
    ubicacion: 'Edificio Oeste - Piso 2',
    dispositivo: 'DEV006',
    fecha: '18/05/2023',
    hora: '14:15',
    estado: 'activa',
    detalles: 'El nivel de batería del dispositivo ha caído por debajo del 50%. Se recomienda reemplazar la batería en los próximos 30 días.',
    asignado: null
  },
  {
    id: 'ALT003',
    tipo: 'informacion',
    mensaje: 'Actualización de firmware disponible',
    ubicacion: 'Múltiples ubicaciones',
    dispositivo: 'Múltiples',
    fecha: '17/05/2023',
    hora: '08:00',
    estado: 'activa',
    detalles: 'Hay una nueva actualización de firmware (v3.2.2) disponible para sus dispositivos. Esta actualización incluye mejoras de seguridad y rendimiento.',
    asignado: null
  },
  {
    id: 'ALT004',
    tipo: 'advertencia',
    mensaje: 'Consumo anómalo detectado',
    ubicacion: 'Edificio Central - Piso 3',
    dispositivo: 'DEV005',
    fecha: '18/05/2023',
    hora: '12:30',
    estado: 'activa',
    detalles: 'Se ha detectado un patrón de consumo anómalo en las últimas 4 horas. El consumo es un 35% superior al promedio histórico para este período.',
    asignado: 'Ana Martínez'
  },
  {
    id: 'ALT005',
    tipo: 'error',
    mensaje: 'Error de calibración',
    ubicacion: 'Edificio Este - Piso 1',
    dispositivo: 'DEV004',
    fecha: '17/05/2023',
    hora: '14:22',
    estado: 'en revisión',
    detalles: 'Se detectó un posible error de calibración en el dispositivo. Las lecturas podrían tener una desviación de hasta un 8%.',
    asignado: 'Carlos González'
  },
  {
    id: 'ALT006',
    tipo: 'informacion',
    mensaje: 'Mantenimiento programado',
    ubicacion: 'Edificio Central - Todos los pisos',
    dispositivo: 'Todos',
    fecha: '22/05/2023',
    hora: '03:00',
    estado: 'programada',
    detalles: 'Se realizará un mantenimiento programado del sistema. Los dispositivos podrían estar offline por aproximadamente 30 minutos durante la actualización.',
    asignado: 'Equipo de Mantenimiento'
  }
];

// Resumen de alertas
const resumenAlertas = {
  total: 15,
  errorCritico: 2,
  advertencia: 7,
  informacion: 6,
  noLeidas: 8,
  enRevision: 3,
  resueltas: 24
};

// Componente para el ícono según tipo de alerta
const IconoAlerta = ({ tipo }: { tipo: string }) => {
  switch (tipo) {
    case 'error':
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case 'advertencia':
      return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    case 'informacion':
      return <BellRing className="h-5 w-5 text-blue-600" />;
    default:
      return <BellRing className="h-5 w-5 text-gray-600" />;
  }
};

// Componente para el badge de estado
const BadgeEstado = ({ estado }: { estado: string }) => {
  switch (estado) {
    case 'activa':
      return (
        <Badge variant="outline" className="border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          Activa
        </Badge>
      );
    case 'en revisión':
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          En revisión
        </Badge>
      );
    case 'programada':
      return (
        <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Programada
        </Badge>
      );
    case 'resuelta':
      return (
        <Badge variant="outline" className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          Resuelta
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
          {estado}
        </Badge>
      );
  }
};

interface AlertasSistemaProps {
  reducida?: boolean;
}

export function AlertasSistema({ reducida = false }: AlertasSistemaProps) {
  const [alertaExpandida, setAlertaExpandida] = useState<string | null>(null);
  
  const toggleAlerta = (id: string) => {
    if (alertaExpandida === id) {
      setAlertaExpandida(null);
    } else {
      setAlertaExpandida(id);
    }
  };
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Críticas</div>
            <div className="text-xl font-bold text-red-600">{resumenAlertas.errorCritico}</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Advertencias</div>
            <div className="text-xl font-bold text-amber-600">{resumenAlertas.advertencia}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {alertas.slice(0, 3).map((alerta, index) => (
            <div key={index} className={`p-2 border rounded-lg ${
              alerta.tipo === 'error' ? 'border-red-100 bg-red-50 dark:border-red-800 dark:bg-red-900/10' :
              alerta.tipo === 'advertencia' ? 'border-amber-100 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10' :
              'border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
            }`}>
              <div className="flex items-start gap-2">
                <IconoAlerta tipo={alerta.tipo} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{alerta.mensaje}</div>
                  <div className="text-xs text-gray-500 truncate">{alerta.dispositivo} • {alerta.fecha}</div>
                </div>
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
            <BellRing className="h-6 w-6 text-orange-600" />
            Alertas del Sistema
          </h2>
          <p className="text-gray-500 mt-1">
            Monitoreo de eventos y alertas activas
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4" />
            Ordenar por
          </Button>
          <Button className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Marcar todo como leído
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-300">Alertas Críticas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{resumenAlertas.errorCritico}</div>
            <p className="text-sm text-gray-500 mt-1">Requieren atención inmediata</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-amber-800 dark:text-amber-300">Advertencias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{resumenAlertas.advertencia}</div>
            <p className="text-sm text-gray-500 mt-1">Requieren revisión próxima</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-300">Informativas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{resumenAlertas.informacion}</div>
            <p className="text-sm text-gray-500 mt-1">Notificaciones del sistema</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        {alertas.map((alerta, index) => (
          <div 
            key={index} 
            className={`border rounded-lg overflow-hidden ${
              alerta.tipo === 'error' ? 'border-red-200 dark:border-red-800' :
              alerta.tipo === 'advertencia' ? 'border-amber-200 dark:border-amber-800' :
              'border-blue-200 dark:border-blue-800'
            }`}
          >
            <div 
              className={`p-4 cursor-pointer ${
                alerta.tipo === 'error' ? 'bg-red-50 dark:bg-red-900/10' :
                alerta.tipo === 'advertencia' ? 'bg-amber-50 dark:bg-amber-900/10' :
                'bg-blue-50 dark:bg-blue-900/10'
              }`}
              onClick={() => toggleAlerta(alerta.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <IconoAlerta tipo={alerta.tipo} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      {alerta.mensaje}
                    </h3>
                    <BadgeEstado estado={alerta.estado} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5" />
                      <span>ID: {alerta.dispositivo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{alerta.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{alerta.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{alerta.hora}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-3">
                  {alertaExpandida === alerta.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            
            {alertaExpandida === alerta.id && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Detalles</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alerta.detalles}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {alerta.asignado ? `Asignado a: ${alerta.asignado}` : 'No asignado'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {alerta.estado !== 'resuelta' && (
                        <>
                          <Button variant="outline" size="sm">
                            Asignar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Marcar como visto
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resolver
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-500">
          Mostrando {alertas.length} de {resumenAlertas.total} alertas • {resumenAlertas.resueltas} alertas resueltas este mes
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Ver historial de alertas</Button>
          <Button variant="outline">Configurar notificaciones</Button>
        </div>
      </div>
    </div>
  );
} 