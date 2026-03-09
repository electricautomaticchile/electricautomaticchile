"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, MapPin, Smartphone, TrendingDown, ArrowRight, CheckCircle2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const beneficios = [
  { icon: MapPin,      titulo: "Control multi-sucursal",          desc: "Gestiona el consumo de todas tus tiendas desde un solo panel, sin importar cuántas sucursales tengas.",  color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: Smartphone,  titulo: "Alertas en tiempo real",          desc: "Notificaciones al instante si una sucursal supera su límite o hay un equipo encendido fuera de horario.", color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: TrendingDown,titulo: "Reducción de costos",             desc: "Identifica equipos en standby, optimiza climatización y reduce tu factura eléctrica mensual.",            color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
  { icon: Zap,         titulo: "Corte remoto de emergencia",      desc: "Ante un cierre de local, corta el suministro de forma remota sin necesidad de enviar personal.",          color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/30" },
  { icon: BarChart3,   titulo: "Comparativa entre sucursales",    desc: "Compara el consumo entre locales del mismo tamaño. Detecta cuál está siendo ineficiente.",               color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/30" },
  { icon: Shield,      titulo: "Protección contra robos eléctricos",desc: "Detecta consumos inusuales fuera del horario comercial que podrían indicar accesos no autorizados.",   color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
];

const casos = [
  {
    tipo: "Cadenas de retail",
    desc: "Monitoreo centralizado de decenas de tiendas con reportes consolidados por región o formato.",
    metricas: ["Dashboard unificado multi-tienda", "Alertas por consumo fuera de horario", "Reportes mensuales automáticos"],
    color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/40", gradient: "from-orange-500/10 to-transparent",
    metricColors: ["text-orange-400", "text-amber-400", "text-sky-400"],
  },
  {
    tipo: "Restaurantes y cafeterías",
    desc: "Control de cocinas industriales, cámaras de frío y sistemas de climatización en tiempo real.",
    metricas: ["Protección de equipos de frío", "Optimización de horarios pico", "Reducción 20% en consumo"],
    color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/40", gradient: "from-sky-500/10 to-transparent",
    metricColors: ["text-sky-400", "text-emerald-400", "text-amber-400"],
  },
  {
    tipo: "Oficinas y coworks",
    desc: "Gestión eléctrica por piso o área arrendada. Facturación individual para cada arrendatario.",
    metricas: ["Medición por arrendatario", "Corte remoto al vencer contrato", "Reportes de consumo individuales"],
    color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/40", gradient: "from-emerald-500/10 to-transparent",
    metricColors: ["text-emerald-400", "text-violet-400", "text-orange-400"],
  },
];

export default function ComerciosPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-semibold">
              <Store className="h-3.5 w-3.5" />
              Solución para Comercios
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Control Eléctrico para <span className="text-gradient-orange">Comercios</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gestiona el consumo eléctrico de todas tus sucursales desde un solo lugar. Alertas en tiempo real, corte remoto y reportes automáticos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                  Solicitar demostración <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Todo bajo control</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Herramientas diseñadas para la gestión eléctrica de comercios</p>
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

      {/* CASOS */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Tipos de comercio</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Soluciones adaptadas a cada tipo de negocio</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {casos.map((c, i) => (
              <motion.div key={c.tipo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${c.border} bg-gradient-to-br ${c.gradient} bg-[#0f0f0f] overflow-hidden p-8`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${c.bg}`} />
                <div className={`w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5`}>
                  <Store className={`h-7 w-7 ${c.color}`} />
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
                <TrendingDown className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Empieza a ahorrar desde hoy</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">La instalación es rápida y no interrumpe tu operación. En menos de una semana tienes visibilidad total de tu consumo eléctrico.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                    Contactar a un especialista <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
