"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Home,
  Zap
} from 'lucide-react';

interface UbicacionMedidor {
  coordinates: { lat: number; lng: number };
  address: {
    street: string;
    number?: string;
    city: string;
    formattedAddress: string;
  };
  status: 'validado' | 'pendiente' | 'error';
  lastValidation?: Date;
  accuracy: number; // metros
}

interface MapaBasicoProps {
  reducida?: boolean;
  ubicacion?: { lat: number; lng: number };
  direccionRegistrada?: string;
}

export function MapaBasico({ 
  reducida = false, 
  ubicacion,
  direccionRegistrada 
}: MapaBasicoProps) {
  const [medidorUbicacion, setMedidorUbicacion] = useState<UbicacionMedidor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const datosUbicacion: UbicacionMedidor = {
    coordinates: ubicacion || { lat: -33.4489, lng: -70.6693 },
    address: {
      street: "Av. Providencia",
      number: "1234",
      city: "Santiago",
      formattedAddress: direccionRegistrada || "Av. Providencia 1234, Providencia, Santiago"
    },
    status: 'validado',
    lastValidation: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    accuracy: 5 // 5 metros de precisión
  };

  useEffect(() => {
    cargarUbicacionMedidor();
  }, [ubicacion, direccionRegistrada]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarUbicacionMedidor = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se haría la llamada real a la API
      // const response = await fetch('/api/medidor/ubicacion', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ubicacion, direccionRegistrada })
      // });
      // const data = await response.json();
      
      setMedidorUbicacion(datosUbicacion);
    } catch (err) {
      setError('Error al cargar la ubicación del medidor');
    } finally {
      setLoading(false);
    }
  };

  const abrirEnGoogleMaps = () => {
    if (!medidorUbicacion) return;
    
    const { lat, lng } = medidorUbicacion.coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getStatusInfo = (status: UbicacionMedidor['status']) => {
    switch (status) {
      case 'validado':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          icon: <CheckCircle className="h-4 w-4" />,
          texto: 'Ubicación Validada'
        };
      case 'pendiente':
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          icon: <RefreshCw className="h-4 w-4" />,
          texto: 'Validación Pendiente'
        };
      case 'error':
        return {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          icon: <AlertTriangle className="h-4 w-4" />,
          texto: 'Error de Ubicación'
        };
    }
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Ubicación del Medidor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !medidorUbicacion) {
    return (
      <Card className={reducida ? "h-48" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Ubicación del Medidor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              {error || 'No se pudo cargar la ubicación'}
            </p>
            <Button variant="outline" size="sm" onClick={cargarUbicacionMedidor}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(medidorUbicacion.status);

  if (reducida) {
    return (
      <Card className="h-48 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Ubicación del Medidor
          </CardTitle>
          <CardDescription className="text-xs">
            {medidorUbicacion.address.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              <span className={`font-medium text-xs ${statusInfo.color}`}>
                {statusInfo.texto}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Home className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">
                  {medidorUbicacion.address.street} {medidorUbicacion.address.number}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Navigation className="h-3 w-3 text-muted-foreground" />
                <span>Precisión: {medidorUbicacion.accuracy}m</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={abrirEnGoogleMaps}
            >
              Ver en Mapa
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Ubicación de su Medidor Eléctrico
              </CardTitle>
              <CardDescription>
                Información de ubicación y validación GPS de su medidor
              </CardDescription>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
              {statusInfo.icon}
              <span className={`font-medium text-sm ${statusInfo.color}`}>
                {statusInfo.texto}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Información de dirección */}
          <Card className="border-muted mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-600" />
                    Dirección Registrada
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Calle:</strong> {medidorUbicacion.address.street} {medidorUbicacion.address.number}
                    </p>
                    <p className="text-sm">
                      <strong>Ciudad:</strong> {medidorUbicacion.address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {medidorUbicacion.address.formattedAddress}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    Coordenadas GPS
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Latitud:</strong> {medidorUbicacion.coordinates.lat.toFixed(6)}
                    </p>
                    <p className="text-sm">
                      <strong>Longitud:</strong> {medidorUbicacion.coordinates.lng.toFixed(6)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Precisión: {medidorUbicacion.accuracy}m
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa simulado */}
          <Card className="border-muted mb-6">
            <CardContent className="p-0">
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg overflow-hidden">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Su Medidor Eléctrico</p>
                      <p className="text-sm text-muted-foreground">
                        {medidorUbicacion.address.street} {medidorUbicacion.address.number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Indicadores de precisión */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800">
                    Precisión GPS: {medidorUbicacion.accuracy}m
                  </Badge>
                </div>

                {/* Controles del mapa */}
                <div className="absolute bottom-4 right-4 space-y-2">
                  <Button 
                    size="sm" 
                    onClick={abrirEnGoogleMaps}
                    className="bg-white/90 text-gray-800 hover:bg-white"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Abrir en Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de validación */}
          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Estado de Validación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Estado del Servicio</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Activo
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Validación GPS</span>
                  </div>
                  <Badge variant={medidorUbicacion.status === 'validado' ? 'default' : 'secondary'}>
                    {statusInfo.texto}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Última Validación</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {medidorUbicacion.lastValidation?.toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>

              {medidorUbicacion.status === 'validado' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Su medidor está correctamente ubicado y validado. El servicio eléctrico 
                    está funcionando normalmente en la dirección registrada.
                  </p>
                </div>
              )}

              {medidorUbicacion.status === 'pendiente' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⏳ La validación de ubicación está en proceso. Esto puede tomar algunas horas.
                    Su servicio no se ve afectado durante este proceso.
                  </p>
                </div>
              )}

              {medidorUbicacion.status === 'error' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ⚠️ Hay un problema con la validación de ubicación. Si su servicio funciona 
                    normalmente, contacte a soporte para resolver esta situación.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botón de actualización */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={cargarUbicacionMedidor} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Ubicación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}