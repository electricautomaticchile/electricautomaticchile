import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstadoExitoProps } from "../types";

export function EstadoExito({ cliente, onVolverClientes }: EstadoExitoProps) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
      <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />

      <h3 className="text-xl font-bold mb-2">
        ¡Cliente Registrado Exitosamente!
      </h3>

      <p className="text-green-700 mb-4">
        El cliente <strong>{cliente.nombre}</strong> se ha agregado a la
        plataforma y ahora puede comenzar a usar el sistema.
      </p>

      <div className="bg-white border border-green-300 rounded p-4 mb-4">
        <div className="text-sm text-green-600 space-y-1">
          <p>
            <strong>Número de cliente:</strong> {cliente.numeroCliente}
          </p>
          <p>
            <strong>Plan seleccionado:</strong> {cliente.planSeleccionado}
          </p>
          <p>
            <strong>Monto mensual:</strong> $
            {cliente.montoMensual?.toLocaleString("es-CL")}
          </p>
        </div>
      </div>

      <Button variant="outline" className="mx-auto" onClick={onVolverClientes}>
        Ver Clientes Registrados
      </Button>
    </div>
  );
}
