"use client";

import { useState } from "react";
import { EmpresaRoute } from "@/components/auth/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { GestionClientes } from "./componentes/gestion-clientes";
import { EstadisticasConsumo } from "./componentes/estadisticas-consumo";
import { DispositivosActivos } from "./componentes/dispositivos-activos";
import { AlertasSistema } from "./componentes/alertas-sistema";
import { ConsumoSectorial } from "./componentes/consumo-sectorial";
import { ControlArduino } from "./componentes/control-arduino";

import {
  Users,
  Home,
  BarChart2,
  Battery,
  BellRing,
  Lightbulb,
  CircleUserRound,
  Building,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

// Componente de barra de navegación lateral
const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col gap-4 pt-8">
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600">
          <Building className="h-5 w-5" />
        </div>
        <div className="w-full border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#dashboard">
              <Home className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#clientes">
              <Users className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#estadisticas">
              <BarChart2 className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#dispositivos">
              <Battery className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#alertas">
              <BellRing className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#consumo">
              <Lightbulb className="h-5 w-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href="#arduino">
              <Zap className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-red-600"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Componente de encabezado superior
const Header = () => {
  return (
    <div className="fixed top-0 left-16 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10">
      <h1 className="text-xl font-bold">Dashboard Empresa</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <CircleUserRound className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="text-sm font-medium">
              Constructora Santiago S.A.
            </div>
            <div className="text-xs text-gray-500">Administrador</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del dashboard
export default function DashboardEmpresa() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <EmpresaRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Sidebar />
        <Header />

        <div className="pl-16 pt-16 pb-8">
          <Tabs
            defaultValue="dashboard"
            className="p-4"
            onValueChange={setActiveTab}
          >
            <div className="mb-6 px-2">
              <TabsList className="w-full justify-start">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="estadisticas"
                  className="flex items-center gap-2"
                >
                  <BarChart2 className="h-4 w-4" />
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger
                  value="dispositivos"
                  className="flex items-center gap-2"
                >
                  <Battery className="h-4 w-4" />
                  Dispositivos
                </TabsTrigger>
                <TabsTrigger
                  value="alertas"
                  className="flex items-center gap-2"
                >
                  <BellRing className="h-4 w-4" />
                  Alertas
                </TabsTrigger>
                <TabsTrigger
                  value="consumo"
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Consumo
                </TabsTrigger>
                <TabsTrigger
                  value="arduino"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Arduino
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" id="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      Resumen de Clientes
                    </CardTitle>
                    <CardDescription>
                      Estado de sus clientes finales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GestionClientes reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-orange-600" />
                      Consumo Energético
                    </CardTitle>
                    <CardDescription>Estadísticas de consumo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EstadisticasConsumo reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Battery className="h-5 w-5 text-orange-600" />
                      Dispositivos
                    </CardTitle>
                    <CardDescription>Estado de los medidores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DispositivosActivos reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      Control Arduino
                    </CardTitle>
                    <CardDescription>Sistema IoT LED</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ControlArduino reducida={true} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-orange-600" />
                      Alertas del Sistema
                    </CardTitle>
                    <CardDescription>
                      Alertas activas que requieren atención
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertasSistema reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-orange-600" />
                      Consumo por Sector
                    </CardTitle>
                    <CardDescription>
                      Distribución del consumo energético
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConsumoSectorial reducida={true} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clientes" id="clientes">
              <GestionClientes />
            </TabsContent>

            <TabsContent value="estadisticas" id="estadisticas">
              <EstadisticasConsumo />
            </TabsContent>

            <TabsContent value="dispositivos" id="dispositivos">
              <DispositivosActivos />
            </TabsContent>

            <TabsContent value="alertas" id="alertas">
              <AlertasSistema />
            </TabsContent>

            <TabsContent value="consumo" id="consumo">
              <ConsumoSectorial />
            </TabsContent>

            <TabsContent value="arduino" id="arduino">
              <ControlArduino />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EmpresaRoute>
  );
}
