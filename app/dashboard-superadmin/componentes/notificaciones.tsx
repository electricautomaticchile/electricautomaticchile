"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, Check, X, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Notificacion {
  id: string;
  tipo: 'alerta' | 'info' | 'exito';
  titulo: string;
  descripcion: string;
  fecha: string;
  tiempo: string;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
}

// Datos simulados
const notificacionesData: Notificacion[] = [
  {
    id: '1',
    tipo: 'alerta',
    titulo: 'Alerta de consumo excesivo',
    descripcion: 'Detectado consumo anormal en sector industrial de Santiago, 45% sobre el promedio habitual.',
    fecha: '2023-11-15',
    tiempo: 'hace 30 minutos',
    leida: false,
    prioridad: 'alta'
  },
  {
    id: '2',
    tipo: 'info',
    titulo: 'Nueva empresa registrada',
    descripcion: 'La empresa "Minera Los Pelambres" completó su registro en la plataforma.',
    fecha: '2023-11-15',
    tiempo: 'hace 2 horas',
    leida: false,
    prioridad: 'media'
  },
  {
    id: '3',
    tipo: 'alerta',
    titulo: 'Dispositivos desconectados',
    descripcion: '3 dispositivos de monitoreo desconectados en la zona de Antofagasta.',
    fecha: '2023-11-15',
    tiempo: 'hace 5 horas',
    leida: false,
    prioridad: 'alta'
  },
  {
    id: '4',
    tipo: 'exito',
    titulo: 'Mantenimiento completado',
    descripcion: 'Actualización de firmware completada exitosamente en 125 dispositivos.',
    fecha: '2023-11-14',
    tiempo: 'ayer',
    leida: true,
    prioridad: 'baja'
  },
  {
    id: '5',
    tipo: 'info',
    titulo: 'Reporte mensual generado',
    descripcion: 'El reporte de consumo de Octubre 2023 está disponible para revisión.',
    fecha: '2023-11-14',
    tiempo: 'ayer',
    leida: true,
    prioridad: 'media'
  },
  {
    id: '6',
    tipo: 'alerta',
    titulo: 'Error en sistema de facturación',
    descripcion: 'Se detectó un error en la generación de facturas para clientes industriales.',
    fecha: '2023-11-13',
    tiempo: 'hace 2 días',
    leida: true,
    prioridad: 'alta'
  },
  {
    id: '7',
    tipo: 'exito',
    titulo: 'Nuevas funciones implementadas',
    descripcion: 'Se han implementado nuevas funcionalidades de monitoreo en tiempo real.',
    fecha: '2023-11-13',
    tiempo: 'hace 2 días',
    leida: true,
    prioridad: 'baja'
  }
];

// Datos para tarjetas resumen
const resumenNotificaciones = {
  total: 7,
  noLeidas: 3,
  alertas: {
    total: 3,
    noLeidas: 2
  },
  info: {
    total: 2,
    noLeidas: 1
  },
  exito: {
    total: 2,
    noLeidas: 0
  }
};

interface NotificacionesProps {
  reducida?: boolean;
}

export function Notificaciones({ reducida = false }: NotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesData);
  const [filtroActivo, setFiltroActivo] = useState('todas');

  const marcarComoLeida = (id: string) => {
    setNotificaciones(
      notificaciones.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(notificaciones.filter(notif => notif.id !== id));
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones(
      notificaciones.map(notif => ({ ...notif, leida: true }))
    );
  };

  const getIconoNotificacion = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'exito':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getColorBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'media':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const notificacionesFiltradas = notificaciones.filter(notif => {
    if (filtroActivo === 'todas') return true;
    if (filtroActivo === 'noLeidas') return !notif.leida;
    return notif.tipo === filtroActivo;
  });

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Alertas y mensajes recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                {resumenNotificaciones.alertas.noLeidas} Alertas
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                {resumenNotificaciones.info.noLeidas} Info
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0">
              Ver todas
            </Button>
          </div>

          <div className="space-y-3">
            {notificaciones
              .filter(n => !n.leida)
              .slice(0, 3)
              .map(notif => (
                <div key={notif.id} className={`p-3 rounded-lg ${!notif.leida ? 'bg-gray-50 dark:bg-slate-900' : ''} border border-gray-100 dark:border-slate-800`}>
                  <div className="flex items-start gap-3">
                    {getIconoNotificacion(notif.tipo)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{notif.titulo}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {notif.descripcion}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{notif.tiempo}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-orange-600" />
          Centro de Notificaciones
        </h2>
        
        <Button variant="outline" size="sm" onClick={marcarTodasComoLeidas}>
          Marcar todas como leídas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <h3 className="text-2xl font-bold">{resumenNotificaciones.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alertas</p>
                <h3 className="text-2xl font-bold">{resumenNotificaciones.alertas.total}</h3>
                {resumenNotificaciones.alertas.noLeidas > 0 && (
                  <p className="text-xs text-red-600">
                    {resumenNotificaciones.alertas.noLeidas} sin leer
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Información</p>
                <h3 className="text-2xl font-bold">{resumenNotificaciones.info.total}</h3>
                {resumenNotificaciones.info.noLeidas > 0 && (
                  <p className="text-xs text-blue-600">
                    {resumenNotificaciones.info.noLeidas} sin leer
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todas" className="mb-4" onValueChange={setFiltroActivo}>
        <TabsList className="mb-4">
          <TabsTrigger value="todas">
            Todas
            {resumenNotificaciones.noLeidas > 0 && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                {resumenNotificaciones.noLeidas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="noLeidas">
            No leídas
            {resumenNotificaciones.noLeidas > 0 && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                {resumenNotificaciones.noLeidas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerta">
            Alertas
            {resumenNotificaciones.alertas.noLeidas > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                {resumenNotificaciones.alertas.noLeidas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="info">
            Información
            {resumenNotificaciones.info.noLeidas > 0 && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                {resumenNotificaciones.info.noLeidas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="exito">Éxitos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filtroActivo} className="mt-0">
          <div className="space-y-4">
            {notificacionesFiltradas.length > 0 ? (
              notificacionesFiltradas.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-lg ${!notif.leida ? 'bg-gray-50 dark:bg-slate-900' : ''} border border-gray-100 dark:border-slate-800`}
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      {getIconoNotificacion(notif.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notif.titulo}</h4>
                        <Badge className={`${getColorBadge(notif.prioridad)}`}>
                          {notif.prioridad}
                        </Badge>
                        {!notif.leida && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notif.descripcion}
                      </p>
                      <div className="text-xs text-gray-400 mt-2">{notif.tiempo}</div>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
                      {!notif.leida && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => marcarComoLeida(notif.id)}
                          className="h-8 w-8"
                          title="Marcar como leída"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => eliminarNotificacion(notif.id)}
                        className="h-8 w-8"
                        title="Eliminar notificación"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Posponer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay notificaciones que mostrar
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 