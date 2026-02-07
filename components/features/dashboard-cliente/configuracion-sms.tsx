'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bell, MessageSquare, AlertCircle } from 'lucide-react';

interface ConfiguracionSMSProps {
  clienteId: string;
  notificacionesSMS: boolean;
  esTerceraEdad: boolean;
  telefono: string;
  onUpdate: () => void;
}

export function ConfiguracionSMS({
  clienteId,
  notificacionesSMS,
  esTerceraEdad,
  telefono,
  onUpdate,
}: ConfiguracionSMSProps) {
  const [smsEnabled, setSmsEnabled] = useState(notificacionesSMS);
  const [terceraEdad, setTerceraEdad] = useState(esTerceraEdad);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGuardar = async () => {
    if (!telefono) {
      toast({
        title: 'Error',
        description: 'Debes agregar un número de teléfono en tu perfil',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificacionesSms: smsEnabled,
          esTerceraEdad: terceraEdad,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar configuración');

      toast({
        title: 'Configuración actualizada',
        description: 'Tus preferencias de notificaciones SMS han sido guardadas',
      });

      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Notificaciones SMS
        </CardTitle>
        <CardDescription>
          Configura las notificaciones por mensaje de texto (servicio Infobip)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!telefono && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              Agrega un número de teléfono en tu perfil para recibir notificaciones SMS
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-enabled" className="text-base">
                Activar notificaciones SMS
              </Label>
              <p className="text-sm text-muted-foreground">
                Recibe avisos de consumo cada 15 días y alertas de boletas impagas
              </p>
            </div>
            <Switch
              id="sms-enabled"
              checked={smsEnabled}
              onCheckedChange={setSmsEnabled}
              disabled={!telefono}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tercera-edad" className="text-base">
                Soy persona de tercera edad
              </Label>
              <p className="text-sm text-muted-foreground">
                Activa esta opción para recibir notificaciones especiales
              </p>
            </div>
            <Switch
              id="tercera-edad"
              checked={terceraEdad}
              onCheckedChange={setTerceraEdad}
            />
          </div>
        </div>

        {smsEnabled && (
          <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Recibirás SMS sobre:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                  <li>Consumo acumulado cada 15 días (día 1 y 15 de cada mes)</li>
                  <li>Aviso de corte de servicio después de 3 boletas impagas</li>
                  <li>Confirmación de pagos realizados</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleGuardar}
          disabled={loading || !telefono}
          className="w-full"
        >
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </CardContent>
    </Card>
  );
}
