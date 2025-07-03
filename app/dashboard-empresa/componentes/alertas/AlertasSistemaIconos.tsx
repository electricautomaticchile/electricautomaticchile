import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import { COLORES_ALERTA, ETIQUETAS_TIPO } from './config';

// Componente para el ícono según tipo de alerta
export function IconoAlerta({ tipo }: { tipo: string }) {
  const colorClass = COLORES_ALERTA[tipo as keyof typeof COLORES_ALERTA]?.icon || "text-gray-600";
  
  switch (tipo) {
    case "error":
      return <AlertTriangle className={`h-5 w-5 ${colorClass}`} />;
    case "advertencia":
      return <AlertTriangle className={`h-5 w-5 ${colorClass}`} />;
    case "informacion":
      return <BellRing className={`h-5 w-5 ${colorClass}`} />;
    case "exito":
      return <CheckCircle2 className={`h-5 w-5 ${colorClass}`} />;
    default:
      return <BellRing className="h-5 w-5 text-gray-600" />;
  }
}

// Componente para el badge de tipo
export function BadgeTipo({ tipo }: { tipo: string }) {
  const config = COLORES_ALERTA[tipo as keyof typeof COLORES_ALERTA];
  const etiqueta = ETIQUETAS_TIPO[tipo as keyof typeof ETIQUETAS_TIPO] || tipo;
  
  if (!config) {
    return (
      <Badge
        variant="outline"
        className="border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
      >
        {etiqueta}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={config.badge}
    >
      {etiqueta}
    </Badge>
  );
}

// Componente para iconos pequeños en versión reducida
export function IconoAlertaReducido({ tipo }: { tipo: string }) {
  const colorClass = COLORES_ALERTA[tipo as keyof typeof COLORES_ALERTA]?.icon || "text-gray-600";
  
  switch (tipo) {
    case "error":
      return <AlertTriangle className={`h-4 w-4 ${colorClass}`} />;
    case "advertencia":
      return <AlertTriangle className={`h-4 w-4 ${colorClass}`} />;
    case "informacion":
      return <BellRing className={`h-4 w-4 ${colorClass}`} />;
    case "exito":
      return <CheckCircle2 className={`h-4 w-4 ${colorClass}`} />;
    default:
      return <BellRing className="h-4 w-4 text-gray-600" />;
  }
}

// Componente para indicador de estado leída/no leída
export function IndicadorEstado({ leida }: { leida: boolean }) {
  if (leida) return null;
  
  return (
    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
  );
}

// Componente para badge de importancia
export function BadgeImportante({ importante }: { importante: boolean }) {
  if (!importante) return null;
  
  return (
    <Badge
      variant="outline"
      className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
    >
      <AlertTriangle className="h-3 w-3 mr-1" />
      Importante
    </Badge>
  );
}

// Componente para badge de tiempo real
export function BadgeTiempoReal({ conectado }: { conectado: boolean }) {
  if (!conectado) return null;
  
  return (
    <Badge
      variant="outline"
      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    >
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
      Tiempo real
    </Badge>
  );
}
