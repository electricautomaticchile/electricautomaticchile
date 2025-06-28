import { ICotizacion } from "@/lib/api/apiService";

interface EstadoBadgeProps {
  estado: ICotizacion["estado"];
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const getColor = (): string => {
    switch (estado) {
      case "pendiente":
        return "text-yellow-600 bg-yellow-100";
      case "en_revision":
        return "text-blue-600 bg-blue-100";
      case "cotizando":
        return "text-purple-600 bg-purple-100";
      case "cotizada":
        return "text-blue-600 bg-blue-100";
      case "aprobada":
        return "text-green-600 bg-green-100";
      case "rechazada":
        return "text-red-600 bg-red-100";
      case "convertida_cliente":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTexto = (): string => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en_revision":
        return "En Revisión";
      case "cotizando":
        return "Cotizando";
      case "cotizada":
        return "Cotizada";
      case "aprobada":
        return "Aprobada";
      case "rechazada":
        return "Rechazada";
      case "convertida_cliente":
        return "Cliente";
      default:
        return estado;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}
    >
      {getTexto()}
    </span>
  );
}
