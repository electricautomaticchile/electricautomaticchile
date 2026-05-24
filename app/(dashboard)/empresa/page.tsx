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
  Users, Battery, BellRing,
  Activity, MapPin, RefreshCw, Headphones,
  BarChart3, DollarSign, Flame, AlertTriangle,
} from "lucide-react";
import { LiveBadge } from "@/components/ui/live-badge";
import { SkeletonKPICard } from "@/components/ui/skeleton-card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useCambiarPassword } from "@/hooks/queries/useAuthMutations";
import { BarraNavegacionLateral } from "@/components/features/dashboard-empresa/layout/navigation";
import { KPICard } from "./components/KPICard";
import { TendenciasChart } from "./components/TendenciasChart";
import { MapaCalor } from "./components/MapaCalor";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// ── Main Dashboard Content ────────────────────────────────────────────────────
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [ticketsAbiertos, setTicketsAbiertos] = useState(0);
  const cambiarPasswordMutation = useCambiarPassword();

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
        onConfirm={async (currentPassword, newPassword) => {
          await cambiarPasswordMutation.mutateAsync({ currentPassword, newPassword });
          setRequiereCambioPassword(false);
          setMostrarModalPassword(false);
        }}
        requiereActual={true}
        esForzado={requiereCambioPassword}
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
