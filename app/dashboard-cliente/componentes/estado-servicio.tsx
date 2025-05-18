"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Power, AlertTriangle, Clock, Calendar, AlertCircle } from 'lucide-react';

interface EstadoServicioProps {
  reducida?: boolean;
  estadoActual: 'activo' | 'desactivado' | 'suspendido';
  onCambioEstado?: (nuevoEstado: 'activo' | 'desactivado') => void;
}

export function EstadoServicio({ 
  reducida = false, 
  estadoActual, 
  onCambioEstado 
}: EstadoServicioProps) {
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<'activar' | 'desactivar' | null>(null);
  const [informacionAbierta, setInformacionAbierta] = useState(false);
  
  // Historial simulado de cambios de estado
  const historialCambios = [
    { fecha: '15/11/2023', hora: '14:32', estado: 'activo', motivo: 'Reactivación por usuario' },
    { fecha: '12/11/2023', hora: '09:15', estado: 'desactivado', motivo: 'Desactivación por usuario' },
    { fecha: '10/11/2023', hora: '18:45', estado: 'activo', motivo: 'Reactivación por usuario' },
    { fecha: '05/11/2023', hora: '10:20', estado: 'desactivado', motivo: 'Desactivación programada para mantenimiento' },
    { fecha: '01/11/2023', hora: '00:00', estado: 'activo', motivo: 'Inicio de servicio' }
  ];
  
  // Abrir diálogo de confirmación para cambiar estado
  const confirmarCambioEstado = (accion: 'activar' | 'desactivar') => {
    setAccionPendiente(accion);
    setConfirmacionAbierta(true);
  };
  
  // Ejecutar cambio de estado con confirmación
  const ejecutarCambioEstado = () => {
    if (accionPendiente && onCambioEstado) {
      const nuevoEstado = accionPendiente === 'activar' ? 'activo' : 'desactivado';
      onCambioEstado(nuevoEstado);
    }
    setConfirmacionAbierta(false);
    setAccionPendiente(null);
  };
  
  // Tarjeta de información básica del estado
  const TarjetaEstado = () => (
    <div className={`p-4 rounded-lg ${
      estadoActual === 'activo' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' : 
      estadoActual === 'desactivado' ? 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700' :
      'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Power className={`h-5 w-5 ${
            estadoActual === 'activo' ? 'text-green-600 dark:text-green-500' : 
            estadoActual === 'desactivado' ? 'text-gray-600 dark:text-gray-400' :
            'text-red-600 dark:text-red-500'
          }`} />
          <span className="font-semibold text-lg">
            {estadoActual === 'activo' ? 'Servicio Activo' : 
             estadoActual === 'desactivado' ? 'Servicio Desactivado' :
             'Servicio Suspendido'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {estadoActual !== 'suspendido' && (
            <>
              {estadoActual === 'activo' ? (
                <Button 
                  variant="outline" 
                  className="border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600"
                  onClick={() => confirmarCambioEstado('desactivar')}
                >
                  Desactivar
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600"
                  onClick={() => confirmarCambioEstado('activar')}
                >
                  Activar
                </Button>
              )}
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setInformacionAbierta(true)}
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {estadoActual === 'suspendido' && (
        <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">El servicio ha sido suspendido. Por favor, contacte a soporte para reactivarlo.</span>
        </div>
      )}
    </div>
  );
  
  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Power className="h-5 w-5 text-orange-600" />
            Estado del Servicio
          </CardTitle>
          <CardDescription>
            Gestione el estado de su servicio eléctrico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TarjetaEstado />
          
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Último cambio de estado</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">{historialCambios[0].fecha} {historialCambios[0].hora}</span> - {historialCambios[0].motivo}
            </div>
          </div>
          
          <AlertDialog open={confirmacionAbierta} onOpenChange={setConfirmacionAbierta}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {accionPendiente === 'activar' ? 'Activar Servicio' : 'Desactivar Servicio'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {accionPendiente === 'activar' 
                    ? 'Esta acción activará su servicio eléctrico. ¿Está seguro de que desea continuar?'
                    : 'Esta acción desactivará su servicio eléctrico. ¿Está seguro de que desea continuar?'
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={ejecutarCambioEstado}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={informacionAbierta} onOpenChange={setInformacionAbierta}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Información del Servicio
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <p className="mb-2">Su servicio eléctrico actualmente está <span className="font-semibold">{estadoActual.toUpperCase()}</span>.</p>
                  <p>Puede activar o desactivar su servicio en cualquier momento. Tenga en cuenta que la activación puede tomar hasta 5 minutos en completarse.</p>
                  <p className="mt-2">Si su servicio ha sido suspendido, deberá contactar con soporte para resolver la situación.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Entendido</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Power className="h-6 w-6 text-orange-600" />
          Estado del Servicio
        </h2>
      </div>
      
      <div className="space-y-6">
        <TarjetaEstado />
        
        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Historial de Cambios
          </h3>
          
          <div className="space-y-3">
            {historialCambios.map((cambio, index) => (
              <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  cambio.estado === 'activo' ? 'bg-green-500' : 
                  cambio.estado === 'desactivado' ? 'bg-gray-500' : 
                  'bg-red-500'
                }`}></div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {cambio.fecha} {cambio.hora}
                </div>
                <div className="font-medium">
                  {cambio.estado === 'activo' ? 'Servicio Activado' : 
                   cambio.estado === 'desactivado' ? 'Servicio Desactivado' : 
                   'Servicio Suspendido'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex-1 text-right">
                  {cambio.motivo}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Información Importante
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>Puede activar o desactivar su servicio en cualquier momento según sus necesidades. No hay límite de cambios de estado.</p>
            <p>La activación del servicio puede tomar hasta 5 minutos en completarse. La desactivación es inmediata.</p>
            <p>Si su servicio ha sido suspendido por el administrador, deberá contactar con soporte para resolver la situación.</p>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300">Contacto Soporte:</p>
              <p>Teléfono: +56 2 2345 6789</p>
              <p>Email: soporte@electricauto.cl</p>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={confirmacionAbierta} onOpenChange={setConfirmacionAbierta}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {accionPendiente === 'activar' ? 'Activar Servicio' : 'Desactivar Servicio'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accionPendiente === 'activar' 
                ? 'Esta acción activará su servicio eléctrico. ¿Está seguro de que desea continuar?'
                : 'Esta acción desactivará su servicio eléctrico. ¿Está seguro de que desea continuar?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={ejecutarCambioEstado}>
              Confirmar {accionPendiente === 'activar' ? 'Activación' : 'Desactivación'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 