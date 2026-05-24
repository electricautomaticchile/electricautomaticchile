"use client";

import {
  Building2, Home, Factory, Store, Zap, Clock, Shield,
  BarChart3, Smartphone, MapPin, CheckCircle2, ArrowRight, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const solutions = [
  {
    icon: Building2,
    title: "Compañías Eléctricas",
    description: "Optimiza la gestión de miles de clientes con nuestra plataforma integral. Reduce costos operativos hasta en un 70% y mejora la recuperación de cartera morosa.",
    benefits: [
      "Gestión masiva de cortes y reposiciones automáticas",
      "Reducción drástica de costos de personal en terreno",
      "Reportes automáticos de consumo y facturación",
      "Dashboard centralizado para monitoreo en tiempo real",
      "Integración con sistemas de facturación existentes",
    ],
    stat: { value: "70%", label: "Reducción de costos operativos" },
    color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/40",
    gradient: "from-orange-500/10 to-transparent", statColor: "text-orange-400",
    href: "/empresas-electricidad",
  },
  {
    icon: Home,
    title: "Condominios y Edificios",
    description: "Control centralizado del suministro eléctrico de múltiples unidades con facturación individual automatizada y transparente.",
    benefits: [
      "Facturación automática por unidad habitacional",
      "Control independiente de áreas comunes",
      "Transparencia total en consumos individuales",
      "Gestión de morosos sin afectar a otros residentes",
      "Reportes mensuales automáticos para administración",
    ],
    stat: { value: "100%", label: "Transparencia en consumos" },
    color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/40",
    gradient: "from-sky-500/10 to-transparent", statColor: "text-sky-400",
    href: "/condominios",
  },
  {
    icon: Factory,
    title: "Industrias",
    description: "Monitoreo detallado de consumo energético para optimizar procesos productivos y reducir costos operacionales significativamente.",
    benefits: [
      "Análisis de consumo por área o línea de producción",
      "Detección automática de anomalías y fugas energéticas",
      "Optimización de horarios de producción según tarifas",
      "Reportes de eficiencia energética en tiempo real",
      "Alertas de consumo fuera de parámetros normales",
    ],
    stat: { value: "30%", label: "Ahorro energético promedio" },
    color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/40",
    gradient: "from-amber-500/10 to-transparent", statColor: "text-amber-400",
    href: "/industrias",
  },
  {
    icon: Store,
    title: "Comercios y Retail",
    description: "Gestión eficiente del suministro en locales comerciales con control remoto centralizado y alertas inteligentes de consumo.",
    benefits: [
      "Control remoto de múltiples sucursales desde un solo lugar",
      "Alertas de consumo anormal o fuera de horario",
      "Reportes mensuales automáticos por local",
      "Programación de horarios de operación",
      "Comparativas de consumo entre sucursales",
    ],
    stat: { value: "24/7", label: "Control remoto" },
    color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/40",
    gradient: "from-emerald-500/10 to-transparent", statColor: "text-emerald-400",
    href: "/comercios",
  },
];

const features = [
  { icon: Clock,       title: "Reposición Automática",      desc: "De 24-48 hrs a minutos. Sin personal en terreno.",                    color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: BarChart3,   title: "Lectura Inteligente",        desc: "Consumo mensual automático con reportes vía web, SMS y email.",        color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: Shield,      title: "Gestión Remota",             desc: "Cortes y reposiciones desde la plataforma. Sin desplazamientos.",      color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
  { icon: MapPin,      title: "Protección GPS",             desc: "Localización en tiempo real. Alertas ante manipulación no autorizada.", color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/30" },
  { icon: Smartphone,  title: "Notificaciones Instantáneas",desc: "Alertas de consumo, pagos y estado del servicio. WhatsApp, SMS, email.",color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
  { icon: Zap,         title: "Comandos Remotos",           desc: "Reconfiguración masiva sin visitas técnicas. Firmware remoto.",        color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30" },
];

const checkColors = ["text-orange-400", "text-sky-400", "text-amber-400", "text-emerald-400", "text-violet-400"];

export default function SolucionesPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              Tecnología que <span className="text-gradient-orange">Transforma</span>
              <br />la Gestión Eléctrica
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Soluciones integrales adaptadas a cada sector, con tecnología IoT de vanguardia y soporte 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                  Solicitar Demo Gratuita
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/acerca-de">
                <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                  Conocer más
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMÁGENES */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-orange-500/20"
            >
              <Image src="/images/hero/hero-comercial-dashboard.png" alt="Medidor inteligente conectado a paneles de datos eléctricos" fill className="object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-orange-500/20"
            >
              <Image src="/images/platform/phone-app.png" alt="Aplicación móvil para monitoreo y control del consumo eléctrico" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUCIONES POR SECTOR */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Soluciones para Cada Sector</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Adaptable a diferentes escalas de operación, con resultados medibles</p>
          </motion.div>

          <div className="space-y-6">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.gradient} bg-[#0f0f0f] overflow-hidden`}
              >
                <div className={`h-1 w-full ${s.bg}`} />
                <div className="p-8 md:p-10">
                  <div className="grid md:grid-cols-[1fr,auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                          <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold">{s.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{s.description}</p>
                      <div className="space-y-2.5">
                        {s.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${checkColors[idx % checkColors.length]}`} />
                            <span className="text-sm text-muted-foreground">{b}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={s.href} className={`inline-flex items-center gap-1.5 mt-6 text-sm font-medium ${s.color} hover:gap-2.5 transition-all duration-200`}>
                        Ver más <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className={`text-center rounded-xl ${s.bg} border ${s.border} p-6 min-w-[160px]`}>
                      <div className={`text-4xl font-extrabold ${s.statColor} mb-1`}>{s.stat.value}</div>
                      <div className="text-xs text-muted-foreground">{s.stat.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Características de Nuestra Tecnología</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Automatiza procesos, reduce costos y mejora la experiencia del cliente</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-xl border ${f.border} bg-[#0a0a0a] p-6 overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${f.bg}`} />
                <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl border border-orange-500/30 overflow-hidden text-center p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Transformar tu Gestión Eléctrica?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Agenda una demo gratuita y descubre cómo podemos optimizar tus operaciones</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                    Solicitar Demo Gratuita
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cliente-login">
                  <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                    Acceder a la Plataforma
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
