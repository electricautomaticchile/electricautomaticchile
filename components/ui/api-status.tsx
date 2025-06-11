"use client";

import { useApiConfig } from "@/lib/hooks/useApi";
import { Badge } from "./badge";
import { Button } from "./button";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ApiStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ApiStatus({
  showDetails = false,
  className = "",
}: ApiStatusProps) {
  const { config, checkConnection } = useApiConfig();

  const handleRefreshConnection = () => {
    checkConnection();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant={config.isConnected ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {config.isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        {config.isConnected ? "API Conectada" : "API Desconectada"}
      </Badge>

      {showDetails && (
        <>
          <span className="text-xs text-muted-foreground">
            {config.isProduction ? "Producción" : "Desarrollo"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshConnection}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
}

// Componente más completo para dashboards
export function ApiStatusPanel() {
  const { config, checkConnection } = useApiConfig();

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Estado de la API</h3>
        <Button variant="outline" size="sm" onClick={checkConnection}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Verificar
        </Button>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Estado:</span>
          <Badge variant={config.isConnected ? "default" : "destructive"}>
            {config.isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>

        <div className="flex justify-between text-sm">
          <span>URL:</span>
          <span className="text-muted-foreground font-mono text-xs">
            {config.baseUrl}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Entorno:</span>
          <span className="text-muted-foreground">
            {config.isProduction ? "Producción" : "Desarrollo"}
          </span>
        </div>
      </div>
    </div>
  );
}
