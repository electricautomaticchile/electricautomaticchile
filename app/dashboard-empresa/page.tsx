"use client";

import { useState, useEffect } from "react";
import { EmpresaRoute } from "@/components/auth/protected-route";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { EncabezadoEmpresa } from "./components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importaciones actualizadas a la nueva estructura
import { GestionClientes } from "./features/clientes";
import { EstadisticasConsumo } from "./features/estadisticas";
import { DispositivosActivos } from "./features/dispositivos";
import { AlertasSistema } from "./features/alertas";
import { ConsumoSectorial } from "./features/consumo";
import { ControlArduino } from "./features/control";
import { ConfiguracionEmpresa } from "./features/configuracion";
import { DispositivosIoT } from "./features/dispositivos-iot";

import {
  Users,
  LayoutDashboard,
  BarChart2,
  Battery,
  BellRing,
  Lightbulb,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Clock,
  X,
  Settings,
  AlertTriangle,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Router,
  Building,
} from "lucide-react";

// Datos de resumen del dashboard
const resumenDashboard = {
  clientesActivos: 24,
  clientesTotales: 26,
  consumoMensual: 45720, // kWh
  variacionConsumo: -2.3, // %
  dispositivosActivos: 187,
  dispositivosTotales: 195,
  alertasActivas: 3,
  eficienciaPromedio: 87.5, // %
};

// Componente de navegación móvil
const MobileNavigation = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "estadisticas", label: "Estadísticas", icon: BarChart2 },
    { id: "dispositivos", label: "Dispositivos", icon: Battery },
    { id: "alertas", label: "Alertas", icon: BellRing, badge: "3" },
    { id: "consumo", label: "Consumo", icon: Lightbulb },
    { id: "arduino", label: "Arduino", icon: Zap },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar móvil */}
      <div className="fixed top-0 left-0 h-full w-64 bg-background border-r border-gray-200 dark:border-gray-800 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Navegación
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

// Componente principal del dashboard
export default function DashboardEmpresa() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verificar si requiere cambio de contraseña al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const requiereCambio = localStorage.getItem("requiereCambioPassword");
      if (requiereCambio === "true") {
        setRequiereCambioPassword(true);
        setMostrarModalPassword(true);
      }
    }
  }, []);

  const handlePasswordChangeSuccess = () => {
    setRequiereCambioPassword(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <EmpresaRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <EncabezadoEmpresa
          onCambiarPassword={() => setMostrarModalPassword(true)}
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Navegación móvil */}
        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Contenido principal */}
        <main className="p-4 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Navegación tabs desktop */}
            <div className="hidden lg:block">
              <TabsList className="w-full justify-start h-auto p-1 bg-muted/30 border border-gray-200 dark:border-gray-700">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2 h-10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="flex items-center gap-2 h-10"
                >
                  <Users className="h-4 w-4" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="estadisticas"
                  className="flex items-center gap-2 h-10"
                >
                  <BarChart2 className="h-4 w-4" />
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger
                  value="dispositivos"
                  className="flex items-center gap-2 h-10"
                >
                  <Battery className="h-4 w-4" />
                  Dispositivos
                </TabsTrigger>
                <TabsTrigger
                  value="alertas"
                  className="flex items-center gap-2 h-10 relative"
                >
                  <BellRing className="h-4 w-4" />
                  Alertas
                  <Badge
                    variant="destructive"
                    className="ml-1 text-xs px-1.5 py-0.5"
                  >
                    3
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="consumo"
                  className="flex items-center gap-2 h-10"
                >
                  <Lightbulb className="h-4 w-4" />
                  Consumo
                </TabsTrigger>
                <TabsTrigger
                  value="arduino"
                  className="flex items-center gap-2 h-10"
                >
                  <Zap className="h-4 w-4" />
                  Arduino
                </TabsTrigger>
                <TabsTrigger
                  value="dispositivos-iot"
                  className="flex items-center gap-2 h-10"
                >
                  <Router className="h-4 w-4" />
                  Dispositivos IoT
                </TabsTrigger>
                <TabsTrigger
                  value="configuracion"
                  className="flex items-center gap-2 h-10"
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* KPIs principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Clientes Activos
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {resumenDashboard.clientesActivos}
                          </p>
                          <span className="text-sm text-gray-500">
                            / {resumenDashboard.clientesTotales}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Shield className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        92% activos
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Consumo Mensual
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {resumenDashboard.consumoMensual.toLocaleString()}
                          </p>
                          <span className="text-sm text-gray-500">kWh</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      {resumenDashboard.variacionConsumo > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                      <span
                        className={`text-xs ${
                          resumenDashboard.variacionConsumo > 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {resumenDashboard.variacionConsumo > 0 ? "+" : ""}
                        {resumenDashboard.variacionConsumo}% vs mes anterior
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Dispositivos
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {resumenDashboard.dispositivosActivos}
                          </p>
                          <span className="text-sm text-gray-500">
                            / {resumenDashboard.dispositivosTotales}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <Battery className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Shield className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {Math.round(
                          (resumenDashboard.dispositivosActivos /
                            resumenDashboard.dispositivosTotales) *
                            100
                        )}
                        % operativos
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Eficiencia
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {resumenDashboard.eficienciaPromedio}%
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Última hora
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secciones principales en cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      Resumen de Clientes
                    </CardTitle>
                    <CardDescription>
                      Estado actual de su cartera de clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GestionClientes reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-orange-600" />
                      Consumo Energético
                    </CardTitle>
                    <CardDescription>
                      Estadísticas y tendencias de consumo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EstadisticasConsumo reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Battery className="h-5 w-5 text-orange-600" />
                      Estado de Dispositivos
                    </CardTitle>
                    <CardDescription>
                      Monitoreo de medidores y sensores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DispositivosActivos reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-orange-600" />
                      Alertas del Sistema
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {resumenDashboard.alertasActivas}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Notificaciones que requieren atención
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertasSistema reducida={true} />
                  </CardContent>
                </Card>
              </div>

              {/* Secciones adicionales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-orange-600" />
                      Distribución de Consumo
                    </CardTitle>
                    <CardDescription>
                      Análisis por sectores y zonas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConsumoSectorial reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      Control Arduino IoT
                    </CardTitle>
                    <CardDescription>
                      Sistema de control y monitoreo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ControlArduino reducida={true} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Router className="h-5 w-5 text-orange-600" />
                      Dispositivos IoT
                    </CardTitle>
                    <CardDescription>
                      Estado de dispositivos de clientes asignados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DispositivosIoT reducida={true} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tabs de contenido completo */}
            <TabsContent value="clientes">
              <GestionClientes />
            </TabsContent>

            <TabsContent value="estadisticas">
              <EstadisticasConsumo />
            </TabsContent>

            <TabsContent value="dispositivos">
              <DispositivosActivos />
            </TabsContent>

            <TabsContent value="alertas">
              <AlertasSistema />
            </TabsContent>

            <TabsContent value="consumo">
              <ConsumoSectorial />
            </TabsContent>

            <TabsContent value="arduino">
              <ControlArduino />
            </TabsContent>

            <TabsContent value="configuracion">
              <ConfiguracionEmpresa />
            </TabsContent>

            <TabsContent value="dispositivos-iot">
              <DispositivosIoT />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Modal de cambio de contraseña */}
      <CambioPasswordModal
        isOpen={mostrarModalPassword}
        onClose={() => setMostrarModalPassword(false)}
        onSuccess={handlePasswordChangeSuccess}
        mostrarAdvertencia={requiereCambioPassword}
      />
    </EmpresaRoute>
  );
}
