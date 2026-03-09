"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, TrendingDown, AlertTriangle, Settings, ArrowRight, CheckCircle2, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const beneficios = [
  { icon: BarChart3,    titulo: "Monitoreo por área o línea",       desc: "Mide el consumo de cada zona de tu planta por separado. Identifica qué proceso consume más.",              color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: TrendingDown, titulo: "Control de demanda máxima",        desc: "Evita multas por exceder la demanda contratada. El sistema alerta antes de llegar al límite.",             color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: AlertTriangle,titulo: "Alertas de consumo anómalo",       desc: "Detecta equipos con fallas eléctricas o fugas de corriente antes de que se conviertan en problemas.",      color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/30" },
  { icon: Zap,          titulo: "Corte y reconexión remota",        desc: "Gestiona el suministro de cada área o máquina desde la plataforma. Sin personal en terreno.",              color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
  { icon: Settings,     titulo: "Integración con sistemas",         desc: "Conecta con tus sistemas de control industrial existentes mediante API REST o protocolos estándar.",        color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/30" },
  { icon: Shield,       titulo: "Reportes de eficiencia energética",desc: "Genera informes automáticos para auditorías internas, certificaciones ISO 50001 y sostenibilidad.",        color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
];

const casos = [
  {
    tipo: "Plantas de manufactura",
    desc: "Monitorea líneas de producción, hornos, compresores y sistemas de climatización por separado.",
    metricas: ["Reducción 25% en costos eléctricos", "Cero multas por demanda", "Mantenimiento predictivo"],
    color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/40", gradient: "from-orange-500/10 to-transparent",
    metricColors: ["text-orange-400", "text-amber-400", "text-sky-400"],
  },
  {
    tipo: "Minería y extracción",
    desc: "Control eléctrico en faenas remotas con conectividad satelital y respaldo de datos local.",
    metricas: ["Operación en zonas sin cobertura", "Alertas críticas 24/7", "Reportes regulatorios automáticos"],
    color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/40", gradient: "from-sky-500/10 to-transparent",
    metricColors: ["text-sky-400", "text-emerald-400", "text-amber-400"],
  },
  {
    tipo: "Agroindustria",
    desc: "Gestión eléctrica de sistemas de riego, cámaras frigoríficas y plantas de procesamiento.",
    metricas: ["Protección de cadena de frío", "Optimización de tarifa nocturna", "Control multi-predio"],
    color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/40", gradient: "from-emerald-500/10 to-transparent",
    metricColors: ["text-emerald-400", "text-violet-400", "text-orange-400"],
  },
];

export default function IndustriasPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <Factory className="h-3.5 w-3.5" />
              Solución Industrial
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Optimización Eléctrica para <span className="text-gradient-orange">Industrias</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Reduce costos, evita multas por demanda máxima y monitorea cada área de tu planta en tiempo real con tecnología IoT industrial.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                  Solicitar diagnóstico gratuito <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                  Ver todas las soluciones
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Capacidades para tu planta</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Tecnología IoT diseñada para entornos industriales exigentes</p>
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

      {/* SECTORES */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Sectores industriales</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Soluciones adaptadas a cada tipo de industria</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {casos.map((c, i) => (
              <motion.div key={c.tipo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${c.border} bg-gradient-to-br ${c.gradient} bg-[#0f0f0f] overflow-hidden p-8`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${c.bg}`} />
                <div className={`w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5`}>
                  <Factory className={`h-7 w-7 ${c.color}`} />
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
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="h-7 w-7 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">¿Cuánto estás perdiendo en energía?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Un diagnóstico gratuito puede revelar oportunidades de ahorro que no sabías que existían.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                    Solicitar diagnóstico gratuito <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
