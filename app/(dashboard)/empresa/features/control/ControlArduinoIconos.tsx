import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Power,
  ToggleLeft,
  ToggleRight,
  Wifi,
  WifiOff,
  Activity,
  BarChart3,
  Clock,
  TrendingUp,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { STATUS_COLORS, BADGE_CONFIG, VALIDATORS } from './config';
import { ArduinoStatus } from './types';

// Componente para el icono de estado de conexión
export function StatusIcon({ 
  connected, 
  size = "h-4 w-4" 
}: { 
  connected: boolean; 
  size?: string; 
}) {
  if (connected) {
    return <Wifi className={`${size} ${STATUS_COLORS.connected.icon}`} />;
  }
  return <WifiOff className={`${size} ${STATUS_COLORS.disconnected.icon}`} />;
}

// Componente para el icono del LED
export function LedIcon({ 
  status, 
  size = "h-12 w-12" 
}: { 
  status: string; 
  size?: string; 
}) {
  const isOn = status === "ENCENDIDO";
  const colorClass = isOn ? STATUS_COLORS.ledOn.text : STATUS_COLORS.ledOff.text;
  
  return <Lightbulb className={`${size} ${colorClass}`} />;
}

// Componente para iconos de acciones
export function ActionIcon({ 
  action, 
  size = "h-4 w-4" 
}: { 
  action: string; 
  size?: string; 
}) {
  switch (action) {
    case "on":
    case "off":
      return <Power className={`${size}`} />;
    case "toggle":
      return <ToggleLeft className={`${size}`} />;
    case "refresh":
      return <RefreshCw className={`${size}`} />;
    case "connect":
      return <Wifi className={`${size}`} />;
    case "disconnect":
      return <WifiOff className={`${size}`} />;
    default:
      return <Activity className={`${size}`} />;
  }
}

// Componente para iconos de estadísticas
export function StatsIcon({ 
  type, 
  size = "h-5 w-5" 
}: { 
  type: string; 
  size?: string; 
}) {
  switch (type) {
    case "total_commands":
      return <BarChart3 className={`${size} text-blue-600`} />;
    case "on_commands":
      return <Power className={`${size} text-green-600`} />;
    case "avg_duration":
      return <Clock className={`${size} text-orange-600`} />;
    case "efficiency_percentage":
      return <TrendingUp className={`${size} text-purple-600`} />;
    default:
      return <Activity className={`${size} text-gray-600`} />;
  }
}

// Componente para badge de estado del LED
export function LedStatusBadge({ status }: { status: string }) {
  const isOn = status === "ENCENDIDO";
  const config = isOn ? BADGE_CONFIG.ledOn : BADGE_CONFIG.ledOff;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
}

// Componente para badge de estado de conexión
export function ConnectionStatusBadge({ connected }: { connected: boolean }) {
  const config = connected ? BADGE_CONFIG.connected : BADGE_CONFIG.disconnected;
  const label = connected ? "Conectado" : "Desconectado";
  
  return (
    <Badge variant={config.variant} className={config.className}>
      <StatusIcon connected={connected} size="h-3 w-3" />
      <span className="ml-1">{label}</span>
    </Badge>
  );
}

// Componente para badge de botón físico
export function PhysicalButtonBadge({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <Badge variant="outline" className={BADGE_CONFIG.physicalButton.className}>
      🔘 Físico
    </Badge>
  );
}

// Componente para el indicador visual del LED (circulo grande)
export function LedVisualIndicator({ status }: { status: string }) {
  const isOn = status === "ENCENDIDO";
  const bgClass = isOn ? STATUS_COLORS.ledOn.bg : STATUS_COLORS.ledOff.bg;
  const borderClass = isOn ? STATUS_COLORS.ledOn.border : STATUS_COLORS.ledOff.border;
  const shadowClass = isOn ? STATUS_COLORS.ledOn.shadow : "";
  
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${bgClass} ${borderClass} ${shadowClass}`}
      >
        <LedIcon status={status} size="h-12 w-12" />
      </div>
    </div>
  );
}

// Componente para iconos de estado del sistema
export function SystemStatusIcon({ 
  status, 
  size = "h-5 w-5" 
}: { 
  status: 'success' | 'error' | 'warning' | 'info'; 
  size?: string; 
}) {
  switch (status) {
    case 'success':
      return <CheckCircle className={`${size} text-green-600`} />;
    case 'error':
      return <XCircle className={`${size} text-red-600`} />;
    case 'warning':
      return <AlertCircle className={`${size} text-amber-600`} />;
    case 'info':
      return <Activity className={`${size} text-blue-600`} />;
    default:
      return <Activity className={`${size} text-gray-600`} />;
  }
}

// Componente para indicador de actividad (spinning)
export function ActivityIndicator({ 
  active, 
  size = "h-4 w-4" 
}: { 
  active: boolean; 
  size?: string; 
}) {
  return (
    <RefreshCw 
      className={`${size} ${active ? "animate-spin text-blue-600" : "text-gray-400"}`} 
    />
  );
}

// Componente para toggle visual
export function ToggleIcon({ 
  status, 
  size = "h-4 w-4" 
}: { 
  status: string; 
  size?: string; 
}) {
  const isOn = status === "ENCENDIDO";
  return isOn ? 
    <ToggleRight className={`${size} text-green-600`} /> : 
    <ToggleLeft className={`${size} text-gray-400`} />;
}

// Componente combinado para estado completo
export function ComprehensiveStatusIndicator({ status }: { status: ArduinoStatus }) {
  const hasPhysicalActivity = status.recent_messages.some(msg => 
    VALIDATORS.isPhysicalButton(msg)
  );
  
  return (
    <div className="flex items-center gap-2">
      <ConnectionStatusBadge connected={status.connected} />
      <LedStatusBadge status={status.led_status} />
      <PhysicalButtonBadge show={hasPhysicalActivity} />
    </div>
  );
}

// Componente para iconos de exportación
export function ExportIcon({ 
  format, 
  size = "h-4 w-4" 
}: { 
  format: string; 
  size?: string; 
}) {
  // Todos los formatos usan el mismo icono por simplicidad
  return <BarChart3 className={`${size} text-blue-600`} />;
}
