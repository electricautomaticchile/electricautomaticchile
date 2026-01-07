"use client";

import { useEffect, useState, useCallback } from "react";
import { TarifasService, CalculoConsumo } from "@/lib/api/services/tarifasService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, DollarSign } from "lucide-react";

interface ConsumoDisplayProps {
  clienteId: string;
  kwhActual: number;
  showDetails?: boolean;
}

export function ConsumoDisplay({ clienteId, kwhActual, showDetails = true }: ConsumoDisplayProps) {
  const [calculo, setCalculo] = useState<CalculoConsumo | null>(null);
  const [loading, setLoading] = useState(false);

  const calcularCosto = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TarifasService.calcularCostoCliente(clienteId, kwhActual);
      if (response.success && response.data) {
        setCalculo(response.data);
      }
    } catch (error) {
      console.error("Error calculando costo:", error);
    } finally {
      setLoading(false);
    }
  }, [clienteId, kwhActual]);

  useEffect(() => {
    if (clienteId && kwhActual > 0) {
      calcularCosto();
    }
  }, [clienteId, kwhActual, calcularCosto]);

  if (loading || !calculo) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <DollarSign className="h-4 w-4 animate-pulse" />
        <span>Calculando...</span>
      </div>
    );
  }

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-green-600" />
        <span className="font-semibold text-lg">${calculo.montoTotal.toLocaleString('es-CL')}</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-orange-600" />
          Consumo y Costo Actual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Consumo</p>
            <p className="text-2xl font-bold">{calculo.kwhConsumidos.toFixed(2)} kWh</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Costo Total</p>
            <p className="text-2xl font-bold text-green-600">
              ${calculo.montoTotal.toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Precio base</span>
            <span>${calculo.precioKwhBase.toFixed(3)} /kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Monto base</span>
            <span>${calculo.montoBase.toLocaleString('es-CL')}</span>
          </div>
          {calculo.montoEstabilizacion > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Cargo estabilización</span>
                <span>+${calculo.montoEstabilizacion.toLocaleString('es-CL')}</span>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {calculo.tramoEstabilizacion}
              </Badge>
            </>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total a pagar</span>
            <span className="text-green-600">${calculo.montoTotal.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
