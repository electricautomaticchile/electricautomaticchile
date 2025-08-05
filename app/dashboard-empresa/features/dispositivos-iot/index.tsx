"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Zap,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DispositivosIoTProps {
  reducida?: boolean;
  onVerMas?: () => void;
}

export function DispositivosIoT({
  reducida = false,
  onVerMas,
}: DispositivosIoTProps) {
  const [activeTab, setActiveTab] = useState("estado");

  // Vista reducida para el dashboard principal
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Dispositivos IoT
          </CardTitle>
          <CardDescription>
            Estado de dispositivos de sus clientes asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-600">45</p>
              <p className="text-xs text-gray-500">Conectados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg mx-auto mb-2">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-xs text-gray-500">Desconectados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mx-auto mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">2</p>
              <p className="text-xs text-gray-500">Alertas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600">12.8</p>
              <p className="text-xs text-gray-500">kW Total</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                8 Clientes Activos
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Control Limitado
              </Badge>
            </div>
            {onVerMas && (
              <button
                onClick={onVerMas}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Ver más →
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vista completa
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-orange-600">Dispositivos IoT</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitoreo y control de dispositivos de sus clientes asignados
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/30 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="estado" className="flex items-center gap-2 h-10">
            <Activity className="h-4 w-4" />
            Estado Dispositivos
          </TabsTrigger>
          <TabsTrigger value="control" className="flex items-center gap-2 h-10">
            <Zap className="h-4 w-4" />
            Control Básico
          </TabsTrigger>
          <TabsTrigger
            value="alertas"
            className="flex items-center gap-2 h-10 relative"
          >
            <AlertTriangle className="h-4 w-4" />
            Alertas
            <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0.5">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="consumo" className="flex items-center gap-2 h-10">
            <BarChart3 className="h-4 w-4" />
            Consumo IoT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estado">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Dispositivos</CardTitle>
              <CardDescription>
                Monitoreo en tiempo real de dispositivos de sus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de estado de dispositivos para empresa (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control">
          <Card>
            <CardHeader>
              <CardTitle>Control Básico</CardTitle>
              <CardDescription>
                Control limitado de dispositivos (on/off/reset)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de control básico para empresa (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
              <CardDescription>
                Alertas de dispositivos de sus clientes asignados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de alertas para empresa (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumo">
          <Card>
            <CardHeader>
              <CardTitle>Consumo IoT</CardTitle>
              <CardDescription>
                Análisis de consumo por cliente que gestiona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de consumo IoT para empresa (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
