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
import { MonitoreoTiempoReal } from "./components/MonitoreoTiempoReal";
import { ControlHardware } from "./components/ControlHardware";
import { MachineLearning } from "./components/MachineLearning";
import { ReportesIoT } from "./components/ReportesIoT";
import {
  Activity,
  Cpu,
  Brain,
  FileText,
  Zap,
  Wifi,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface IoTControlProps {
  reducida?: boolean;
  onVerMas?: () => void;
}

export function IoTControl({ reducida = false, onVerMas }: IoTControlProps) {
  const [activeTab, setActiveTab] = useState("monitoreo");

  // Vista reducida para el dashboard principal
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Control IoT Global
          </CardTitle>
          <CardDescription>
            Monitoreo y control de todos los dispositivos IoT del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-600">187</p>
              <p className="text-xs text-gray-500">Conectados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg mx-auto mb-2">
                <Wifi className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-2xl font-bold text-red-600">8</p>
              <p className="text-xs text-gray-500">Desconectados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mx-auto mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">3</p>
              <p className="text-xs text-gray-500">Alertas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600">45.2</p>
              <p className="text-xs text-gray-500">kW Total</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                Sistema Operativo
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">ML Activo</Badge>
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
        <h1 className="text-2xl font-bold text-orange-600">
          Control IoT Global
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitoreo y control completo de todos los dispositivos IoT del sistema
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/30 border border-gray-200 dark:border-gray-700">
          <TabsTrigger
            value="monitoreo"
            className="flex items-center gap-2 h-10"
          >
            <Activity className="h-4 w-4" />
            Monitoreo Tiempo Real
          </TabsTrigger>
          <TabsTrigger
            value="hardware"
            className="flex items-center gap-2 h-10"
          >
            <Cpu className="h-4 w-4" />
            Control Hardware
          </TabsTrigger>
          <TabsTrigger value="ml" className="flex items-center gap-2 h-10">
            <Brain className="h-4 w-4" />
            Machine Learning
          </TabsTrigger>
          <TabsTrigger
            value="reportes"
            className="flex items-center gap-2 h-10"
          >
            <FileText className="h-4 w-4" />
            Reportes IoT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoreo">
          <MonitoreoTiempoReal />
        </TabsContent>

        <TabsContent value="hardware">
          <ControlHardware />
        </TabsContent>

        <TabsContent value="ml">
          <MachineLearning />
        </TabsContent>

        <TabsContent value="reportes">
          <ReportesIoT />
        </TabsContent>
      </Tabs>
    </div>
  );
}
