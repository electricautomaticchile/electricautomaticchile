"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ConsumoElectrico } from "@/components/features/dashboard-cliente/consumo-electrico";
import { PagosFacturas } from "@/components/features/dashboard-cliente/pagos-facturas";
import { SoporteUsuarioNuevo as SoporteUsuario } from "@/components/features/dashboard-cliente/soporte-usuario";
import { PerfilUsuario } from "@/components/features/dashboard-cliente/perfil-usuario";
import { ControlServicio } from "@/components/features/dashboard-cliente/control-servicio";
import { NotificacionesCliente } from "@/components/features/dashboard-cliente/notificaciones-cliente";
import { ConsejosAhorroIA } from "@/components/features/dashboard-cliente/consejos-ahorro-ia";
import NavigationCliente from "@/components/features/dashboard-cliente/layout/navigation";
import { useApi } from "@/hooks/useApi";
import { useDashboardClienteTodo } from "@/hooks/queries/useDashboardQuery";
import { useWebSocket, type WSMessage } from "@/lib/websocket/useWebSocket";
import { GlobalLoadingState } from "@/components/shared";
import { useCambiarPassword } from "@/hooks/queries/useAuthMutations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, Zap, DollarSign, Activity,
  Trophy, Target, Sparkles, ArrowRight, Bell,
} from "lucide-react";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

