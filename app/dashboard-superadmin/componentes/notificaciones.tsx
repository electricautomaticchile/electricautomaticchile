"use client";
import { useState, useEffect, useCallback } from 'react';
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
import { useSocket } from '@/lib/hooks/useSocket';

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

interface NotificacionesProps {
  reducida?: boolean;
}

export function Notificaciones({ reducida = false }: NotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [resumenNotificaciones, setResumenNotificaciones] = useState({
    total: 0,
    noLeidas: 0,
    alertas: { total: 0, noLeidas: 0 },
    info: { total: 0, noLeidas: 0 },
    exito: { total: 0, noLeidas: 0 }
  });
  const [filtroActivo, setFiltroActivo] = useState('todas');
  const [cargando, setCargando] = useState(true);
  
  // Usar el contexto de sockets
  const { 
    notifications: socketNotifications, 
    markNotificationAsRead 
  } = useSocket();

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const response = await fetch('/api/notificaciones/listar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Formatear datos para adaptarlos a la interfaz
          const notificacionesFormateadas = data.notificaciones.map((n: any) => ({
            id: n._id,
            tipo: n.tipo,
            titulo: n.titulo,
            descripcion: n.descripcion,
            fecha: new Date(n.fecha).toLocaleDateString('es-ES'),
            tiempo: formatearTiempo(new Date(n.fecha)),
            leida: n.leida,
            prioridad: n.prioridad
          }));
          
          setNotificaciones(notificacionesFormateadas);
          setResumenNotificaciones(data.resumen);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarNotificaciones();
  }, []);
  
  // Actualizar el resumen de notificaciones
  const actualizarResumen = useCallback(() => {
    const total = notificaciones.length;
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    
    const alertas = notificaciones.filter(n => n.tipo === 'alerta').length;
    const alertasNoLeidas = notificaciones.filter(n => n.tipo === 'alerta' && !n.leida).length;
    
    const info = notificaciones.filter(n => n.tipo === 'info').length;
    const infoNoLeidas = notificaciones.filter(n => n.tipo === 'info' && !n.leida).length;
    
    const exito = notificaciones.filter(n => n.tipo === 'exito').length;
    const exitoNoLeidas = notificaciones.filter(n => n.tipo === 'exito' && !n.leida).length;
    
    setResumenNotificaciones({
      total,
      noLeidas,
      alertas: { total: alertas, noLeidas: alertasNoLeidas },
      info: { total: info, noLeidas: infoNoLeidas },
      exito: { total: exito, noLeidas: exitoNoLeidas }
    });
  }, [notificaciones]);
  
  // Integrar notificaciones de sockets con las cargadas desde la API
  useEffect(() => {
    if (socketNotifications.length > 0) {
      // Convertir formato de notificaciones de socket
      const nuevasNotificaciones = socketNotifications.map(n => ({
        id: n.id,
        tipo: n.tipo,
        titulo: n.titulo,
        descripcion: n.descripcion,
        fecha: new Date(n.fecha).toLocaleDateString('es-ES'),
        tiempo: formatearTiempo(new Date(n.fecha)),
        leida: n.leida,
        prioridad: n.prioridad
      }));
      
      // Actualizar estado combinando las notificaciones existentes con las nuevas
      // Evitando duplicados por ID
      setNotificaciones(prev => {
        const idsExistentes = prev.map(n => n.id);
        const notificacionesUnicas = nuevasNotificaciones.filter(n => !idsExistentes.includes(n.id));
        return [...notificacionesUnicas, ...prev];
      });
      
      // Actualizar resumen
      actualizarResumen();
    }
  }, [socketNotifications, actualizarResumen]);
  
  // Función para formatear el tiempo relativo
  const formatearTiempo = (fecha: Date): string => {
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fecha.getTime();
    const diferenciaMinutos = Math.floor(diferenciaMs / 60000);
    
    if (diferenciaMinutos < 1) return 'hace un momento';
    if (diferenciaMinutos < 60) return `hace ${diferenciaMinutos} minutos`;
    
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    if (diferenciaHoras < 24) return `hace ${diferenciaHoras} horas`;
    
    const diferenciaDias = Math.floor(diferenciaHoras / 24);
    if (diferenciaDias === 1) return 'ayer';
    if (diferenciaDias < 7) return `hace ${diferenciaDias} días`;
    
    return fecha.toLocaleDateString('es-ES');
  };
  
  const marcarComoLeida = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      
      // Actualizar estado local
      setNotificaciones(
        notificaciones.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
      
      // Actualizar resumen
      actualizarResumen();
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };
  
  const eliminarNotificacion = async (id: string) => {
    try {
      const response = await fetch(`/api/notificaciones/eliminar`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificacionId: id }),
      });
      
      if (response.ok) {
        // Actualizar estado local
        setNotificaciones(notificaciones.filter(notif => notif.id !== id));
        
        // Actualizar resumen
        actualizarResumen();
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };
  
  const marcarTodasComoLeidas = async () => {
    try {
      const response = await fetch('/api/notificaciones/marcar-todas-leidas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Actualizar estado local
        setNotificaciones(
          notificaciones.map(notif => ({ ...notif, leida: true }))
        );
        
        // Actualizar resumen
        actualizarResumen();
      }
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
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
  
  // Versión reducida para mostrar en un widget
  if (reducida) {
    return (
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-1">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            {resumenNotificaciones.noLeidas > 0 && (
              <Badge className="bg-blue-600">{resumenNotificaciones.noLeidas}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
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
  
  // Versión completa para la página de notificaciones
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        {resumenNotificaciones.noLeidas > 0 && (
          <Button 
            variant="outline" 
            onClick={marcarTodasComoLeidas}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
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
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Éxitos</p>
                <h3 className="text-2xl font-bold">{resumenNotificaciones.exito.total}</h3>
                {resumenNotificaciones.exito.noLeidas > 0 && (
                  <p className="text-xs text-green-600">
                    {resumenNotificaciones.exito.noLeidas} sin leer
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todas" onValueChange={setFiltroActivo} value={filtroActivo}>
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="noLeidas">No leídas</TabsTrigger>
            <TabsTrigger value="alerta">Alertas</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="exito">Éxitos</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={filtroActivo} className="mt-0">
          <div className="space-y-4">
            {cargando ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : notificacionesFiltradas.length > 0 ? (
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
                    
                    <div className="flex">
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
              <div className="text-center p-6 border rounded-lg border-dashed">
                <Bell className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-lg">No hay notificaciones</h3>
                <p className="text-gray-500 dark:text-gray-400">Las notificaciones aparecerán aquí cuando haya nuevas</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
} 