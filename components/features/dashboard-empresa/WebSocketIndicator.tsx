"use client";

import { useWebSocket } from "@/lib/websocket/useWebSocket";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function WebSocketIndicator() {
  const { estaConectado, estadoConexion, latencia } = useWebSocket();

  if (estadoConexion === "conectado") {
    return (
      <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-300">
        <Wifi className="h-3 w-3" />
        Conectado
        {latencia && <span className="text-xs">({latencia}ms)</span>}
      </Badge>
    );
  }

  if (estadoConexion === "reconectando") {
    return (
      <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
        <Wifi className="h-3 w-3 animate-pulse" />
        Reconectando...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-300">
      <WifiOff className="h-3 w-3" />
      Desconectado
    </Badge>
  );
}
