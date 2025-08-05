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
  Battery,
} from "lucide-react";

interface MiConsumoIoTProps {
  reducida?: boolean;
  onVerMas?: () => void;
}

export function MiConsumoIoT({
  reducida = false,
  onVerMas,
}: MiConsumoIoTProps) {
  const [activeTab, setActiveTab] = useState("dispositivos");

  // Vista reducida para el dashboard principal
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Mi Consumo IoT
          </CardTitle>
          <CardDescription>
            Estado y consumo de sus dispositivos personales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-500">Dispositivos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600">2.4</p>
              <p className="text-xs text-gray-500">kW Actual</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mx-auto mb-2">
                <Battery className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-purple-600">87</p>
              <p className="text-xs text-gray-500">% Eficiencia</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                Todos Conectados
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Control Básico
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
        <h1 className="text-2xl font-bold text-orange-600">Mi Consumo IoT</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitoreo y control de sus dispositivos personales
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/30 border border-gray-200 dark:border-gray-700">
          <TabsTrigger
            value="dispositivos"
            className="flex items-center gap-2 h-10"
          >
            <Activity className="h-4 w-4" />
            Mis Dispositivos
          </TabsTrigger>
          <TabsTrigger value="consumo" className="flex items-center gap-2 h-10">
            <BarChart3 className="h-4 w-4" />
            Consumo Personal
          </TabsTrigger>
          <TabsTrigger
            value="alertas"
            className="flex items-center gap-2 h-10 relative"
          >
            <AlertTriangle className="h-4 w-4" />
            Alertas Personales
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
              1
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dispositivos">
          <Card>
            <CardHeader>
              <CardTitle>Mis Dispositivos</CardTitle>
              <CardDescription>
                Lista de sus dispositivos IoT personales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de dispositivos personales (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumo">
          <Card>
            <CardHeader>
              <CardTitle>Consumo Personal</CardTitle>
              <CardDescription>
                Análisis de su consumo energético personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de consumo personal (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Personales</CardTitle>
              <CardDescription>
                Notificaciones relacionadas con sus dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Componente de alertas personales (implementar)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
