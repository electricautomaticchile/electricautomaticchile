"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HardwareControlDashboard } from "@/components/dashboard/HardwareControlDashboard";
import { useApi } from "@/lib/hooks/useApi";
import { Cpu, Zap, Settings } from "lucide-react";

export function ControlHardware() {
  const { user } = useApi();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Control Total</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Completo</div>
            <p className="text-xs text-muted-foreground">
              Acceso a todos los dispositivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comandos Disponibles
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Todos</div>
            <p className="text-xs text-muted-foreground">
              Incluyendo comandos críticos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuración</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Avanzada</div>
            <p className="text-xs text-muted-foreground">
              Configuración completa del sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard de control de hardware */}
      <Card>
        <CardHeader>
          <CardTitle>Control de Hardware en Tiempo Real</CardTitle>
          <CardDescription>
            Control completo de todos los dispositivos hardware del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HardwareControlDashboard
            userId={user?.id}
            userRole="superadmin"
            userType="admin"
            token={(user as any)?.token}
          />
        </CardContent>
      </Card>
    </div>
  );
}
