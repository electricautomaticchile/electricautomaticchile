"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, Cpu, Users, FileText, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const beneficios = [
  { icon: Cpu,      titulo: "Gestión masiva de medidores",  desc: "Administra miles de medidores inteligentes desde un solo panel. Escalable desde 1 hasta 10.000+ puntos.",  color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: Zap,      titulo: "Telemetría en tiempo real",    desc: "Datos de consumo, voltaje, corriente y factor de potencia actualizados en tiempo real vía GPRS/4G.",         color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: BarChart3,titulo: "API de integración",           desc: "Integra con tus sistemas ERP, CRM o de facturación mediante nuestra API REST documentada.",                  color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
  { icon: Shield,   titulo: "Detección de fraude eléctrico",desc: "Algoritmos de detección de anomalías que identifican conexiones ilegales y manipulación de medidores.",      color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/30" },
  { icon: Users,    titulo: "Multi-empresa y multi-zona",   desc: "Gestiona múltiples zonas geográficas o empresas subsidiarias con permisos granulares.",                      color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/30" },
  { icon: FileText, titulo: "Reportería regulatoria",       desc: "Genera automáticamente los reportes exigidos por la SEC y otras entidades regulatorias.",                    color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
];

const casos = [
  {
    tipo: "Distribuidoras eléctricas",
    desc: "Automatiza la lectura de medidores, reduce costos operativos y mejora la precisión de la facturación.",
    metricas: ["Reducción 80% en visitas técnicas", "99.5% precisión en lecturas", "Facturación automática"],
    color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/40", gradient: "from-orange-500/10 to-transparent",
    metricColors: ["text-orange-400", "text-amber-400", "text-sky-400"],
  },
  {
    tipo: "Contratistas eléctricos",
    desc: "Ofrece a tus clientes un servicio de valor agregado con monitoreo continuo post-instalación.",
    metricas: ["Nuevas fuentes de ingreso recurrente", "Diferenciación competitiva", "Soporte remoto 24/7"],
    color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/40", gradient: "from-sky-500/10 to-transparent",
    metricColors: ["text-sky-400", "text-emerald-400", "text-amber-400"],
  },
  {
    tipo: "Empresas industriales",
    desc: "Controla el consumo de múltiples plantas o instalaciones con alertas de demanda máxima.",
    metricas: ["Optimización de tarifa eléctrica", "Reducción de multas por demanda", "Reportes de eficiencia"],
    color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/40", gradient: "from-emerald-500/10 to-transparent",
    metricColors: ["text-emerald-400", "text-violet-400", "text-orange-400"],
  },
];

export default function EmpresasElectricidadPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5" />
              Solución para Empresas Eléctricas
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Plataforma IoT para el <span className="text-gradient-orange">Sector Eléctrico</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tecnología de medición inteligente y gestión remota para distribuidoras, contratistas y empresas industriales. Escala tu operación sin escalar tus costos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                  Solicitar demo técnica <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                  Ver soluciones
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VISUAL */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-orange-500/20 bg-[#0a0a0a]"
          >
            <Image
              src="/images/hero/hero-comercial-dashboard.png"
              alt="Medición inteligente con datos de consumo, voltaje y estado para empresas eléctricas"
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Capacidades de la plataforma</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Todo lo que necesitas para gestionar tu operación eléctrica</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficios.map((b, i) => (
              <motion.div key={b.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`relative rounded-xl border ${b.border} bg-[#0a0a0a] p-8 overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${b.bg}`} />
                <div className={`w-14 h-14 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center mb-5`}>
                  <b.icon className={`h-7 w-7 ${b.color}`} />
                </div>
                <h3 className="font-bold mb-3 text-base">{b.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Casos de uso</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Soluciones adaptadas a cada tipo de empresa del sector eléctrico</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {casos.map((c, i) => (
              <motion.div key={c.tipo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${c.border} bg-gradient-to-br ${c.gradient} bg-[#0f0f0f] overflow-hidden p-8`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${c.bg}`} />
                <div className={`w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5`}>
                  <Zap className={`h-7 w-7 ${c.color}`} />
                </div>
                <h3 className={`font-bold text-lg mb-3 ${c.color}`}>{c.tipo}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{c.desc}</p>
                <div className="space-y-3">
                  {c.metricas.map((m, idx) => (
                    <div key={m} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${c.metricColors[idx]}`} />
                      <span className="text-sm text-muted-foreground">{m}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl border border-orange-500/30 bg-[#0a0a0a] overflow-hidden text-center p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-6">
                <Cpu className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Hablemos de tu proyecto</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Cada empresa tiene necesidades distintas. Nuestro equipo técnico puede diseñar una solución a medida.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                    Contactar equipo técnico <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/soluciones">
                  <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                    Ver todas las soluciones
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
