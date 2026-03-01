"use client";

import { cn } from "@/lib/utils";

interface ElectricBoltProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

// SVG animado de rayo eléctrico - reemplaza el Zap genérico de lucide
export function ElectricBolt({ className, size = 40, animated = true }: ElectricBoltProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <style>{`
        @keyframes bolt-glow {
          0%, 100% { filter: drop-shadow(0 0 4px #f97316) drop-shadow(0 0 8px #f97316); opacity: 1; }
          50% { filter: drop-shadow(0 0 8px #f97316) drop-shadow(0 0 16px #fb923c); opacity: 0.85; }
        }
        @keyframes bolt-spark {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        .bolt-main { ${animated ? "animation: bolt-glow 2s ease-in-out infinite;" : ""} }
        .bolt-spark { ${animated ? "animation: bolt-spark 1.5s ease-in-out infinite;" : ""} }
        .bolt-spark-2 { ${animated ? "animation: bolt-spark 1.5s ease-in-out infinite 0.5s;" : ""} }
        .bolt-spark-3 { ${animated ? "animation: bolt-spark 1.5s ease-in-out infinite 1s;" : ""} }
      `}</style>

      {/* Rayo principal */}
      <path
        className="bolt-main"
        d="M23 4L10 22H20L17 36L30 18H20L23 4Z"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Chispas */}
      <circle className="bolt-spark" cx="8" cy="14" r="1.5" fill="#fb923c" />
      <circle className="bolt-spark-2" cx="32" cy="26" r="1.5" fill="#fb923c" />
      <circle className="bolt-spark-3" cx="6" cy="28" r="1" fill="#fdba74" />
      <circle className="bolt-spark" cx="34" cy="12" r="1" fill="#fdba74" />

      {/* Líneas de energía */}
      <line className="bolt-spark-2" x1="4" y1="20" x2="8" y2="20" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      <line className="bolt-spark-3" x1="32" y1="20" x2="36" y2="20" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Ícono de medidor eléctrico custom
export function MeterIcon({ className, size = 40, animated: _animated }: ElectricBoltProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Cuerpo del medidor */}
      <rect x="6" y="8" width="28" height="24" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      {/* Pantalla */}
      <rect x="10" y="12" width="20" height="8" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
      {/* Dígitos simulados */}
      <rect x="12" y="14" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.5" />
      <rect x="16.5" y="14" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.5" />
      <rect x="21" y="14" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.5" />
      <rect x="25.5" y="14" width="2.5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.5" />
      {/* Botones inferiores */}
      <circle cx="14" cy="26" r="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="26" r="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <circle cx="26" cy="26" r="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      {/* Tornillos */}
      <circle cx="9" cy="11" r="1" fill="currentColor" fillOpacity="0.4" />
      <circle cx="31" cy="11" r="1" fill="currentColor" fillOpacity="0.4" />
      <circle cx="9" cy="29" r="1" fill="currentColor" fillOpacity="0.4" />
      <circle cx="31" cy="29" r="1" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

// Ícono de control remoto / señal IoT
export function IoTSignalIcon({ className, size = 40, animated = true }: ElectricBoltProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <style>{`
        @keyframes signal-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .signal-1 { ${animated ? "animation: signal-pulse 1.5s ease-in-out infinite;" : ""} }
        .signal-2 { ${animated ? "animation: signal-pulse 1.5s ease-in-out infinite 0.3s;" : ""} }
        .signal-3 { ${animated ? "animation: signal-pulse 1.5s ease-in-out infinite 0.6s;" : ""} }
      `}</style>
      {/* Dispositivo central */}
      <rect x="14" y="18" width="12" height="14" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="25" r="2" fill="currentColor" />
      {/* Ondas de señal */}
      <path className="signal-1" d="M12 16 Q20 10 28 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path className="signal-2" d="M9 13 Q20 5 31 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path className="signal-3" d="M6 10 Q20 0 34 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
