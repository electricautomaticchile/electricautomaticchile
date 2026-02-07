"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { NotificacionesProvider, useNotificaciones } from "./context/NotificacionesContext";
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
import { GestionTarifas } from "./features/tarifas/GestionTarifas";
import { EstadisticasAvanzadas } from "./features/estadisticas/EstadisticasAvanzadas";
import GestionUsuariosPage from "./usuarios/page";
import { ControlServicioMasivo } from "@/components/features/dashboard-empresa/control-servicio-masivo";

import { ConfiguracionEmpresa } from "./features/configuracion";
import { MapaInteractivo } from "./features/gestion-geografica/MapaInteractivo";
import { SistemaAntifraude } from "./features/gestion-geografica/antifraude";
import { GestionTickets } from "@/components/features/dashboard-empresa/gestion-tickets";
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
  Cpu,
  Zap,
  BarChart3,
  DollarSign,
  Flame,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  colorScheme,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorScheme: "blue" | "orange" | "green" | "purple" | "emerald" | "red";
  delay?: number;
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
    emerald: {
      bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
      icon: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      trend: "text-emerald-600",
    },
    red: {
      bg: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
      icon: "bg-red-500",
      text: "text-red-700 dark:text-red-300",
      trend: "text-red-600",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${scheme.bg} overflow-hidden relative group`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${scheme.text}`}>{title}</p>
            <motion.div
              className={`w-12 h-12 ${scheme.icon} rounded-xl flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <motion.p
                className="text-3xl font-bold text-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              )}
            </div>
            {trendValue && (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
              >
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
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DispositivosSection = () => {
  return (
    <div className="w-full">
      <DispositivosActivos />
    </div>
  );
};

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

const TendenciasChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <div className="flex items-end justify-between h-full gap-2 px-4">
        {data.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-1 flex flex-col items-center gap-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <div className="text-xs font-medium text-muted-foreground">
              {item.value}
            </div>
            <motion.div
              className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg relative group"
              style={{ height: `${item.percentage}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: idx * 0.1 + 0.2, duration: 0.6, type: "spring" }}
              whileHover={{ scaleY: 1.05 }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
            </motion.div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MapaCalor = () => {
  const zonas = [
    { nombre: "Zona Norte", consumo: 85, color: "bg-red-500" },
    { nombre: "Zona Centro", consumo: 65, color: "bg-orange-500" },
    { nombre: "Zona Sur", consumo: 45, color: "bg-yellow-500" },
    { nombre: "Zona Este", consumo: 72, color: "bg-orange-600" },
    { nombre: "Zona Oeste", consumo: 38, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-3">
      {zonas.map((zona, idx) => (
        <motion.div
          key={zona.nombre}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{zona.nombre}</span>
            <span className="text-muted-foreground">{zona.consumo}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${zona.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${zona.consumo}%` }}
              transition={{ delay: idx * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

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
    { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
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

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ticketsAbiertos, setTicketsAbiertos] = useState(0);

  const { resumen } = useNotificaciones();
  const notificacionesNoLeidas = resumen.noLeidas;
  const { stats, loading: loadingStats } = useDashboardStats();

  const tendenciasConsumo = [
    { label: "Lun", value: "1.2k", percentage: 60 },
    { label: "Mar", value: "1.5k", percentage: 75 },
    { label: "Mié", value: "1.8k", percentage: 90 },
    { label: "Jue", value: "1.4k", percentage: 70 },
    { label: "Vie", value: "1.6k", percentage: 80 },
    { label: "Sáb", value: "0.9k", percentage: 45 },
    { label: "Dom", value: "0.8k", percentage: 40 },
  ];

  const ingresosProyectados = 2850000;
  const ingresosActuales = 2340000;
  const consumoTotalMes = 12450;

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
      }
    };

    cargarEstadisticasTickets();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const requiereCambioCookie = cookies.find((c) =>
        c.trim().startsWith("requiereCambioPassword=")
      );
      if (requiereCambioCookie && requiereCambioCookie.split("=")[1] === "true") {
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

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "clientes":
        return <GestionClientes />;
      case "dispositivos":
        return <DispositivosSection />;
      case "estadisticas":
        return <EstadisticasAvanzadas />;
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
        <div className="min-h-screen flex flex-col bg-background">
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
                  { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
                  {
                    id: "configuracion",
                    label: "Configuración",
                    icon: Settings,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-orange-400"
                        }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
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

            <main className="flex-1 bg-background p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" ? (
                  <motion.div
                    key="dashboard"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeIn}
                    className="space-y-6"
                  >
                    <motion.div
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      variants={fadeIn}
                    >
                      <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          Dashboard Empresa
                        </h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </motion.div>
                          <span>Actualizado en tiempo real</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("clientes")}
                          className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-950"
                        >
                          <Users className="h-4 w-4" />
                          Clientes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("alertas")}
                          className="gap-2 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <BellRing className="h-4 w-4" />
                          Alertas
                          {stats.alertasActivas > 0 && (
                            <Badge variant="destructive" className="ml-1 text-xs px-1.5">
                              {stats.alertasActivas}
                            </Badge>
                          )}
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <KPICard
                        title="Ingresos Mensuales"
                        value={`$${(ingresosActuales / 1000).toFixed(1)}M`}
                        subtitle={`/ $${(ingresosProyectados / 1000).toFixed(1)}M`}
                        icon={DollarSign}
                        trendValue={`${Math.round((ingresosActuales / ingresosProyectados) * 100)}% del objetivo`}
                        trend="neutral"
                        colorScheme="emerald"
                        delay={0}
                      />
                      <KPICard
                        title="Consumo Total"
                        value={`${(consumoTotalMes / 1000).toFixed(1)}k`}
                        subtitle="kWh este mes"
                        icon={Flame}
                        trendValue="+12% vs mes anterior"
                        trend="up"
                        colorScheme="orange"
                        delay={0.1}
                      />
                      <KPICard
                        title="Alertas Críticas"
                        value={stats.alertasActivas}
                        icon={AlertTriangle}
                        trendValue="Requieren atención"
                        trend="neutral"
                        colorScheme="red"
                        delay={0.2}
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                  <BarChart3 className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold">
                                    Tendencia de Consumo
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    Últimos 7 días (kWh)
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <TendenciasChart data={tendenciasConsumo} />
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                  <MapPin className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold">
                                    Mapa de Calor por Zona
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    Consumo relativo por región
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <MapaCalor />
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <KPICard
                        title="Clientes Activos"
                        value={stats.clientesActivos}
                        subtitle={`/ ${stats.clientesTotales}`}
                        icon={Users}
                        trendValue="92% activos"
                        trend="neutral"
                        colorScheme="blue"
                        delay={0.5}
                      />
                      <KPICard
                        title="Dispositivos"
                        value={stats.dispositivosActivos}
                        subtitle={`/ ${stats.dispositivosTotales}`}
                        icon={Battery}
                        trendValue={`${stats.dispositivosTotales > 0 ? Math.round((stats.dispositivosActivos / stats.dispositivosTotales) * 100) : 0}% operativos`}
                        trend="neutral"
                        colorScheme="green"
                        delay={0.6}
                      />
                      <KPICard
                        title="Tickets Pendientes"
                        value={ticketsAbiertos}
                        icon={Headphones}
                        trendValue="Requieren atención"
                        trend="neutral"
                        colorScheme="purple"
                        delay={0.7}
                      />
                      <KPICard
                        title="Alertas Activas"
                        value={stats.alertasActivas}
                        icon={BellRing}
                        trendValue="Ver detalles"
                        trend="neutral"
                        colorScheme="orange"
                        delay={0.8}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeIn}
                  >
                    {renderContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

          <CambioPasswordModal
            open={mostrarModalPassword}
            onOpenChange={setMostrarModalPassword}
            onConfirm={async (currentPassword, newPassword) => {
              handlePasswordChangeSuccess();
            }}
          />
        </div>
  );
}

export default function DashboardEmpresa() {
  return (
    <NotificacionesProvider>
      <DashboardContent />
    </NotificacionesProvider>
  );
}