export default function DashboardCliente() {
  const { user, isLoading: loadingCliente } = useApi();
  const { data: todoData, isLoading: loadingResumen } = useDashboardClienteTodo();

  const resumen = todoData?.data?.resumen;
  const boletas = todoData?.data?.boletas ?? [];

  // Lectura en vivo desde WebSocket
  const [lecturaVivo, setLecturaVivo] = React.useState<{ energia: number; costo: number; potencia: number } | null>(null);

  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();

  const handleWsMessage = useCallback((msg: WSMessage) => {
    if (msg.type === "device_update" && msg.data) {
      const d = msg.data as any;
      const energia = typeof d.energia === "number" ? d.energia : parseFloat(d.energia ?? "0");
      const costo = typeof d.costo === "number" ? d.costo : parseFloat(d.costo ?? "0");
      const potencia = typeof d.potenciaActiva === "number" ? d.potenciaActiva : parseFloat(d.potenciaActiva ?? "0");
      setLecturaVivo({ energia, costo, potencia });
    }
  }, []);

  useWebSocket({
    enabled: !!clienteId,
    onMessage: handleWsMessage,
  });
  const cambiarPasswordMutation = useCambiarPassword();
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);

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

  useEffect(() => {
    if (resumen?.cliente?.passwordTemporal) {
      setRequiereCambioPassword(true);
      setMostrarModalPassword(true);
    }
  }, [resumen]);

  const boletasPendientes = boletas.filter(b => !b.estado || b.estado !== "pagada").length;

  const datosCliente = {
    _id: (user as any)?._id?.toString() || user?.id?.toString(),
    id: user?.id?.toString() || (user as any)?._id?.toString(),
    nombre: resumen?.cliente?.nombre || (user as any)?.nombre || user?.name || "Cliente",
    numeroCliente: resumen?.cliente?.numeroCliente || (user as any)?.numeroCliente || "---",
    direccion: resumen?.cliente?.direccion || (user as any)?.direccion || "No especificada",
    correo: resumen?.cliente?.correo || (user as any)?.correo || user?.email || "",
    email: user?.email || (user as any)?.correo || "",
    telefono: resumen?.cliente?.telefono || (user as any)?.telefono || "",
    imagenPerfil: resumen?.cliente?.imagenPerfil || (user as any)?.imagenPerfil || "",
    ultimoPago: (user as any)?.ultimoPago || "---",
    consumoActual: lecturaVivo?.energia ?? resumen?.estadisticas?.consumoMensual ?? 0,
    ubicacion: (user as any)?.ubicacion || { lat: -33.4489, lng: -70.6693 },
    estadisticas: {
      dispositivosActivos: resumen?.estadisticas?.dispositivosActivos ?? 0,
      dispositivosTotal: resumen?.estadisticas?.dispositivosTotal ?? 0,
      consumoMensual: lecturaVivo?.energia ?? resumen?.estadisticas?.consumoMensual ?? 0,
      costoMensual: lecturaVivo?.costo ?? resumen?.estadisticas?.costoMensual ?? 0,
      boletasPendientes,
    },
  };

  const consumoMesAnterior = 120;
  const consumoActual = datosCliente.estadisticas.consumoMensual;
  const diferenciaPorcentaje = consumoMesAnterior > 0
    ? ((consumoActual - consumoMesAnterior) / consumoMesAnterior) * 100 : 0;
  const esAumento = diferenciaPorcentaje > 0;

  const renderizarComponenteActivo = () => {
    switch (componenteActivo) {
      case "consumo":   return <ConsumoElectrico />;
      case "boletas":   return <PagosFacturas />;
      case "servicio":  return <ControlServicio />;
      case "perfil":
        return <PerfilUsuario datos={datosCliente} />;
      case "notificaciones": return <NotificacionesCliente />;
      case "soporte":        return <SoporteUsuario />;
      default:
        return (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

            {/* Factura estimada — hero card clickeable → Mi Consumo */}
            <motion.div variants={fadeIn}>
              <div
                onClick={() => setComponenteActivo("consumo")}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white p-7 shadow-xl shadow-orange-500/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-500/30"
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-28 -mt-28 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 pointer-events-none" />
                <div className="relative flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Sparkles className="h-4 w-4" />
                      Tu factura estimada este mes
                    </div>
                    <div className="text-5xl font-extrabold tracking-tight">
                      ${datosCliente.estadisticas.costoMensual.toFixed(0)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-white/80">
                      {esAumento ? (
                        <><TrendingUp className="h-4 w-4" /><span>+{Math.abs(diferenciaPorcentaje).toFixed(1)}% vs mes pasado</span></>
                      ) : (
                        <><TrendingDown className="h-4 w-4" /><span>-{Math.abs(diferenciaPorcentaje).toFixed(1)}% vs mes pasado</span></>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70 text-xs mt-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                      Ver mi consumo
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className="bg-white/20 text-white border-white/20 mb-2 text-xs">Este mes</Badge>
                    <div className="text-sm text-white/80 mt-1">
                      {datosCliente.estadisticas.consumoMensual.toFixed(1)} kWh
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Consumo hoy", value: `${(consumoActual / 30).toFixed(1)} kWh`, icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/40", onClick: undefined },
                { label: "Consumo actual", value: `${(lecturaVivo?.potencia ?? 0).toFixed(0)} W`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/40", onClick: undefined },
                { label: "Dispositivos", value: `${datosCliente.estadisticas.dispositivosActivos}/${datosCliente.estadisticas.dispositivosTotal}`, icon: Activity, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/40 cursor-pointer hover:border-sky-400/70 hover:bg-sky-500/20 transition-all", onClick: () => setComponenteActivo("servicio") },
                { label: "Boletas pend.", value: `${datosCliente.estadisticas.boletasPendientes}`, icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/40 cursor-pointer hover:border-amber-400/70 hover:bg-amber-500/20 transition-all", onClick: () => setComponenteActivo("boletas") },
              ].map(({ label, value, icon: Icon, color, bg, onClick }) => (
                <div key={label} onClick={onClick} className={cn("rounded-xl border p-4 card-hover", bg)}>
                  <Icon className={cn("h-4 w-4 mb-2", color)} />
                  <div className={cn("text-lg font-bold", color)}>{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  {onClick && <div className="text-xs text-sky-400/70 mt-1 flex items-center gap-1"><ArrowRight className="h-3 w-3" />{label === "Dispositivos" ? "Ver servicio" : "Ver boletas"}</div>}
                </div>
              ))}
            </motion.div>

            {/* Consumo hoy vs promedio */}
            <motion.div variants={fadeIn}>
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/40 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Consumo Hoy vs Promedio</h3>
                      <p className="text-xs text-muted-foreground">Comparado con tu historial</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Hoy</div>
                      <div className="text-2xl font-bold text-orange-500">{(consumoActual / 30).toFixed(1)} kWh</div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full bg-orange-500 rounded-full" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1, ease: "easeOut" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Promedio</div>
                      <div className="text-2xl font-bold text-muted-foreground">{(consumoMesAnterior / 30).toFixed(1)} kWh</div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full bg-muted-foreground/40 rounded-full" initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* IA Consejos */}
            <motion.div variants={fadeIn}>
              <ConsejosAhorroIA />
            </motion.div>

            {/* Ranking */}
            <motion.div variants={fadeIn}>
              <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-orange-600/5 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/40 rounded-xl flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Tu Ranking de Eficiencia</h3>
                        <p className="text-xs text-muted-foreground">Comparado con clientes similares</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500 text-white text-xs">TOP 30%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tu posición</span>
                      <span className="font-bold text-foreground">30 de 100 clientes</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        initial={{ width: 0 }} animate={{ width: "70%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-orange-500">
                      <Target className="h-3.5 w-3.5" />
                      Consumiendo menos que el 70% de clientes similares
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );
    }
  };

  if (loadingCliente || loadingResumen) {
    return <GlobalLoadingState message="Cargando dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <NavigationCliente onNavigate={setComponenteActivo} activeItem={componenteActivo} imagenPerfil={datosCliente.imagenPerfil} />

      <main className="flex-1 min-w-0 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {componenteActivo === null || componenteActivo === "resumen" ? (
            <motion.div key="resumen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6 max-w-4xl mx-auto">
                <motion.h2
                  className="text-2xl font-extrabold tracking-tight text-foreground"
                  initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                >
                  Bienvenido, <span className="text-gradient-orange">{datosCliente.nombre}</span>
                </motion.h2>
                <motion.p
                  className="text-sm text-muted-foreground mt-1"
                  initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.18 }}
                >
                  Cliente N° {datosCliente.numeroCliente}
                </motion.p>
              </div>
              <div className="max-w-4xl mx-auto">{renderizarComponenteActivo()}</div>
            </motion.div>
          ) : (
            <motion.div
              key={componenteActivo}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto"
            >
              {renderizarComponenteActivo()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CambioPasswordModal
        open={mostrarModalPassword}
        onOpenChange={(open) => { if (!requiereCambioPassword) setMostrarModalPassword(open); }}
        onConfirm={async (currentPassword, newPassword) => {
          cambiarPasswordMutation.mutate(
            { currentPassword, newPassword },
            {
              onSuccess: () => { setRequiereCambioPassword(false); setMostrarModalPassword(false); },
              onError: (error) => { throw error; },
            }
          );
        }}
        requiereActual={!requiereCambioPassword}
        esForzado={requiereCambioPassword}
      />
    </div>
  );
}



