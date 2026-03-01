"use client";

import { Button } from "@/components/ui/button";
import {
  Clock, BarChart3, Shield, ArrowRight, CheckCircle2,
  MapPin, Users, Building2, TrendingDown, Wifi, Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ElectricBolt, MeterIcon, IoTSignalIcon } from "@/components/ui/electric-bolt";
import { LiveBadge } from "@/components/ui/live-badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      <div className="text-3xl font-bold">
        {inView ? <AnimatedCounter value={value} suffix={suffix} duration={1800} /> : `0${suffix}`}
      </div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
}

export function HeroComercial() {
  return (
    <div className="relative overflow-hidden bg-black">

      {/* Gradiente de fondo negro → naranja sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow naranja fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── HERO PRINCIPAL ── */}
      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">

          {/* Columna izquierda */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-white"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm rounded-full">
              <Wifi className="h-4 w-4 text-orange-400" />
              <span className="font-medium text-sm text-orange-300">Tecnología IoT para Chile</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Automatización{" "}
              <span className="text-orange-500">Inteligente</span>{" "}
              del Suministro Eléctrico
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl mb-8 text-white/70 leading-relaxed">
              Eliminamos los tiempos de espera en la reposición del servicio eléctrico.
              Control total desde cualquier lugar, en tiempo real.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-3 mb-8">
              {[
                "Reposición de 24-48 hrs a minutos",
                "Monitoreo en tiempo real vía web, SMS y email",
                "Gestión remota con protección GPS",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white group w-full sm:w-auto">
                  Solicitar Demo Gratuita
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                  Ver Soluciones
                </Button>
              </Link>
            </motion.div>

            {/* Counters animados */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <StatCounter value={99.8} suffix="%" label="Cobertura Chile" />
              <StatCounter value={80} suffix="%" label="Ahorro de tiempo" />
              <StatCounter value={24} suffix="/7" label="Monitoreo activo" />
            </motion.div>
          </motion.div>

          {/* Columna derecha — mockup + cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Mockup principal del dashboard */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/10">
              <div className="absolute top-3 left-3 z-10">
              </div>
              <Image
                src="/tablero-completo.png"
                alt="Dashboard ElectricAutomaticChile en tiempo real"
                width={700}
                height={420}
                className="w-full object-cover"
                priority
              />
            </div>

            {/* Cards de features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, title: "Reposición Automática", desc: "Servicio en minutos tras regularizar pago", color: "text-orange-400" },
                { icon: BarChart3, title: "Lectura Inteligente", desc: "Consumo en tiempo real con reportes automáticos", color: "text-blue-400" },
                { icon: Shield, title: "Gestión Remota", desc: "Control total desde la plataforma web", color: "text-green-400" },
                { icon: MapPin, title: "Protección GPS", desc: "Localización y seguridad del dispositivo", color: "text-purple-400" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition-colors"
                >
                  <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── SECCIÓN DISPOSITIVO FÍSICO ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full">
                <MeterIcon size={18} className="text-orange-400" />
                <span className="text-xs font-medium text-orange-300">Hardware IoT</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                El dispositivo que lo hace posible
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                Nuestro módulo IoT se instala directamente en el tablero eléctrico.
                Mide consumo en tiempo real, ejecuta cortes y reconexiones remotas,
                y se comunica con la plataforma en tiempo real.
              </p>
              <div className="space-y-3">
                {[
                  { icon: IoTSignalIcon, label: "Comunicación en tiempo real" },
                  { icon: ElectricBolt, label: "Corte y reconexión remota instantánea" },
                  { icon: MeterIcon, label: "Lectura de voltaje, corriente y potencia" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-white/70">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-orange-400" />
                    </div>
                    <span className="text-sm">{label}</span>
                  </div>
                ))}

              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-orange-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/medidor-arduino.png"
                  alt="Dispositivo Arduino instalado en tablero eléctrico"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── DIAGRAMA DEL SISTEMA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Cómo funciona</h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Todo el ecosistema conectado en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { icon: MeterIcon, label: "Medidor Eléctrico" },
              { icon: ElectricBolt, label: "Dispositivo IoT" },
              { icon: IoTSignalIcon, label: "Nuestro sistema"},
              { icon: Smartphone, label: "App movil / Web" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                    <Icon size={32} className="text-orange-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">{label}</span>
                  
                </motion.div>
                {i < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className="hidden sm:flex items-center gap-1 text-orange-500/50"
                  >
                    <div className="w-8 h-px bg-orange-500/40" />
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── COLABORADORES ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <p className="text-sm text-white/40 mb-6 font-medium uppercase tracking-widest">
            Colaboramos con
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-8 py-4 bg-white rounded-xl shadow-lg"
            >
              <Image src="/Chilquinta_Logotipo.svg" alt="Chilquinta Energía" width={180} height={48} className="h-10 w-auto" />
            </motion.div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            {["Certificado ISO 9001", "Normativa SEC Chile", "Tecnología IoT Certificada", "Soporte 24/7"].map((cert) => (
              <div key={cert} className="flex items-center gap-2 text-white/60">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTORES ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Soluciones para Cada Sector</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Desde compañías eléctricas hasta hogares, nuestra tecnología se adapta a cada necesidad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 pb-20">
          {[
            { icon: Building2, title: "Compañías Eléctricas", desc: "Gestión masiva con reducción de costos del 70%", gradient: "from-blue-500 to-blue-600" },
            { icon: Users, title: "Condominios", desc: "Control centralizado con facturación individual", gradient: "from-green-500 to-green-600" },
            { icon: Building2, title: "Industrias", desc: "Optimización energética con análisis por área", gradient: "from-purple-500 to-purple-600" },
            { icon: Building2, title: "Comercios", desc: "Control remoto de múltiples sucursales", gradient: "from-orange-400 to-orange-500" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 mb-4">{item.desc}</p>
                <Link href="/soluciones" className="inline-flex items-center gap-1 text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Ver más <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
