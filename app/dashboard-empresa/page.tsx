"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { EmpresaRoute } from "@/components/auth/protected-route";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ProveedorWebSocket } from "@/lib/websocket/ProveedorWebSocket";
import { NotificacionesProvider, useNotificaciones } from "./context/NotificacionesContext";
import { EncabezadoEmpresa } from "./components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importaciones de features
import { GestionClientes } from "./features/clientes";
import { DispositivosActivos } from "./features/dispositivos";
import { AlertasSistema } from "./features/alertas";

import { ConfiguracionEmpresa } from "./features/configuracion";
import { MapaInteractivo } from "./features/gestion-geografica/MapaInteractivo";
import { SistemaAntifraude } from "./features/gestion-geografica/SistemaAntifraude";
import { GestionTickets } from "./componentes/gestion-tickets";
import { ticketsService } from "@/lib/api/ticketsService";

import {
  Users,
  LayoutDashboard,
  Battery,
  BellRing,
  TrendingUp,
  TrendingDown,
  Activity,
  X,
  Settings,
  MapPin,
  RefreshCw,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de resumen del dashboard
const resumenDashboard = {
  clientesActivos: 24,
  clientesTotales: 26,
  dispositivosActivos: 187,
  dispositivosTotales: 195,
  alertasActivas: 3,
};

// Componente de KPI mejorado
const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  colorScheme,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorScheme: "blue" | "orange" | "green" | "purple";
}) => {
  const colors = {
    blue: {
      bg: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      icon: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-300",
      trend: trend === "up" ? "text-red-600" : "text-green-600",
    },
    orange: {
      bg: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
      icon: "bg-orange-500",
      text: "text-orange-700 dark:text-orange-300",
      trend: trend === "up" ? "text-red-600" : "text-green-600",
    },
    green: {
      bg: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      icon: "bg-green-500",
      text: "text-green-700 dark:text-green-300",
      trend: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      icon: "bg-purple-500",
      text: "text-purple-700 dark:text-purple-300",
      trend: "text-blue-600",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${scheme.bg}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-semibold ${scheme.text}`}>{title}</p>
          <div
            className={`w-12 h-12 ${scheme.icon} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
          {trendValue && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <Activity className="h-4 w-4 text-blue-500" />
              )}
              <span className={`text-xs font-medium ${scheme.trend}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Sección de Dispositivos simplificada
const DispositivosSection = () => {
  return (
    <div className="w-full">
      <DispositivosActivos />
    </div>
  );
};

// Sección de Mapa y Seguridad con tabs
const MapaSeguridadSection = () => {
  return (
    <Tabs defaultValue="mapa" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mapa">Mapa Interactivo</TabsTrigger>
        <TabsTrigger value="antifraude">Sistema Anti-fraude</TabsTrigger>
      </TabsList>
      <TabsContent value="mapa" className="mt-6">
        <MapaInteractivo />
      </TabsContent>
      <TabsContent value="antifraude" className="mt-6">
        <SistemaAntifraude />
      </TabsContent>
    </Tabs>
  );
};

// Navegación móvil
const MobileNavigation = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  ticketsAbiertos,
  notificacionesNoLeidas,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  ticketsAbiertos: number;
  notificacionesNoLeidas: number;
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "dispositivos", label: "Dispositivos", icon: Battery },
    { id: "mapa-seguridad", label: "Mapa & Seguridad", icon: MapPin },
    {
      id: "alertas",
      label: "Alertas",
      icon: BellRing,
      badge: notificacionesNoLeidas > 0 ? notificacionesNoLeidas.toString() : undefined
    },
    {
      id: "soporte",
      label: "Soporte",
      icon: Headphones,
      badge: ticketsAbiertos > 0 ? ticketsAbiertos.toString() : undefined,
    },
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
            <h2 className="text-lg font-semibold text-foreground">
              Navegación
            </h2>
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

// Componente interno que usa el contexto
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ticketsAbiertos, setTicketsAbiertos] = useState(0);

  // Usar el hook de contexto en lugar de llamar useNotificacionesEmpresa directamente
  const { resumen } = useNotificaciones();
  const notificacionesNoLeidas = resumen.noLeidas;

  // Cargar estadísticas de tickets
  useEffect(() => {
    const cargarEstadisticasTickets = async () => {
      try {
        const response = await ticketsService.obtenerEstadisticas({});
        if (response.success && response.data) {
          setTicketsAbiertos(
            response.data.porEstado.abiertos + response.data.porEstado.enProceso
          );
        }
      } catch (error) {
        console.error("Error cargando estadísticas de tickets:", error);
      }
    };

    cargarEstadisticasTickets();
  }, []);

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
      case "dispositivos":
        return <DispositivosSection />;
      case "mapa-seguridad":
        return <MapaSeguridadSection />;
      case "alertas":
        return <AlertasSistema />;
      case "soporte":
        return <GestionTickets />;
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
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                  },
                  { id: "clientes", label: "Clientes", icon: Users },
                  { id: "dispositivos", label: "Dispositivos", icon: Battery },
                  {
                    id: "mapa-seguridad",
                    label: "Mapa & Seguridad",
                    icon: MapPin,
                  },
                  {
                    id: "alertas",
                    label: "Alertas",
                    icon: BellRing,
                    badge: notificacionesNoLeidas > 0 ? notificacionesNoLeidas.toString() : undefined,
                  },
                  {
                    id: "soporte",
                    label: "Soporte",
                    icon: Headphones,
                    badge:
                      ticketsAbiertos > 0
                        ? ticketsAbiertos.toString()
                        : undefined,
                  },
                  {
                    id: "configuracion",
                    label: "Configuración",
                    icon: Settings,
                  },
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
                        <Badge
                          variant="destructive"
                          className="ml-auto text-xs"
                        >
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
              ticketsAbiertos={ticketsAbiertos}
              notificacionesNoLeidas={notificacionesNoLeidas}
            />

            {/* Contenido principal */}
            <main className="flex-1 bg-background p-6 overflow-y-auto">
              <div className="space-y-6 animate-in fade-in duration-300">
                {activeTab === "dashboard" ? (
                  <>
                    {/* Header con acciones rápidas */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          Dashboard Empresa
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <RefreshCw className="h-3 w-3" />
                          Actualizado hace 2 minutos
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("clientes")}
                          className="gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Ver Clientes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("alertas")}
                          className="gap-2"
                        >
                          <BellRing className="h-4 w-4" />
                          Alertas
                          <Badge
                            variant="destructive"
                            className="ml-1 text-xs px-1.5"
                          >
                            {resumenDashboard.alertasActivas}
                          </Badge>
                        </Button>
                      </div>
                    </div>

                    {/* KPIs principales mejorados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <KPICard
                        title="Clientes Activos"
                        value={resumenDashboard.clientesActivos}
                        subtitle={`/ ${resumenDashboard.clientesTotales}`}
                        icon={Users}
                        trendValue="92% activos"
                        trend="neutral"
                        colorScheme="blue"
                      />
                      <KPICard
                        title="Dispositivos"
                        value={resumenDashboard.dispositivosActivos}
                        subtitle={`/ ${resumenDashboard.dispositivosTotales}`}
                        icon={Battery}
                        trendValue={`${Math.round((resumenDashboard.dispositivosActivos / resumenDashboard.dispositivosTotales) * 100)}% operativos`}
                        trend="neutral"
                        colorScheme="green"
                      />
                      <KPICard
                        title="Tickets Pendientes"
                        value={ticketsAbiertos}
                        icon={Headphones}
                        trendValue="Requieren atención"
                        trend="neutral"
                        colorScheme="purple"
                      />
                      <KPICard
                        title="Alertas Activas"
                        value={resumenDashboard.alertasActivas}
                        icon={BellRing}
                        trendValue="Requieren atención"
                        trend="neutral"
                        colorScheme="orange"
                      />
                    </div>

                    {/* Secciones principales mejoradas */}
                    <div className="flex flex-col gap-6">
                      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold">
                                  Resumen de Clientes
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  Estado actual de su cartera
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveTab("clientes")}
                              className="gap-1 text-xs"
                            >
                              Ver todo
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <GestionClientes reducida={true} />
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <Battery className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold">
                                  Estado de Dispositivos
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  Monitoreo de medidores
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveTab("dispositivos")}
                              className="gap-1 text-xs"
                            >
                              Ver todo
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <DispositivosActivos reducida={true} />
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center relative">
                                <BellRing className="h-5 w-5 text-red-600" />
                                {resumenDashboard.alertasActivas > 0 && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                    {resumenDashboard.alertasActivas}
                                  </span>
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                  Alertas del Sistema
                                  <Badge
                                    variant="destructive"
                                    className="text-xs px-2"
                                  >
                                    {resumenDashboard.alertasActivas}
                                  </Badge>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  Requieren atención inmediata
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveTab("alertas")}
                              className="gap-1 text-xs"
                            >
                              Ver todo
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <AlertasSistema reducida={true} />
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

// Componente principal que provee el contexto
export default function DashboardEmpresa() {
  return (
    <NotificacionesProvider>
      <DashboardContent />
    </NotificacionesProvider>
  );
}
