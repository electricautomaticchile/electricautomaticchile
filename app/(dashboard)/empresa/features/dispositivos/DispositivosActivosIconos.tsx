import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Wifi,
  WifiOff,
  Bluetooth,
  Zap,
} from "lucide-react";

// Componente para el ícono de batería según nivel
export function BateriaIcon({ nivel }: { nivel: number }) {
  if (nivel >= 80) return <BatteryFull className="h-4 w-4 text-green-600" />;
  if (nivel >= 50) return <BatteryCharging className="h-4 w-4 text-blue-600" />;
  if (nivel >= 20) return <BatteryLow className="h-4 w-4 text-amber-600" />;
  return <BatteryWarning className="h-4 w-4 text-red-600" />;
}

// Componente para el estado con ícono
export function EstadoDispositivo({ estado }: { estado: string }) {
  switch (estado) {
    case "activo":
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-600">Activo</span>
        </div>
      );
    case "inactivo":
      return (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-500">Inactivo</span>
        </div>
      );
    case "mantenimiento":
      return (
        <div className="flex items-center gap-1.5">
          <RotateCw className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-600">Mantenimiento</span>
        </div>
      );
    case "alerta":
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-amber-600">Alerta</span>
        </div>
      );
    default:
      return null;
  }
}

// Componente para el ícono de conexión
export function IconoConexion({
  tipo,
  senal,
}: {
  tipo: string;
  senal?: number;
}) {
  switch (tipo) {
    case "Wifi":
      return senal && senal > 70 ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-600" />
      );
    case "Ethernet":
      return <Zap className="h-4 w-4 text-blue-600" />;
    case "4G":
      return (
        <div className="w-4 h-4 bg-purple-600 rounded text-xs text-white flex items-center justify-center font-bold">
          4G
        </div>
      );
    case "Bluetooth":
      return <Bluetooth className="h-4 w-4 text-indigo-600" />;
    default:
      return <WifiOff className="h-4 w-4 text-gray-500" />;
  }
}

// Componente para mostrar el nivel de señal
export function NivelSenal({ valor, tipo }: { valor: number; tipo: string }) {
  const getColorSenal = (nivel: number) => {
    if (nivel >= 80) return "text-green-600";
    if (nivel >= 60) return "text-blue-600";
    if (nivel >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getDescripcionSenal = (nivel: number) => {
    if (nivel >= 80) return "Excelente";
    if (nivel >= 60) return "Buena";
    if (nivel >= 40) return "Regular";
    return "Mala";
  };

  if (tipo === "Ethernet") {
    return (
      <div className="flex items-center gap-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 max-w-16">
          <div className="bg-green-600 h-1.5 rounded-full w-full"></div>
        </div>
        <span className="text-xs text-green-600 font-medium">100%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 max-w-16">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            valor >= 80
              ? "bg-green-600"
              : valor >= 60
                ? "bg-blue-600"
                : valor >= 40
                  ? "bg-amber-600"
                  : "bg-red-600"
          }`}
          style={{ width: `${valor}%` }}
        ></div>
      </div>
      <span className={`text-xs font-medium ${getColorSenal(valor)}`}>
        {valor}%
      </span>
    </div>
  );
}

// Componente para mostrar el nivel de batería con barra
export function NivelBateria({ valor }: { valor: number }) {
  const getColorBateria = (nivel: number) => {
    if (nivel >= 80) return "bg-green-600";
    if (nivel >= 50) return "bg-blue-600";
    if (nivel >= 20) return "bg-amber-600";
    return "bg-red-600";
  };

  const getColorTexto = (nivel: number) => {
    if (nivel >= 80) return "text-green-600";
    if (nivel >= 50) return "text-blue-600";
    if (nivel >= 20) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-2">
      <BateriaIcon nivel={valor} />
      <div className="flex items-center gap-1">
        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${getColorBateria(valor)}`}
            style={{ width: `${valor}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${getColorTexto(valor)}`}>
          {valor}%
        </span>
      </div>
    </div>
  );
}

// Componente para mostrar temperatura
export function TemperaturaIndicador({ valor }: { valor?: number }) {
  if (!valor) return null;

  const getColorTemperatura = (temp: number) => {
    if (temp >= 35) return "text-red-600";
    if (temp >= 30) return "text-amber-600";
    if (temp >= 20) return "text-green-600";
    return "text-blue-600";
  };

  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-red-400"></div>
      <span className={`text-xs font-medium ${getColorTemperatura(valor)}`}>
        {valor}°C
      </span>
    </div>
  );
}

// Badge de estado mejorado
export function BadgeEstado({ estado }: { estado: string }) {
  const getEstiloEstado = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "inactivo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      case "mantenimiento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "alerta":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstiloEstado(estado)}`}
    >
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}
