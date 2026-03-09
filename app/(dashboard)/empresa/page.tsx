"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { NotificacionesProvider, useNotificaciones } from "./context/NotificacionesContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { GestionClientes } from "./features/clientes";
import { DispositivosActivos } from "./features/dispositivos";
import { AlertasSistema } from "./features/alertas";
import { GestionTarifas } from "./features/tarifas/GestionTarifas";
import { EstadisticasAvanzadas } from "./features/estadisticas/EstadisticasAvanzadas";
import { ControlServicioMasivo } from "@/components/features/dashboard-empresa/control-servicio-masivo";
import { ConfiguracionEmpresa } from "./features/configuracion";
import { MapaInteractivo } from "./features/gestion-geografica/MapaInteractivo";
import { SistemaAntifraude } from "./features/gestion-geografica/antifraude";
import { GestionTickets } from "@/components/features/dashboard-empresa/gestion-tickets";
import { ticketsService } from "@/lib/api/ticketsService";

import {
  Users, Battery, BellRing, TrendingUp, TrendingDown,
  Activity, Settings, MapPin, RefreshCw, Headphones,
  BarChart3, DollarSign, Flame, AlertTriangle, Zap,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LiveBadge } from "@/components/ui/live-badge";
import { SkeletonKPICard } from "@/components/ui/skeleton-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { BarraNavegacionLateral } from "@/components/features/dashboard-empresa/layout/navigation";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KPICard = ({
  title, value, subtitle, icon: Icon, trend, trendValue, colorScheme, delay = 0,
}: {
  title: string; value: string | number; subtitle?: string; icon: any;
  trend?: "up" | "down" | "neutral"; trendValue?: string;
  colorScheme: "blue" | "orange" | "green" | "purple" | "emerald" | "red"; delay?: number;
}) => {
  const schemes = {
    blue:    { accent: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/40",     icon: "bg-sky-500" },
    orange:  { accent: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/40",  icon: "bg-orange-500" },
    green:   { accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", icon: "bg-emerald-600" },
    purple:  { accent: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/40",  icon: "bg-violet-600" },
    emerald: { accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", icon: "bg-emerald-500" },
    red:     { accent: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/40",     icon: "bg-red-500" },
  };
  const s = schemes[colorScheme];

  return (
    <motion.div
      initial="hidden" animate="visible" variants={fadeIn}
      transition={{ duration: 0.5, delay }}
    >
      <div className={cn("stat-card bg-card border", s.border, "group")}>
        {/* Shimmer on hover */}
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
        <div className="flex items-start justify-between mb-5">
          <p className={cn("text-sm font-semibold uppercase tracking-wide", s.accent)}>{title}</p>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-md", s.icon)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold tracking-tight text-foreground">
              {typeof value === "number" ? <AnimatedCounter value={value} duration={1200} /> : value}
            </p>
            {subtitle && <span className="text-base text-muted-foreground">{subtitle}</span>}
          </div>
          {trendValue && (
            <div className="flex items-center gap-1.5">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-emerald-400" />
              ) : (
                <Activity className="h-4 w-4 text-orange-400" />
              )}
              <span className="text-sm text-muted-foreground">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const TendenciasChart = ({ data }: { data: any[] }) => (
  <div className="h-64 w-full flex items-end gap-2 px-2">
    {data.map((item, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
        <motion.div
          className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg relative group cursor-default"
          style={{ height: `${item.percentage}%` }}
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: idx * 0.08 + 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
        </motion.div>
        <span className="text-xs text-muted-foreground">{item.label}</span>
      </div>
    ))}
  </div>
);

// ── Heatmap ───────────────────────────────────────────────────────────────────
const MapaCalor = () => {
  const zonas = [
    { nombre: "Zona Norte", consumo: 85, color: "bg-red-500" },
    { nombre: "Zona Centro", consumo: 65, color: "bg-orange-500" },
    { nombre: "Zona Sur", consumo: 45, color: "bg-orange-400" },
    { nombre: "Zona Este", consumo: 72, color: "bg-orange-600" },
    { nombre: "Zona Oeste", consumo: 38, color: "bg-orange-300" },
  ];
  return (
    <div className="space-y-4">
      {zonas.map((zona, idx) => (
        <motion.div
          key={zona.nombre}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">{zona.nombre}</span>
            <span className="text-muted-foreground font-medium">{zona.consumo}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", zona.color)}
              initial={{ width: 0 }}
              animate={{ width: `${zona.consumo}%` }}
              transition={{ delay: idx * 0.08 + 0.2, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── Main Dashboard Content ────────────────────────────────────────────────────
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
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

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await ticketsService.obtenerEstadisticas({});
        if (response.success && response.data) {
          setTicketsAbiertos(response.data.porEstado.abiertos + response.data.porEstado.enProceso);
        }
      } catch {}
    };
    cargar();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const c = cookies.find((c) => c.trim().startsWith("requiereCambioPassword="));
      if (c && c.split("=")[1] === "true") {
        setRequiereCambioPassword(true);
        setMostrarModalPassword(true);
      }
    }
  }, []);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "clientes":      return <GestionClientes />;
      case "dispositivos":  return <DispositivosActivos />;
      case "estadisticas":  return <EstadisticasAvanzadas />;
      case "alertas":       return <AlertasSistema />;
      case "soporte":       return <GestionTickets />;
      case "configuracion": return <ConfiguracionEmpresa />;
      default:              return null;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <BarraNavegacionLateral
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ticketsAbiertos={ticketsAbiertos}
        notificacionesNoLeidas={notificacionesNoLeidas}
      />

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial="hidden" animate="visible" exit="hidden"
              variants={fadeIn}
              className="space-y-6 max-w-7xl mx-auto"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                    Dashboard <span className="text-gradient-orange">Empresa</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </motion.div>
                    Actualizado en tiempo real
                    <LiveBadge connected={true} />
                  </div>
                </div>
                <div className="flex gap-2">
                </div>
              </div>

              {/* Top KPIs */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden" animate="visible"
              >
                {loadingStats ? (
                  <><SkeletonKPICard /><SkeletonKPICard /><SkeletonKPICard /></>
                ) : (
                  <>
                    <KPICard
                      title="Ingresos Mensuales"
                      value={`${(ingresosActuales / 1000000).toFixed(1)}M`}
                      subtitle={`/ ${(ingresosProyectados / 1000000).toFixed(1)}M`}
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
                      delay={0.08}
                    />
                    <KPICard
                      title="Alertas Críticas"
                      value={stats.alertasActivas}
                      icon={AlertTriangle}
                      trendValue="Requieren atención"
                      trend="neutral"
                      colorScheme="red"
                      delay={0.16}
                    />
                  </>
                )}
              </motion.div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
                  <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/40 rounded-xl flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">Tendencia de Consumo</CardTitle>
                          <CardDescription className="text-sm">Últimos 7 días (kWh)</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TendenciasChart data={tendenciasConsumo} />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.33 }}>
                  <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/40 rounded-xl flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">Mapa de Energía por Zona</CardTitle>
                          <CardDescription className="text-sm">Consumo relativo por región</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MapaCalor />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom KPIs — clickeables */}
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                variants={staggerContainer}
                initial="hidden" animate="visible"
              >
                {loadingStats ? (
                  <><SkeletonKPICard /><SkeletonKPICard /><SkeletonKPICard /><SkeletonKPICard /></>
                ) : (
                  <>
                    <div onClick={() => setActiveTab("clientes")} className="cursor-pointer">
                      <KPICard title="Clientes Activos" value={stats.clientesActivos} subtitle={`/ ${stats.clientesTotales}`} icon={Users} trendValue="92% activos" trend="neutral" colorScheme="blue" delay={0.4} />
                    </div>
                    <div onClick={() => setActiveTab("dispositivos")} className="cursor-pointer">
                      <KPICard title="Dispositivos" value={stats.dispositivosActivos} subtitle={`/ ${stats.dispositivosTotales}`} icon={Battery} trendValue={`${stats.dispositivosTotales > 0 ? Math.round((stats.dispositivosActivos / stats.dispositivosTotales) * 100) : 0}% operativos`} trend="neutral" colorScheme="green" delay={0.48} />
                    </div>
                    <div onClick={() => setActiveTab("soporte")} className="cursor-pointer">
                      <KPICard title="Tickets Pendientes" value={ticketsAbiertos} icon={Headphones} trendValue="Requieren atención" trend="neutral" colorScheme="purple" delay={0.56} />
                    </div>
                    <div onClick={() => setActiveTab("alertas")} className="cursor-pointer">
                      <KPICard title="Alertas Activas" value={stats.alertasActivas} icon={BellRing} trendValue="Ver detalles" trend="neutral" colorScheme="orange" delay={0.64} />
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial="hidden" animate="visible" exit="hidden"
              variants={fadeIn}
              className="max-w-7xl mx-auto"
            >
              {renderContent}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CambioPasswordModal
        open={mostrarModalPassword}
        onOpenChange={(open) => { if (!requiereCambioPassword) setMostrarModalPassword(open); }}
        onConfirm={async () => { setRequiereCambioPassword(false); setMostrarModalPassword(false); }}
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

