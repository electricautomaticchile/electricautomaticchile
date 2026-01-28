"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Power, PowerOff, Search, Users, Zap, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useClientesQuery } from '@/hooks/queries';
import { useArduinoCommand } from '@/hooks/queries';
import { useToast } from '@/components/ui/use-toast';
import { LoadingState, EmptyState } from '@/components/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistorialAccion {
  id: string;
  fecha: Date;
  accion: 'activar' | 'desactivar';
  clientesAfectados: number;
  usuario: string;
  motivo?: string;
}

export function ControlServicioMasivo() {
  const { toast } = useToast();
  const { data: clientesData, isLoading } = useClientesQuery();
  const arduinoCommand = useArduinoCommand();
  
  const clientes = clientesData?.data || [];
  
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [motivo, setMotivo] = useState('');
  const [historial, setHistorial] = useState<HistorialAccion[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const clientesFiltrados = clientes.filter((cliente: any) => {
    const matchBusqueda = cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         cliente.numeroCliente.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || cliente.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const toggleCliente = (clienteId: string) => {
    setClientesSeleccionados(prev =>
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const seleccionarTodos = () => {
    if (clientesSeleccionados.length === clientesFiltrados.length) {
      setClientesSeleccionados([]);
    } else {
      setClientesSeleccionados(clientesFiltrados.map((c: any) => c._id));
    }
  };

  const ejecutarAccionMasiva = async (accion: 'activar' | 'desactivar') => {
    if (clientesSeleccionados.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un cliente",
        variant: "destructive",
      });
      return;
    }

    const comando = accion === 'activar' ? 'ACTIVAR_SERVICIO' : 'DESACTIVAR_SERVICIO';
    
    try {
      for (const _clienteId of clientesSeleccionados) {
        await arduinoCommand.mutateAsync(comando);
      }

      const nuevaAccion: HistorialAccion = {
        id: Date.now().toString(),
        fecha: new Date(),
        accion,
        clientesAfectados: clientesSeleccionados.length,
        usuario: 'Usuario Actual',
        motivo: motivo || undefined,
      };

      setHistorial(prev => [nuevaAccion, ...prev]);
      setClientesSeleccionados([]);
      setMotivo('');

      toast({
        title: "Acción completada",
        description: `Servicio ${accion === 'activar' ? 'activado' : 'desactivado'} para ${clientesSeleccionados.length} cliente(s)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la acción masiva",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando clientes..." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Control de Servicio Masivo
              </CardTitle>
              <CardDescription>
                Gestiona el suministro eléctrico de múltiples clientes simultáneamente
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
            >
              <Clock className="h-4 w-4 mr-2" />
              {mostrarHistorial ? 'Ocultar' : 'Ver'} Historial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busqueda">Buscar Cliente</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Nombre o número..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro">Filtrar por Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger id="filtro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                  <SelectItem value="suspendido">Suspendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo (Opcional)</Label>
              <Input
                id="motivo"
                placeholder="Ej: Mantenimiento programado"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={clientesSeleccionados.length === clientesFiltrados.length && clientesFiltrados.length > 0}
                onCheckedChange={seleccionarTodos}
              />
              <div>
                <p className="font-medium">
                  {clientesSeleccionados.length} de {clientesFiltrados.length} seleccionados
                </p>
                <p className="text-sm text-muted-foreground">
                  Seleccionar todos los clientes filtrados
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => ejecutarAccionMasiva('activar')}
                disabled={clientesSeleccionados.length === 0 || arduinoCommand.isPending}
                className="gap-2"
              >
                <Power className="h-4 w-4" />
                Activar Servicio
              </Button>
              <Button
                variant="destructive"
                onClick={() => ejecutarAccionMasiva('desactivar')}
                disabled={clientesSeleccionados.length === 0 || arduinoCommand.isPending}
                className="gap-2"
              >
                <PowerOff className="h-4 w-4" />
                Desactivar Servicio
              </Button>
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="max-h-96 overflow-y-auto">
              {clientesFiltrados.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No hay clientes"
                  description="No se encontraron clientes con los filtros aplicados"
                />
              ) : (
                <div className="divide-y">
                  {clientesFiltrados.map((cliente: any) => (
                    <div
                      key={cliente._id}
                      className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={clientesSeleccionados.includes(cliente._id)}
                        onCheckedChange={() => toggleCliente(cliente._id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{cliente.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {cliente.numeroCliente} • {cliente.direccion}
                        </p>
                      </div>
                      <Badge
                        variant={
                          cliente.estado === 'activo'
                            ? 'default'
                            : cliente.estado === 'suspendido'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {cliente.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {mostrarHistorial && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Historial de Acciones Masivas
            </CardTitle>
            <CardDescription>
              Registro de todas las acciones de control masivo realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historial.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Sin historial"
                description="No se han realizado acciones masivas aún"
              />
            ) : (
              <div className="space-y-3">
                {historial.map((accion) => (
                  <div
                    key={accion.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          accion.accion === 'activar'
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {accion.accion === 'activar' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            Servicio {accion.accion === 'activar' ? 'Activado' : 'Desactivado'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {accion.clientesAfectados} cliente(s) afectados • {accion.usuario}
                          </p>
                          {accion.motivo && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Motivo: {accion.motivo}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {accion.fecha.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
