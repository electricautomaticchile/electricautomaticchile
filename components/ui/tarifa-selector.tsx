"use client";

import { useState, useEffect } from "react";
import { TarifasService, Tarifa } from "@/lib/api/services/tarifasService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TarifaSelectorProps {
  value?: string;
  onChange: (tarifaId: string, tarifa?: Tarifa) => void;
  comuna?: string;
  tipoTarifa?: string;
}

export function TarifaSelector({ value, onChange, comuna, tipoTarifa }: TarifaSelectorProps) {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(false);
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState<Tarifa | null>(null);

  useEffect(() => {
    cargarTarifas();
  }, []);

  useEffect(() => {
    if (value && tarifas.length > 0) {
      const tarifa = tarifas.find(t => t._id === value);
      setTarifaSeleccionada(tarifa || null);
    }
  }, [value, tarifas]);

  const cargarTarifas = async () => {
    setLoading(true);
    try {
      const response = await TarifasService.obtenerTarifas();
      if (response.success && response.data) {
        setTarifas(response.data);
      }
    } catch (error) {
      console.error("Error cargando tarifas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (tarifaId: string) => {
    const tarifa = tarifas.find(t => t._id === tarifaId);
    setTarifaSeleccionada(tarifa || null);
    onChange(tarifaId, tarifa);
  };

  const tarifasFiltradas = tarifas.filter(t => {
    if (comuna && t.comuna !== comuna) return false;
    if (tipoTarifa && t.tipoTarifa !== tipoTarifa) return false;
    return t.activa;
  });

  return (
    <div className="space-y-2">
      <Label>Tarifa Eléctrica</Label>
      <Select value={value} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar tarifa" />
        </SelectTrigger>
        <SelectContent>
          {tarifasFiltradas.map((tarifa) => (
            <SelectItem key={tarifa._id} value={tarifa._id}>
              {tarifa.distribuidora} - {tarifa.tipoTarifa} - {tarifa.comuna}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {tarifaSeleccionada && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Precio base:</span>
            <span className="font-semibold">${tarifaSeleccionada.precioKwhBase.toFixed(3)} /kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Distribuidora:</span>
            <span>{tarifaSeleccionada.distribuidora}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
            <Badge variant="outline">{tarifaSeleccionada.tipoTarifa}</Badge>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tramos estabilización:
            <div className="ml-2 mt-1">
              <div>≤350 kWh: +${tarifaSeleccionada.tramosEstabilizacion.hasta350Kwh.toFixed(3)}</div>
              <div>350-500 kWh: +${tarifaSeleccionada.tramosEstabilizacion.entre350Y500.toFixed(3)}</div>
              <div>&gt;500 kWh: +${tarifaSeleccionada.tramosEstabilizacion.mayor500Kwh.toFixed(3)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
