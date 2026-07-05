"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUmbralesAlerta } from "./useUmbralesAlerta";

interface CampoUmbral {
  id: "voltajeMin" | "voltajeMax" | "corrienteMax" | "consumoMax";
  label: string;
  unidad: string;
  descripcion: string;
  step: string;
}

const CAMPOS: CampoUmbral[] = [
  {
    id: "voltajeMin",
    label: "Voltaje mínimo",
    unidad: "V",
    descripcion: "Por debajo de este valor se genera una alerta.",
    step: "1",
  },
  {
    id: "voltajeMax",
    label: "Voltaje máximo",
    unidad: "V",
    descripcion: "Por encima de este valor se genera una alerta.",
    step: "1",
  },
  {
    id: "corrienteMax",
    label: "Corriente máxima",
    unidad: "A",
    descripcion: "Corriente por sobre este límite dispara una alerta.",
    step: "1",
  },
  {
    id: "consumoMax",
    label: "Consumo máximo",
    unidad: "kWh",
    descripcion: "Consumo por sobre este umbral se marca como elevado.",
    step: "1",
  },
];

export function UmbralesAlerta() {
  const { umbrales, loading, saving, actualizar, guardar, restaurarDefaults } =
    useUmbralesAlerta();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-2">Cargando umbrales de alerta...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Umbrales de alerta</CardTitle>
              <CardDescription>
                Define los límites que disparan alertas de monitoreo para los
                dispositivos de tu empresa. Las alertas aparecen en la app y en
                la plataforma web.
              </CardDescription>
            </div>
            {umbrales.esDefault ? (
              <Badge variant="secondary">Valores por defecto</Badge>
            ) : (
              <Badge>Personalizados</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CAMPOS.map((campo) => (
              <div key={campo.id} className="space-y-2">
                <Label htmlFor={campo.id}>
                  {campo.label} ({campo.unidad})
                </Label>
                <Input
                  id={campo.id}
                  type="number"
                  min="0"
                  step={campo.step}
                  value={Number.isNaN(umbrales[campo.id]) ? "" : umbrales[campo.id]}
                  onChange={(e) =>
                    actualizar({ [campo.id]: parseFloat(e.target.value) })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {campo.descripcion}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
            ℹ️ Rango normal de referencia: voltaje 200–240 V, corriente hasta 50
            A, consumo hasta 100 kWh. Ajusta estos valores según tus equipos.
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={restaurarDefaults}
              disabled={saving}
            >
              Restaurar valores por defecto
            </Button>
            <Button type="button" onClick={guardar} disabled={saving}>
              {saving ? "Guardando..." : "Guardar umbrales"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
