"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, User, FileText, Send, Eye, Clock, FileCheck, UserPlus, ArrowRight, ExternalLink } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { RegistroClientes } from './registro-clientes';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { apiService, ICotizacion } from '@/lib/api/apiService';

// Constantes
const ITEMS_POR_PAGINA = 10;

// Tipos para las cotizaciones - usar el tipo de la API
type Cotizacion = ICotizacion;

// Función para formatear el tipo de servicio
const formatServicio = (servicio: string): string => {
  if (servicio === 'cotizacion_reposicion') return 'Sistema de Reposición';
  if (servicio === 'cotizacion_monitoreo') return 'Sistema de Monitoreo';
  if (servicio === 'cotizacion_mantenimiento') return 'Mantenimiento';
  if (servicio === 'cotizacion_completa') return 'Solución Integral';
  return servicio.replace('cotizacion_', '').split('_').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Componente para mostrar el estado de la cotización
const EstadoBadge = ({ estado }: { estado: ICotizacion['estado'] }) => {
  const getVariant = (): string => {
    switch (estado) {
      case 'pendiente': return 'outline';
      case 'en_revision': return 'secondary';
      case 'cotizando': return 'default';
      case 'cotizada': return 'default';
      case 'aprobada': return 'success';
      case 'rechazada': return 'destructive';
      case 'convertida_cliente': return 'success';
      default: return 'outline';
    }
  };

  const getColor = (): string => {
    switch (estado) {
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'en_revision': return 'text-blue-600 bg-blue-100';
      case 'cotizando': return 'text-purple-600 bg-purple-100';
      case 'cotizada': return 'text-blue-600 bg-blue-100';
      case 'aprobada': return 'text-green-600 bg-green-100';
      case 'rechazada': return 'text-red-600 bg-red-100';
      case 'convertida_cliente': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTexto = (): string => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_revision': return 'En Revisión';
      case 'cotizando': return 'Cotizando';
      case 'cotizada': return 'Cotizada';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      case 'convertida_cliente': return 'Cliente';
      default: return estado;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
      {getTexto()}
    </span>
  );
};

interface CotizacionesDashboardProps {
  reducida?: boolean;
}

export function CotizacionesDashboard({ reducida = false }: CotizacionesDashboardProps) {
  // Estado para las cotizaciones
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<Cotizacion | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarRegistroCliente, setMostrarRegistroCliente] = useState(false);
  const [activeTab, setActiveTab] = useState("cotizaciones");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<ICotizacion['estado']>("pendiente");
  const [nuevoMonto, setNuevoMonto] = useState<string>('');
  const [nuevosComentarios, setNuevosComentarios] = useState<string>('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cotizacionAEliminar, setCotizacionAEliminar] = useState<string | null>(null);
  const { toast } = useToast();
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    prioridad: 'todas',
    servicio: 'todos'
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);

  // Cargar las cotizaciones desde la API
  const cargarCotizaciones = async () => {
    try {
      console.log('Iniciando carga de cotizaciones...');
      setIsLoading(true);
      
      // Preparar parámetros para la API
      const params: any = {
        page: paginaActual,
        limit: ITEMS_POR_PAGINA
      };

      if (filtros.estado && filtros.estado !== 'todos') {
        params.estado = filtros.estado;
      }
      if (filtros.prioridad && filtros.prioridad !== 'todas') {
        params.prioridad = filtros.prioridad;
      }
      if (filtros.servicio && filtros.servicio !== 'todos') {
        params.servicio = filtros.servicio;
      }

      console.log('Parámetros de consulta:', params);

      // Llamar a la API
      const response = await apiService.obtenerCotizaciones(params);
      
      console.log('Respuesta de la API:', response);
      
      if (response.success && response.data) {
        console.log('Cotizaciones obtenidas:', response.data.length);
        setCotizaciones(response.data);
        
        // Si hay información de paginación, usarla
        if (response.pagination) {
          setTotalPaginas(response.pagination.totalPages);
        } else {
          // Calcular páginas basado en el número de resultados
          const totalItems = response.data.length;
          setTotalPaginas(Math.ceil(totalItems / ITEMS_POR_PAGINA));
        }
      } else {
        console.error('Error cargando cotizaciones:', response.error);
        setCotizaciones([]);
      }
    } catch (error) {
      console.error('Error cargando cotizaciones:', error);
      setCotizaciones([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar las cotizaciones al montar el componente
  useEffect(() => {
    cargarCotizaciones();
  }, [filtros, paginaActual]);
  
  // Actualizar el estado de una cotización
  const actualizarCotizacion = async (id: string, estado: ICotizacion['estado'], monto?: number, comentarios?: string) => {
    try {
      setIsUpdating(true);
      setErrorMsg(null);
      
      const response = await fetch('/api/cotizaciones', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          estado,
          ...(monto && { monto }),
          ...(comentarios && { comentarios })
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la cotización');
      }
      
      // Actualizar la cotización en el estado local
      setCotizaciones(prevCotizaciones => 
        prevCotizaciones.map(c => 
          c._id === id 
            ? { 
                ...c, 
                estado, 
                ...(monto && { monto }),
                ...(comentarios && { comentarios })
              } 
            : c
        )
      );
      
      // Si estamos actualizando la cotización seleccionada, actualizarla
      if (cotizacionSeleccionada && cotizacionSeleccionada._id === id) {
        setCotizacionSeleccionada({
          ...cotizacionSeleccionada,
          estado,
          ...(monto && { monto }),
          ...(comentarios && { comentarios })
        });
      }
      
      // Limpiar los campos del formulario
      setNuevoEstado("pendiente");
      setNuevoMonto('');
      setNuevosComentarios('');
      
      // Cerrar el diálogo de detalles si está abierto
      setMostrarDetalles(false);
      
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      setErrorMsg('Ocurrió un error al actualizar la cotización. Por favor, intente nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Confirmar eliminación de cotización
  const confirmarEliminarCotizacion = (id: string) => {
    setCotizacionAEliminar(id);
    setMostrarConfirmacion(true);
  };
  
  // Eliminar cotización
  const eliminarCotizacion = async () => {
    if (!cotizacionAEliminar) return;
    
    try {
      setIsUpdating(true);
      setErrorMsg(null);
      
      const response = await fetch(`/api/cotizaciones?id=${cotizacionAEliminar}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la cotización');
      }
      
      // Eliminar la cotización del estado local
      setCotizaciones(prevCotizaciones => 
        prevCotizaciones.filter(c => c._id !== cotizacionAEliminar)
      );
      
      // Cerrar el diálogo de confirmación
      setMostrarConfirmacion(false);
      setCotizacionAEliminar(null);
      
      // Cerrar el diálogo de detalles si la cotización eliminada es la seleccionada
      if (cotizacionSeleccionada && cotizacionSeleccionada._id === cotizacionAEliminar) {
        setMostrarDetalles(false);
        setCotizacionSeleccionada(null);
      }
      
      // Mostrar notificación de éxito
      toast({
        title: "Cotización eliminada",
        description: "La cotización ha sido eliminada correctamente.",
        variant: "success"
      });
      
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      setErrorMsg('Ocurrió un error al eliminar la cotización. Por favor, intente nuevamente.');
      
      // Mostrar notificación de error
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la cotización. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Cancelar eliminación
  const cancelarEliminarCotizacion = () => {
    setMostrarConfirmacion(false);
    setCotizacionAEliminar(null);
  };
  
  // Manejar el envío del formulario de actualización
  const handleActualizarCotizacion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cotizacionSeleccionada || !nuevoEstado) {
      return;
    }
    
    const montoNumerico = nuevoMonto ? parseFloat(nuevoMonto) : undefined;
    const comentarios = nuevosComentarios || undefined;
    
    actualizarCotizacion(
      cotizacionSeleccionada._id, 
      nuevoEstado as ICotizacion['estado'],
      montoNumerico,
      comentarios
    );
  };
  
  // Obtener estadísticas de cotizaciones
  const getEstadisticas = () => {
    return {
      total: cotizaciones.length,
      pendientes: cotizaciones.filter(c => c.estado === 'pendiente').length,
      aprobadas: cotizaciones.filter(c => c.estado === 'aprobada').length,
      cotizadas: cotizaciones.filter(c => c.estado === 'cotizada').length,
      urgentes: cotizaciones.filter(c => c.plazo === 'urgente').length
    };
  };
  
  const estadisticas = getEstadisticas();
  
  // Función para ver detalles de una cotización
  const verDetalleCotizacion = (cotizacion: Cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarDetalles(true);
    
    // Inicializar los campos de formulario con los valores actuales
    setNuevoEstado(cotizacion.estado);
    setNuevoMonto(cotizacion.total?.toString() || '');
    setNuevosComentarios(cotizacion.notas || '');
  };
  
  // Función para registrar un cliente desde una cotización
  const iniciarRegistroCliente = (cotizacion: Cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarDetalles(false);
    setMostrarRegistroCliente(true);
    setActiveTab("registro");
  };
  
  // Renderizar versión reducida para dashboard
  if (reducida) {
    // Mostrar solo las más recientes
    const cotizacionesRecientes = cotizaciones.slice(0, 4);
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Cotizaciones Recientes</CardTitle>
              <CardDescription>Gestión de solicitudes de clientes</CardDescription>
            </div>
            <Link href="/dashboard-superadmin/cotizaciones">
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                Ver todas <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Cargando cotizaciones...</div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{estadisticas.total}</div>
                  <div className="text-xs text-orange-800 dark:text-orange-300">Total cotizaciones</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{estadisticas.pendientes}</div>
                  <div className="text-xs text-yellow-800 dark:text-yellow-300">Pendientes</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{estadisticas.cotizadas}</div>
                  <div className="text-xs text-purple-800 dark:text-purple-300">Cotizadas</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticas.aprobadas}</div>
                  <div className="text-xs text-green-800 dark:text-green-300">Aprobadas</div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cotizacionesRecientes.map((cotizacion) => (
                      <TableRow key={cotizacion._id}>
                        <TableCell>
                          <div className="font-medium">{cotizacion.nombre}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {cotizacion.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatServicio(cotizacion.servicio)}</div>
                        </TableCell>
                        <TableCell>
                          <EstadoBadge estado={cotizacion.estado} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm">{format(new Date(cotizacion.fechaCreacion), 'dd MMM', { locale: es })}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Renderizar el diálogo de detalles de cotización
  const renderDetallesCotizacion = () => {
    if (!cotizacionSeleccionada) return null;
    
    return (
      <Dialog open={mostrarDetalles} onOpenChange={setMostrarDetalles}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles de Cotización</DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de cotización
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Información del Cliente</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-semibold">Nombre:</span> {cotizacionSeleccionada.nombre}</p>
                <p><span className="font-semibold">Email:</span> {cotizacionSeleccionada.email}</p>
                {cotizacionSeleccionada.empresa && (
                  <p><span className="font-semibold">Empresa:</span> {cotizacionSeleccionada.empresa}</p>
                )}
                {cotizacionSeleccionada.telefono && (
                  <p><span className="font-semibold">Teléfono:</span> {cotizacionSeleccionada.telefono}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Detalles de la Solicitud</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-semibold">Servicio:</span> {formatServicio(cotizacionSeleccionada.servicio)}
                </p>
                {cotizacionSeleccionada.plazo && (
                  <p>
                    <span className="font-semibold">Plazo:</span> {cotizacionSeleccionada.plazo}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Fecha:</span> {
                    format(new Date(cotizacionSeleccionada.fechaCreacion), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
                  }
                </p>
                <p>
                  <span className="font-semibold">Estado actual:</span> <EstadoBadge estado={cotizacionSeleccionada.estado} />
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Mensaje</h3>
            <div className="mt-2 p-3  rounded-md">
              <p className="whitespace-pre-wrap">{cotizacionSeleccionada.mensaje}</p>
            </div>
          </div>
          
          {/* Formulario para actualizar la cotización */}
          <form onSubmit={handleActualizarCotizacion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium">
                  Actualizar Estado
                </label>
                <select
                  id="estado"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value as ICotizacion['estado'])}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="" disabled>Seleccionar estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="cotizando">Cotizando</option>
                  <option value="cotizada">Cotizada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="convertida_cliente">Cliente</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="monto" className="block text-sm font-medium">
                  Monto (opcional)
                </label>
                <input
                  type="number"
                  id="monto"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  placeholder="Ej: 1500000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="comentarios" className="block text-sm font-medium">
                Comentarios (opcional)
              </label>
              <textarea
                id="comentarios"
                value={nuevosComentarios}
                onChange={(e) => setNuevosComentarios(e.target.value)}
                rows={3}
                placeholder="Detalles adicionales o comentarios sobre la cotización"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {errorMsg}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isUpdating || !nuevoEstado}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar Cotización'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => cotizacionSeleccionada && iniciarRegistroCliente(cotizacionSeleccionada)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrar como Cliente
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  setMostrarDetalles(false);
                  confirmarEliminarCotizacion(cotizacionSeleccionada._id);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Eliminar Cotización
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Versión completa del componente
  return (
    <div className="space-y-4">
      <Tabs defaultValue="cotizaciones" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cotizaciones" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gestión de Cotizaciones
          </TabsTrigger>
          <TabsTrigger value="registro" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Registro de Clientes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cotizaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Gestión de Cotizaciones</CardTitle>
              <CardDescription>
                Administre todas las solicitudes de cotización de sus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{estadisticas.total}</div>
                  <div className="text-sm text-orange-800 dark:text-orange-300">Total cotizaciones</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{estadisticas.pendientes}</div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">Pendientes</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {cotizaciones.filter(c => c.estado === 'en_revision').length}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">Revisadas</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{estadisticas.cotizadas}</div>
                  <div className="text-sm text-purple-800 dark:text-purple-300">Cotizadas</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{estadisticas.aprobadas}</div>
                  <div className="text-sm text-green-800 dark:text-green-300">Aprobadas</div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-10">Cargando cotizaciones...</div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cotizaciones.map((cotizacion) => (
                        <TableRow key={cotizacion._id}>
                          <TableCell>
                            <div className="font-medium">{cotizacion.nombre}</div>
                            <div className="text-sm text-muted-foreground">{cotizacion.email}</div>
                          </TableCell>
                          <TableCell>{formatServicio(cotizacion.servicio)}</TableCell>
                          <TableCell>
                            {format(new Date(cotizacion.fechaCreacion), 'dd MMM yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>
                            <EstadoBadge estado={cotizacion.estado} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => verDetalleCotizacion(cotizacion)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver</span>
                              </Button>
                              
                              {(cotizacion.estado === 'aprobada' || cotizacion.estado === 'cotizada') && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-orange-600 hover:text-orange-700"
                                  onClick={() => iniciarRegistroCliente(cotizacion)}
                                >
                                  <UserPlus className="h-4 w-4" />
                                  <span className="sr-only">Registrar Cliente</span>
                                </Button>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => confirmarEliminarCotizacion(cotizacion._id)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="registro" className="mt-6">
          {cotizacionSeleccionada && mostrarRegistroCliente ? (
            <div>
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">Registro desde Cotización Aprobada</CardTitle>
                      <CardDescription>Creando un nuevo cliente basado en la cotización #{cotizacionSeleccionada._id}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("cotizaciones")}>
                      Volver a Cotizaciones
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-orange-800">Detalles de la cotización aprobada</h3>
                        <dl className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <dt className="text-gray-500">Cliente:</dt>
                            <dd className="font-medium">{cotizacionSeleccionada.nombre}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Email:</dt>
                            <dd>{cotizacionSeleccionada.email}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Teléfono:</dt>
                            <dd>{cotizacionSeleccionada.telefono || 'No especificado'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Empresa:</dt>
                            <dd>{cotizacionSeleccionada.empresa || 'No especificada'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Servicio:</dt>
                            <dd>{formatServicio(cotizacionSeleccionada.servicio)}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Monto:</dt>
                            <dd className="font-medium">${cotizacionSeleccionada.total?.toLocaleString() || 'No especificado'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Comentarios:</dt>
                            <dd>{cotizacionSeleccionada.notas || 'Sin comentarios'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <RegistroClientes 
                cotizacionInicial={{
                  nombre: cotizacionSeleccionada.nombre,
                  correo: cotizacionSeleccionada.email,
                  telefono: cotizacionSeleccionada.telefono || '',
                  empresa: cotizacionSeleccionada.empresa || '',
                  montoMensual: cotizacionSeleccionada.total || 0,
                  planSugerido: 
                    cotizacionSeleccionada.servicio === 'cotizacion_reposicion' ? 'estandar' : 
                    cotizacionSeleccionada.servicio === 'cotizacion_monitoreo' ? 'basico' : 
                    cotizacionSeleccionada.servicio === 'cotizacion_completa' ? 'premium' : 'basico'
                }}
                onComplete={() => {
                  setActiveTab("cotizaciones");
                  setMostrarRegistroCliente(false);
                  setCotizacionSeleccionada(null);
                }}
              />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Registro de Clientes</CardTitle>
                <CardDescription>
                  Registre nuevos clientes en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserPlus className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Registrar un nuevo cliente</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    Puede crear un cliente desde cero o seleccionar una cotización aprobada para completar el registro automáticamente.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setActiveTab("cotizaciones")}>
                      Seleccionar una cotización
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setMostrarRegistroCliente(true)}>
                      Crear cliente desde cero
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {mostrarRegistroCliente && !cotizacionSeleccionada && <RegistroClientes />}
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de detalles */}
      {renderDetallesCotizacion()}
      
      {/* Modal de registro de cliente */}
      <Dialog open={mostrarRegistroCliente} onOpenChange={setMostrarRegistroCliente}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Complete los datos para registrar un nuevo cliente desde esta cotización
            </DialogDescription>
          </DialogHeader>
          
          {cotizacionSeleccionada && (
            <RegistroClientes 
              cotizacionInicial={{
                nombre: cotizacionSeleccionada.nombre,
                correo: cotizacionSeleccionada.email,
                telefono: cotizacionSeleccionada.telefono || '',
                empresa: cotizacionSeleccionada.empresa,
                montoMensual: cotizacionSeleccionada.total || 0,
                planSugerido: cotizacionSeleccionada.servicio === 'cotizacion_completa' ? 'premium' : 'basico'
              }}
              onComplete={() => {
                setMostrarRegistroCliente(false);
                // Actualizar cotización a estado "aprobada" después de registrar cliente
                actualizarCotizacion(cotizacionSeleccionada._id, 'aprobada');
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar cotización */}
      <Dialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar esta cotización? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Al eliminar esta cotización, se perderán todos los datos asociados, incluyendo los comentarios y el historial de cambios.
            </p>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={cancelarEliminarCotizacion}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={eliminarCotizacion}
              disabled={isUpdating}
            >
              {isUpdating ? 'Eliminando...' : 'Eliminar Cotización'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Componente para mostrar notificaciones */}
      <Toaster />
    </div>
  );
} 