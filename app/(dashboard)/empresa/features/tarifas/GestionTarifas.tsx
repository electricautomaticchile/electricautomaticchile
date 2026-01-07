"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TarifasService, Tarifa } from "@/lib/api/services/tarifasService";
import { RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GestionTarifas() {
  const { toast } = useToast();
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarTarifas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TarifasService.obtenerTarifas();
      if (response.success && response.data) {
        setTarifas(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al cargar tarifas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar tarifas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargarTarifas();
  }, [cargarTarifas]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Gestión de Tarifas Eléctricas
              </CardTitle>
              <CardDescription>
                Administra las tarifas de suministro eléctrico por comuna y tipo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cargarTarifas}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {tarifas.map((tarifa) => (
              <Card key={tarifa._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {tarifa.distribuidora} - {tarifa.tipoTarifa}
                        </h3>
                        {tarifa.activa && (
                          <Badge variant="default" className="bg-green-600">Activa</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tarifa.comuna} - {tarifa.redTipo}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Precio Base</p>
                          <p className="font-semibold">${tarifa.precioKwhBase.toFixed(3)} /kWh</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Cargo Energía</p>
                          <p className="font-semibold">${tarifa.cargoEnergia.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Transmisión</p>
                          <p className="font-semibold">${tarifa.cargoTransmision.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Peaje Distribución</p>
                          <p className="font-semibold">${tarifa.peajeDistribucion.toFixed(3)}</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs font-semibold mb-2">Tramos Estabilización (Ley 21.667)</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">≤350 kWh:</span>
                            <span className="ml-1 font-semibold">+${tarifa.tramosEstabilizacion.hasta350Kwh.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">350-500 kWh:</span>
                            <span className="ml-1 font-semibold">+${tarifa.tramosEstabilizacion.entre350Y500.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">&gt;500 kWh:</span>
                            <span className="ml-1 font-semibold">+${tarifa.tramosEstabilizacion.mayor500Kwh.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Vigencia: {new Date(tarifa.vigenciaDesde).toLocaleDateString('es-CL')} - {new Date(tarifa.vigenciaHasta).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {tarifas.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay tarifas configuradas</p>
                <p className="text-sm mt-2">Ejecuta el seed para cargar las tarifas de la V Región</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
