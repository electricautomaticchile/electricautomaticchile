import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SelectorPlanesProps } from "../types";

export function SelectorPlanes({
  planes,
  planSeleccionado,
  onPlanSeleccionado,
  planAbierto,
  onPlanAbierto,
  planesExpandidos,
  onTogglePlanExpandido,
}: SelectorPlanesProps) {
  const planElegido = planes.find((plan) => plan.id === planSeleccionado);

  return (
    <div className="space-y-4">
      {/* Selector principal */}
      <Popover open={planAbierto} onOpenChange={onPlanAbierto}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={planAbierto}
            className="w-full justify-between"
          >
            {planElegido ? planElegido.nombre : "Seleccionar plan..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar plan..." />
            <CommandEmpty>No se encontraron planes.</CommandEmpty>
            <CommandGroup>
              {planes.map((plan) => (
                <CommandItem
                  key={plan.id}
                  value={plan.id}
                  onSelect={() => onPlanSeleccionado(plan.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      planSeleccionado === plan.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{plan.nombre}</div>
                    <div className="text-sm text-gray-500">
                      ${plan.precio.toLocaleString("es-CL")}/mes
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Lista de planes con detalles */}
      <div className="space-y-3">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              planSeleccionado === plan.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onPlanSeleccionado(plan.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      planSeleccionado === plan.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )}
                  >
                    {planSeleccionado === plan.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{plan.nombre}</h4>
                    <p className="text-sm text-gray-600">{plan.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ${plan.precio.toLocaleString("es-CL")}
                  </div>
                  <div className="text-sm text-gray-500">por mes</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => onTogglePlanExpandido(plan.id, e)}
                  className="p-1"
                >
                  {planesExpandidos[plan.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Características expandibles */}
            {planesExpandidos[plan.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium mb-2">Características incluidas:</h5>
                <ul className="space-y-1">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Puedes cambiar el plan del cliente en
          cualquier momento desde su perfil. Los cambios se aplicarán en el
          próximo ciclo de facturación.
        </p>
      </div>
    </div>
  );
}
