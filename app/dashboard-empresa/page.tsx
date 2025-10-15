"use client";

import { useState, useEffect, useMemo } from "react";
import { EmpresaRoute } from "@/components/auth/protected-route";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ProveedorWebSocket } from "@/lib/websocket/ProveedorWebSocket";
import { EncabezadoEmpresa } from "./components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importaciones de features
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
  Router,
} from "lucide-react";

// Datos de resumen del dashboard
const resumenDashboard = {
  clientesActivos: 24,
  clientesTotales: 26,
  consumoMensual: 45720,
  variacionConsumo: -2.3,
  dispositivosActivos: 187,
  dispositivosTotales: 195,
  alertasActivas: 3,
  eficienciaPromedio: 87.5,
};

// Navegación móvil
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
    { id: "dispositivos-iot", label: "Dispositivos IoT", icon: Router },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 lg:hidden animate-in slide-in-from-left duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Navegación</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-orange-400"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="text-xs">
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

export default function DashboardEmpresa() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Memoizar el contenido para optimizar renders
  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "clientes":
        return <GestionClientes />;
      case "estadisticas":
        return <EstadisticasConsumo />;
      case "dispositivos":
        return <DispositivosActivos />;
      case "alertas":
        return <AlertasSistema />;
      case "consumo":
        return <ConsumoSectorial />;
      case "arduino":
        return <ControlArduino />;
      case "dispositivos-iot":
        return <DispositivosIoT />;
      case "configuracion":
        return <ConfiguracionEmpresa />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <EmpresaRoute>
      <ProveedorWebSocket>
        <div className="min-h-screen flex flex-col bg-background">
          <EncabezadoEmpresa
            onCambiarPassword={() => setMostrarModalPassword(true)}
            onToggleMobileMenu={toggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          <div className="flex flex-1">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="flex flex-col gap-1 p-4">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "clientes", label: "Clientes", icon: Users },
                  { id: "estadisticas", label: "Estadísticas", icon: BarChart2 },
                  { id: "dispositivos", label: "Dispositivos", icon: Battery },
                  { id: "alertas", label: "Alertas", icon: BellRing, badge: "3" },
                  { id: "consumo", label: "Consumo", icon: Lightbulb },
                  { id: "arduino", label: "Arduino", icon: Zap },
                  { id: "dispositivos-iot", label: "Dispositivos IoT", icon: Router },
                  { id: "configuracion", label: "Configuración", icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-orange-400"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <MobileNavigation
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Contenido principal */}
            <main className="flex-1 bg-background p-6 overflow-y-auto">
              <div className="space-y-6 animate-in fade-in duration-300">
                {activeTab === "dashboard" ? (
                  <>
                    {/* KPIs principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Clientes Activos
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold text-foreground">
                                  {resumenDashboard.clientesActivos}
                                </p>
                                <span className="text-sm text-muted-foreground">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Consumo Mensual
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold text-foreground">
                                  {resumenDashboard.consumoMensual.toLocaleString()}
                                </p>
                                <span className="text-sm text-muted-foreground">kWh</span>
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
                              className={`text-xs ${resumenDashboard.variacionConsumo > 0
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Dispositivos
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold text-foreground">
                                  {resumenDashboard.dispositivosActivos}
                                </p>
                                <span className="text-sm text-muted-foreground">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Eficiencia
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold text-foreground">
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

                    {/* Secciones principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="hover:shadow-lg transition-shadow duration-200">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
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
                      <Card className="hover:shadow-lg transition-shadow duration-200">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
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

                      <Card className="hover:shadow-lg transition-shadow duration-200">
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
                  </>
                ) : (
                  renderContent
                )}
              </div>
            </main>
          </div>
        </div>

        <CambioPasswordModal
          isOpen={mostrarModalPassword}
          onClose={() => setMostrarModalPassword(false)}
          onSuccess={handlePasswordChangeSuccess}
          mostrarAdvertencia={requiereCambioPassword}
        />
      </ProveedorWebSocket>
    </EmpresaRoute>
  );
}
