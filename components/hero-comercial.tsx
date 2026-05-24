"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, BarChart3, Shield,
  MapPin, Building2, Users, Activity, Clock, Smartphone, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ElectricBolt, MeterIcon, IoTSignalIcon } from "@/components/ui/electric-bolt";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function StatCounter({ value, suffix, label, color = "text-orange-500" }: {
  value: number; suffix: string; label: string; color?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <div className={`text-2xl font-bold ${color}`}>
        {inView ? <AnimatedCounter value={value} suffix={suffix} duration={1600} /> : `0${suffix}`}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

const sectors = [
  { icon: Building2, title: "Compañías Eléctricas", desc: "Gestión masiva, reducción de costos 70%",      color: "from-orange-500/10 to-orange-600/5",  border: "border-orange-500/40",  iconColor: "text-orange-400",  iconBg: "bg-orange-500/15",  href: "/empresas-electricidad" },
  { icon: Users,     title: "Condominios",           desc: "Control centralizado, facturación individual", color: "from-sky-500/10 to-sky-600/5",         border: "border-sky-500/35",     iconColor: "text-sky-400",     iconBg: "bg-sky-500/15",     href: "/condominios" },
  { icon: Building2, title: "Industrias",            desc: "Optimización energética por área",             color: "from-amber-500/10 to-amber-600/5",     border: "border-amber-500/40",   iconColor: "text-amber-400",   iconBg: "bg-amber-500/15",   href: "/industrias" },
  { icon: Building2, title: "Comercios",             desc: "Control remoto de múltiples sucursales",       color: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/35", iconColor: "text-emerald-400", iconBg: "bg-emerald-500/15", href: "/comercios" },
];

const features = [
  { icon: Clock,    title: "Reposición Automática", desc: "De 48 hrs a minutos",         color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: BarChart3,title: "Lectura Inteligente",   desc: "Consumo en tiempo real",       color: "text-amber-400",  bg: "bg-amber-500/10" },
  { icon: Shield,   title: "Gestión Remota",        desc: "Control total desde web",      color: "text-sky-400",    bg: "bg-sky-500/10" },
  { icon: MapPin,   title: "Protección GPS",        desc: "Localización del dispositivo", color: "text-emerald-400",bg: "bg-emerald-500/10" },
];

export function HeroComercial() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 hero-grid-pattern pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-orange-500/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 pt-16 pb-24 relative z-10">

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
          <motion.div variants={stagger} initial="hidden" animate="visible">

            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              <span className="text-foreground">Automatización</span>
              <br />
              <span className="text-gradient-orange">Inteligente</span>
              <br />
              <span className="text-foreground">del Suministro</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Eliminamos los tiempos de espera en la reposición eléctrica.
              Control total desde cualquier lugar, en tiempo real.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-2.5 mb-8">
              {[
                { text: "Reposición de 24-48 hrs a minutos",              bg: "bg-orange-500/15", color: "text-orange-400" },
                { text: "Monitoreo en tiempo real vía web, SMS y email",  bg: "bg-sky-500/15",    color: "text-sky-400" },
                { text: "Gestión remota con protección GPS",               bg: "bg-emerald-500/15",color: "text-emerald-400" },
              ].map(({ text, bg, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 gap-2 group w-full sm:w-auto">
                  Solicitar Demo Gratuita
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 w-full sm:w-auto">
                  Ver Soluciones
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <StatCounter value={99.8} suffix="%" label="Cobertura Chile"  color="text-orange-400" />
              <StatCounter value={80}   suffix="%" label="Ahorro de tiempo" color="text-amber-400" />
              <StatCounter value={24}   suffix="/7" label="Monitoreo activo" color="text-sky-400" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
            className="space-y-3"
          >
            <div className="relative min-h-[360px] rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl shadow-orange-500/10 card-hover bg-[#0a0a0a]">
              <Image
                src="/images/hero/hero-comercial-cloud.png"
                alt="Sistema inteligente de medición eléctrica conectado a la nube y app móvil"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {features.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="glass rounded-xl p-4 card-hover cursor-default"
                >
                  <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* DISPOSITIVO FÍSICO */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mb-28"
        >
          <div className="rounded-3xl border border-border/60 glass">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden min-h-[320px] rounded-tl-3xl rounded-bl-3xl lg:rounded-tr-none rounded-tr-3xl">
                <Image
                  src="/images/hero/hero-comercial-wall.png"
                  alt="Medidor eléctrico inteligente con métricas de consumo, voltaje y ubicación"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  El dispositivo que lo hace posible
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Nuestro módulo IoT se instala directamente en el tablero eléctrico.
                  Mide consumo en tiempo real, ejecuta cortes y reconexiones remotas,
                  y se comunica con la plataforma al instante.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: IoTSignalIcon, label: "Comunicación en tiempo real",              iconColor: "text-sky-400",     border: "border-sky-500/40",     bg: "bg-sky-500/10" },
                    { icon: ElectricBolt,  label: "Corte y reconexión remota instantánea",    iconColor: "text-amber-400",   border: "border-amber-500/40",   bg: "bg-amber-500/10" },
                    { icon: MeterIcon,     label: "Lectura de voltaje, corriente y potencia", iconColor: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10" },
                  ].map(({ icon: Icon, label, iconColor, border, bg }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${bg} border ${border} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon size={16} className={iconColor} />
                      </div>
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CÓMO FUNCIONA */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mb-28 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold">
            <Activity className="h-3.5 w-3.5 text-orange-400" />
            Ecosistema conectado
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Cómo funciona</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            Todo el ecosistema conectado en tiempo real, de extremo a extremo
          </p>
          <div className="relative mx-auto mb-10 aspect-[1024/753] max-w-3xl overflow-hidden rounded-2xl border border-orange-500/20 bg-black">
            <Image
              src="/images/hero/landing-electric-network.png"
              alt="Red inteligente conectando hogares, industrias, nube y app móvil"
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {[
              { icon: MeterIcon,     label: "Medidor Eléctrico", sub: "Hardware", color: "text-yellow-400", border: "border-yellow-500/40", bg: "bg-yellow-500/10", subColor: "text-yellow-400/70" },
              { icon: IoTSignalIcon, label: "Dispositivo IoT",   sub: "Módulo",   color: "text-sky-400",  border: "border-sky-500/40",   bg: "bg-sky-500/10",    subColor: "text-sky-400/70" },
              { icon: ElectricBolt,  label: "Nuestro Sistema",   sub: "Cloud",    color: "text-orange-400", border: "border-orange-500/60", bg: "bg-[#0a0a0a]",         subColor: "text-orange-400/70" },
              { icon: Smartphone,    label: "App / Web",         sub: "Cliente",  color: "text-emerald-400",border: "border-emerald-500/40",bg: "bg-emerald-500/10",subColor: "text-emerald-400/70" },
            ].map(({ icon: Icon, label, sub, color, border, bg, subColor }, i) => (
              <div key={label} className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.12 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-16 h-16 ${bg} border ${border} rounded-2xl flex items-center justify-center card-hover cursor-default`}>
                    <Icon size={28} className={color} />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className={`text-xs font-medium ${subColor}`}>{sub}</div>
                  </div>
                </motion.div>
                {i < 3 && (
                  <div className="hidden sm:flex items-center gap-1 mx-1">
                    <div className="w-6 h-px bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-sky-500/30" />
                    <ArrowRight className="h-3.5 w-3.5 text-amber-400/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* COLABORADORES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-28 text-center"
        >
          <p className="text-sm text-orange-400 mb-6 font-bold uppercase tracking-widest">
            Colaboramos con
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="px-8 py-4 rounded-2xl border border-border bg-white shadow-sm card-hover cursor-default">
              <Image src="/images/partners/chilquinta-logotipo.svg" alt="Chilquinta Energía" width={160} height={44} className="h-9 w-auto" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { text: "Certificado ISO 9001",       color: "text-orange-400" },
              { text: "Normativa SEC Chile",         color: "text-sky-400" },
              { text: "Tecnología IoT Certificada",  color: "text-amber-400" },
              { text: "Soporte 24/7",                color: "text-emerald-400" },
            ].map(({ text, color }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className={`h-4 w-4 ${color}`} />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTORES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Soluciones para Cada Sector
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Desde compañías eléctricas hasta hogares, nuestra tecnología se adapta a cada necesidad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          {sectors.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={item.href} className="block h-full">
                <div className={`h-full rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} p-6 card-hover group`}>
                  <div className={`w-11 h-11 rounded-xl ${item.iconBg} border ${item.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                  <div className={`flex items-center gap-1 text-sm font-medium ${item.iconColor} group-hover:gap-2 transition-all duration-200`}>
                    Ver más <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
