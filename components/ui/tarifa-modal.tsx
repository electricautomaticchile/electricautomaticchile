"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tarifa, TarifasService } from "@/lib/api/services/tarifasService";
import { useToast } from "@/components/ui/use-toast";

interface TarifaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarifa?: Tarifa | null;
  onSuccess: () => void;
}

export function TarifaModal({ isOpen, onClose, tarifa, onSuccess }: TarifaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    distribuidora: "",
    tipoTarifa: "",
    comuna: "",
    redTipo: "",
    vigenciaDesde: "",
    vigenciaHasta: "",
    cargoEnergia: 0,
    cargoTransmision: 0,
    cargoServicioPublico: 0,
    precioKwhBase: 0,
    peajeDistribucion: 0,
    hasta350Kwh: 0,
    entre350Y500: 0,
    mayor500Kwh: 0,
    activa: true,
  });

  useEffect(() => {
    if (tarifa) {
      setFormData({
        distribuidora: tarifa.distribuidora,
        tipoTarifa: tarifa.tipoTarifa,
        comuna: tarifa.comuna,
        redTipo: tarifa.redTipo,
        vigenciaDesde: tarifa.vigenciaDesde.split('T')[0],
        vigenciaHasta: tarifa.vigenciaHasta.split('T')[0],
        cargoEnergia: tarifa.cargoEnergia,
        cargoTransmision: tarifa.cargoTransmision,
        cargoServicioPublico: tarifa.cargoServicioPublico,
        precioKwhBase: tarifa.precioKwhBase,
        peajeDistribucion: tarifa.peajeDistribucion,
        hasta350Kwh: tarifa.tramosEstabilizacion.hasta350Kwh,
        entre350Y500: tarifa.tramosEstabilizacion.entre350Y500,
        mayor500Kwh: tarifa.tramosEstabilizacion.mayor500Kwh,
        activa: tarifa.activa,
      });
    } else {
      setFormData({
        distribuidora: "",
        tipoTarifa: "",
        comuna: "",
        redTipo: "",
        vigenciaDesde: "",
        vigenciaHasta: "",
        cargoEnergia: 0,
        cargoTransmision: 0,
        cargoServicioPublico: 0,
        precioKwhBase: 0,
        peajeDistribucion: 0,
        hasta350Kwh: 0,
        entre350Y500: 0,
        mayor500Kwh: 0,
        activa: true,
      });
    }
  }, [tarifa, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tarifaData = {
        distribuidora: formData.distribuidora,
        tipoTarifa: formData.tipoTarifa,
        comuna: formData.comuna,
        redTipo: formData.redTipo,
        vigenciaDesde: new Date(formData.vigenciaDesde).toISOString(),
        vigenciaHasta: new Date(formData.vigenciaHasta).toISOString(),
        cargoEnergia: formData.cargoEnergia,
        cargoTransmision: formData.cargoTransmision,
        cargoServicioPublico: formData.cargoServicioPublico,
        precioKwhBase: formData.precioKwhBase,
        peajeDistribucion: formData.peajeDistribucion,
        tramosEstabilizacion: {
          hasta350Kwh: formData.hasta350Kwh,
          entre350Y500: formData.entre350Y500,
          mayor500Kwh: formData.mayor500Kwh,
        },
        activa: formData.activa,
      };

      let response;
      if (tarifa) {
        response = await TarifasService.actualizarTarifa(tarifa._id, tarifaData);
      } else {
        response = await TarifasService.crearTarifa(tarifaData);
      }

      if (response.success) {
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al guardar tarifa",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar tarifa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tarifa ? "Editar Tarifa" : "Nueva Tarifa"}</DialogTitle>
          <DialogDescription>
            {tarifa ? "Modifica los datos de la tarifa" : "Ingresa los datos de la nueva tarifa eléctrica"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distribuidora">Distribuidora</Label>
              <Input
                id="distribuidora"
                value={formData.distribuidora}
                onChange={(e) => setFormData({ ...formData, distribuidora: e.target.value })}
                placeholder="Ej: Chilquinta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoTarifa">Tipo de Tarifa</Label>
              <Input
                id="tipoTarifa"
                value={formData.tipoTarifa}
                onChange={(e) => setFormData({ ...formData, tipoTarifa: e.target.value })}
                placeholder="Ej: BT1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna</Label>
              <Input
                id="comuna"
                value={formData.comuna}
                onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                placeholder="Ej: Villa Alemana"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redTipo">Tipo de Red</Label>
              <Input
                id="redTipo"
                value={formData.redTipo}
                onChange={(e) => setFormData({ ...formData, redTipo: e.target.value })}
                placeholder="Ej: C0 Aéreo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vigenciaDesde">Vigencia Desde</Label>
              <Input
                id="vigenciaDesde"
                type="date"
                value={formData.vigenciaDesde}
                onChange={(e) => setFormData({ ...formData, vigenciaDesde: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vigenciaHasta">Vigencia Hasta</Label>
              <Input
                id="vigenciaHasta"
                type="date"
                value={formData.vigenciaHasta}
                onChange={(e) => setFormData({ ...formData, vigenciaHasta: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Componentes del Precio ($/kWh)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargoEnergia">Cargo por Energía</Label>
                <Input
                  id="cargoEnergia"
                  type="number"
                  step="0.001"
                  value={formData.cargoEnergia}
                  onChange={(e) => setFormData({ ...formData, cargoEnergia: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargoTransmision">Cargo por Transmisión</Label>
                <Input
                  id="cargoTransmision"
                  type="number"
                  step="0.001"
                  value={formData.cargoTransmision}
                  onChange={(e) => setFormData({ ...formData, cargoTransmision: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargoServicioPublico">Cargo Servicio Público</Label>
                <Input
                  id="cargoServicioPublico"
                  type="number"
                  step="0.001"
                  value={formData.cargoServicioPublico}
                  onChange={(e) => setFormData({ ...formData, cargoServicioPublico: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peajeDistribucion">Peaje Distribución</Label>
                <Input
                  id="peajeDistribucion"
                  type="number"
                  step="0.001"
                  value={formData.peajeDistribucion}
                  onChange={(e) => setFormData({ ...formData, peajeDistribucion: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="precioKwhBase">Precio Base Total ($/kWh)</Label>
                <Input
                  id="precioKwhBase"
                  type="number"
                  step="0.001"
                  value={formData.precioKwhBase}
                  onChange={(e) => setFormData({ ...formData, precioKwhBase: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Tramos de Estabilización (Ley 21.667)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hasta350Kwh">≤350 kWh</Label>
                <Input
                  id="hasta350Kwh"
                  type="number"
                  step="0.001"
                  value={formData.hasta350Kwh}
                  onChange={(e) => setFormData({ ...formData, hasta350Kwh: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entre350Y500">350-500 kWh</Label>
                <Input
                  id="entre350Y500"
                  type="number"
                  step="0.001"
                  value={formData.entre350Y500}
                  onChange={(e) => setFormData({ ...formData, entre350Y500: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mayor500Kwh">&gt;500 kWh</Label>
                <Input
                  id="mayor500Kwh"
                  type="number"
                  step="0.001"
                  value={formData.mayor500Kwh}
                  onChange={(e) => setFormData({ ...formData, mayor500Kwh: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : tarifa ? "Actualizar" : "Crear"} Tarifa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
