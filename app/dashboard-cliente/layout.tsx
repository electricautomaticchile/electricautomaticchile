"use client";

import { ProveedorWebSocket } from "@/lib/websocket/ProveedorWebSocket";
import { ClienteRoute } from "@/components/auth/protected-route";

/**
 * Layout para Dashboard Cliente
 * Envuelve el dashboard con el ProveedorWebSocket para habilitar
 * comunicación en tiempo real
 */
export default function DashboardClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClienteRoute>
      <ProveedorWebSocket>
        {children}
      </ProveedorWebSocket>
    </ClienteRoute>
  );
}
