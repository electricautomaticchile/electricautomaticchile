"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ConsumoElectrico } from "@/components/features/dashboard-cliente/consumo-electrico";
import { PagosFacturas } from "@/components/features/dashboard-cliente/pagos-facturas";
import { SoporteUsuarioNuevo as SoporteUsuario } from "@/components/features/dashboard-cliente/soporte-usuario";
import { PerfilUsuario } from "@/components/features/dashboard-cliente/perfil-usuario";
import { MapaBasico } from "@/components/features/dashboard-cliente/ubicacion/MapaBasico";
import { ControlServicio } from "@/components/features/dashboard-cliente/control-servicio";
import { NotificacionesCliente } from "@/components/features/dashboard-cliente/notificaciones-cliente";
import { ConsejosAhorroIA } from "@/components/features/dashboard-cliente/consejos-ahorro-ia";
import NavigationCliente from "@/components/features/dashboard-cliente/layout/navigation";
import { useApi } from "@/hooks/useApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardCliente } from "@/hooks/queries/useDashboardQuery";
import { GlobalLoadingState } from "@/components/shared";
import { useCambiarPassword } from "@/hooks/queries/useAuthMutations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Activity,
  AlertCircle,
  Trophy,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1
  }
};

export default function DashboardCliente() {
  const { user, isLoading: loadingCliente, isRealAuthenticated } = useApi();
  const { data: resumenData, isLoading: loadingResumen } = useDashboardCliente();
  const cambiarPasswordMutation = useCambiarPassword();
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);

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

  useEffect(() => {
    if (resumenData?.data?.cliente?.passwordTemporal) {
      setRequiereCambioPassword(true);
      setMostrarModalPassword(true);
    }
  }, [resumenData]);

  const datosCliente = {
    _id: (user as any)?._id?.toString() || user?.id?.toString(),
    id: user?.id?.toString() || (user as any)?._id?.toString(),
    nombre: resumenData?.data?.cliente?.nombre || (user as any)?.nombre || user?.name || "Cliente",
    numeroCliente: resumenData?.data?.cliente?.numeroCliente || (user as any)?.numeroCliente || "---",
    direccion: (resumenData?.data?.cliente as any)?.direccion || (user as any)?.direccion || "No especificada",
    correo: resumenData?.data?.cliente?.correo || (user as any)?.correo || user?.email || "",
    email: user?.email || (user as any)?.correo || "",
    telefono: (resumenData?.data?.cliente as any)?.telefono || (user as any)?.telefono || "",
    imagenPerfil: (resumenData?.data?.cliente as any)?.imagenPerfil || (user as any)?.imagenPerfil || "",
    ultimoPago: (user as any)?.ultimoPago || "---",
    consumoActual: resumenData?.data?.estadisticas?.consumoMensual || (user as any)?.consumoActual || 0,
    ubicacion: (user as any)?.ubicacion || { lat: -33.4489, lng: -70.6693 },
    estadisticas: resumenData?.data?.estadisticas || {
      dispositivosActivos: 0,
      dispositivosTotal: 0,
      consumoMensual: 0,
      costoMensual: 0,
      boletasPendientes: 0,
    },
  };

  const consumoMesAnterior = 120;
  const consumoActual = datosCliente.estadisticas.consumoMensual;
  const diferenciaPorcentaje = consumoMesAnterior > 0 
    ? ((consumoActual - consumoMesAnterior) / consumoMesAnterior) * 100 
    : 0;
  const esAumento = diferenciaPorcentaje > 0;

  const handlePasswordChangeSuccess = () => {
    setRequiereCambioPassword(false);
  };

  const renderizarComponenteActivo = () => {
    switch (componenteActivo) {
      case "consumo":
        return <ConsumoElectrico />;
      case "boletas":
        return <PagosFacturas />;
      case "servicio":
        return <ControlServicio />;
      case "perfil":
        return (
          <Tabs defaultValue="datos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="datos">Mis Datos</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
            </TabsList>
            <TabsContent value="datos" className="mt-6">
              <PerfilUsuario datos={datosCliente} />
            </TabsContent>
            <TabsContent value="ubicacion" className="mt-6">
              <MapaBasico
                ubicacion={datosCliente.ubicacion}
                direccionRegistrada={datosCliente.direccion}
              />
            </TabsContent>
          </Tabs>
        );
      case "notificaciones":
        return <NotificacionesCliente />;
      case "soporte":
        return <SoporteUsuario />;
      case "resumen":
      case null:
      default:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Hero Section - Proyección de Factura */}
            <motion.div variants={fadeIn}>
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
                <CardContent className="relative p-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-medium opacity-90">Tu factura estimada</span>
                      </div>
                      <div>
                        <div className="text-5xl font-bold mb-2">
                          ${datosCliente.estadisticas.costoMensual.toFixed(0)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {esAumento ? (
                            <>
                              <TrendingUp className="h-4 w-4" />
                              <span>+{Math.abs(diferenciaPorcentaje).toFixed(1)}% vs mes pasado</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4" />
                              <span>-{Math.abs(diferenciaPorcentaje).toFixed(1)}% vs mes pasado</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setComponenteActivo("boletas")}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        Ver detalles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white/20 text-white border-white/30 mb-2">
                        Este mes
                      </Badge>
                      <div className="text-sm opacity-90">
                        {datosCliente.estadisticas.consumoMensual.toFixed(1)} kWh
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consumo Hoy vs Promedio */}
            <motion.div variants={fadeIn}>
              <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Consumo Hoy</h3>
                        <p className="text-sm text-muted-foreground">Comparado con tu promedio</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Hoy</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {(consumoActual / 30).toFixed(1)} kWh
                      </div>
                      <div className="h-2 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Promedio</div>
                      <div className="text-3xl font-bold text-gray-400">
                        {(consumoMesAnterior / 30).toFixed(1)} kWh
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gray-400"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consejo IA del Día - Prominente */}
            <motion.div variants={scaleIn}>
              <ConsejosAhorroIA />
            </motion.div>

            {/* Ranking del Cliente */}
            <motion.div variants={fadeIn}>
              <Card className="border-l-4 border-l-yellow-500 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Tu Ranking de Eficiencia</h3>
                        <p className="text-sm text-muted-foreground">Comparado con clientes similares</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">TOP 30%</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tu posición</span>
                      <span className="font-bold">30 de 100 clientes</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <motion.div 
                        className="absolute h-full w-1 bg-white shadow-lg"
                        initial={{ left: 0 }}
                        animate={{ left: "70%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Target className="h-4 w-4" />
                      <span>¡Sigue así! Estás consumiendo menos que el 70% de clientes similares</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Grid de Consumo y Notificaciones */}
            <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2">
              <div onClick={() => setComponenteActivo("consumo")} className="cursor-pointer">
                <ConsumoElectrico reducida={true} />
              </div>
              <div onClick={() => setComponenteActivo("notificaciones")} className="cursor-pointer">
                <NotificacionesCliente />
              </div>
            </motion.div>

            {/* Dispositivos */}
            <motion.div variants={fadeIn}>
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                        <Zap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Tus Dispositivos</h3>
                        <p className="text-sm text-muted-foreground">
                          {datosCliente.estadisticas.dispositivosActivos} de {datosCliente.estadisticas.dispositivosTotal} activos
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setComponenteActivo("servicio")}
                    >
                      Ver detalles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Medidor {i}</span>
                          <div className="flex items-center gap-1">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {(consumoActual / 2).toFixed(1)} kWh
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pagos y Facturas */}
            <motion.div variants={fadeIn}>
              <div onClick={() => setComponenteActivo("boletas")} className="cursor-pointer">
                <PagosFacturas reducida={true} />
              </div>
            </motion.div>
          </motion.div>
        );
    }
  };

  if (loadingCliente || loadingResumen) {
    return <GlobalLoadingState message="Cargando dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        <NavigationCliente
          onNavigate={setComponenteActivo}
          activeItem={componenteActivo}
        />
        <main className="flex-1 bg-background p-6">
          <AnimatePresence mode="wait">
            {componenteActivo === null || componenteActivo === "resumen" ? (
              <motion.div
                key="resumen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <motion.h2 
                    className="text-3xl font-bold text-foreground"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    👋 Bienvenido, {datosCliente.nombre}
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Cliente N° {datosCliente.numeroCliente}
                  </motion.p>
                </div>
                {renderizarComponenteActivo()}
              </motion.div>
            ) : (
              <motion.div
                key={componenteActivo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderizarComponenteActivo()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CambioPasswordModal
        open={mostrarModalPassword}
        onOpenChange={(open) => {
          if (!requiereCambioPassword) {
            setMostrarModalPassword(open);
          }
        }}
        onConfirm={async (currentPassword, newPassword) => {
          cambiarPasswordMutation.mutate(
            { currentPassword, newPassword },
            {
              onSuccess: () => {
                handlePasswordChangeSuccess();
                setMostrarModalPassword(false);
              },
              onError: (error) => {
                throw error;
              },
            }
          );
        }}
        requiereActual={!requiereCambioPassword}
        esForzado={requiereCambioPassword}
      />
    </div>
  );
}
