"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Zap,
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
  accuracy: number;
}

interface MapaBasicoProps {
  reducida?: boolean;
  ubicacion?: { lat: number; lng: number };
  direccionRegistrada?: string;
}

export function MapaBasico({ reducida = false, ubicacion, direccionRegistrada }: MapaBasicoProps) {
  const [medidorUbicacion, setMedidorUbicacion] = useState<UbicacionMedidor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const datosUbicacion: UbicacionMedidor = {
    coordinates: ubicacion || { lat: -33.4489, lng: -70.6693 },
    address: {
      street: "Av. Providencia",
      number: "1234",
      city: "Santiago",
      formattedAddress: direccionRegistrada || "Av. Providencia 1234, Providencia, Santiago",
    },
    status: 'validado',
    lastValidation: new Date(Date.now() - 2 * 60 * 60 * 1000),
    accuracy: 5,
  };

  useEffect(() => {
    cargarUbicacionMedidor();
  }, [ubicacion, direccionRegistrada]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarUbicacionMedidor = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMedidorUbicacion(datosUbicacion);
    } catch {
      setError('Error al cargar la ubicación del medidor');
    } finally {
      setLoading(false);
    }
  };

  const abrirEnGoogleMaps = () => {
    if (!medidorUbicacion) return;
    const { lat, lng } = medidorUbicacion.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !medidorUbicacion) {
    return (
      <div className="text-center py-8 space-y-3">
        <AlertTriangle className="h-8 w-8 text-white/20 mx-auto" />
        <p className="text-sm text-white/30">{error || 'No se pudo cargar la ubicación'}</p>
        <Button variant="outline" size="sm" onClick={cargarUbicacionMedidor}
          className="border-white/10 text-white/40 hover:bg-white/5 gap-2">
          <RefreshCw className="h-4 w-4" />Reintentar
        </Button>
      </div>
    );
  }

  const statusColor = medidorUbicacion.status === 'validado'
    ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    : medidorUbicacion.status === 'pendiente'
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-red-400 bg-red-500/10 border-red-500/30';

  const statusLabel = medidorUbicacion.status === 'validado' ? 'Validado'
    : medidorUbicacion.status === 'pendiente' ? 'Pendiente' : 'Error';

  if (reducida) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-white/60 truncate">{medidorUbicacion.address.formattedAddress}</span>
        </div>
        <Button size="sm" onClick={abrirEnGoogleMaps}
          className="w-full bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 gap-2">
          <Navigation className="h-4 w-4" />Ver en Google Maps
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mapa simulado */}
      <div className="relative h-64 rounded-xl overflow-hidden border border-white/10">
        {/* Fondo con gradiente tipo mapa */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f0f] via-[#0a1a2a] to-[#1a0a1a]" />
        {/* Grid de calles simuladas */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Avenidas principales */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(251,191,36,0.5) 2px, transparent 2px)", backgroundSize: "120px 120px" }} />

        {/* Pin central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            {/* Anillos de pulso */}
            <div className="relative flex items-center justify-center mx-auto w-20 h-20">
              <div className="absolute w-20 h-20 rounded-full bg-orange-500/20 animate-ping" />
              <div className="absolute w-14 h-14 rounded-full bg-orange-500/30" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
              <p className="font-semibold text-white text-xs">Medidor Eléctrico</p>
              <p className="text-white/50 text-xs mt-0.5">{medidorUbicacion.address.formattedAddress}</p>
            </div>
          </div>
        </div>

        {/* Badge precisión */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-amber-500/30 text-amber-400">
            Precisión: {medidorUbicacion.accuracy}m
          </span>
        </div>

        {/* Botón Google Maps */}
        <div className="absolute bottom-3 right-3">
          <Button size="sm" onClick={abrirEnGoogleMaps}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 gap-2 text-xs">
            <Navigation className="h-3.5 w-3.5 text-orange-400" />Abrir en Google Maps
          </Button>
        </div>
      </div>

      {/* Cards de estado */}
      <div className="grid grid-cols-3 gap-3">
        <div className="relative rounded-xl bg-[#0a0a0a] border border-green-500/30 overflow-hidden p-4 text-center">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-emerald-500" />
          <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
            <Zap className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-xs text-white/30 mb-1">Servicio</p>
          <p className="text-xs font-bold text-green-400">Activo</p>
        </div>

        <div className="relative rounded-xl bg-[#0a0a0a] border border-blue-500/30 overflow-hidden p-4 text-center">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-400 to-cyan-500" />
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-xs text-white/30 mb-1">GPS</p>
          <p className={`text-xs font-bold ${medidorUbicacion.status === 'validado' ? 'text-blue-400' : medidorUbicacion.status === 'pendiente' ? 'text-yellow-400' : 'text-red-400'}`}>
            {statusLabel}
          </p>
        </div>

        <div className="relative rounded-xl bg-[#0a0a0a] border border-orange-500/30 overflow-hidden p-4 text-center">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-400 to-red-500" />
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-2 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
            <RefreshCw className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-xs text-white/30 mb-1">Validación</p>
          <p className="text-xs font-bold text-orange-400">{medidorUbicacion.lastValidation?.toLocaleDateString('es-CL')}</p>
        </div>
      </div>

      {medidorUbicacion.status === 'validado' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-sm text-orange-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Medidor correctamente ubicado y validado. Servicio funcionando con normalidad.
        </div>
      )}
      {medidorUbicacion.status === 'pendiente' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-400">
          <RefreshCw className="h-4 w-4 shrink-0" />
          Validación en proceso. Tu servicio no se ve afectado.
        </div>
      )}
      {medidorUbicacion.status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Problema con la validación. Contacta a soporte si el servicio se ve afectado.
        </div>
      )}
    </div>
  );
}
