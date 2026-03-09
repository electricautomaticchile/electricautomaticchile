"use client";

import {
  Target, Lightbulb, Users, CheckCircle2, BarChart3,
  Telescope, Zap, Clock, MapPin, ArrowRight, Shield, Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const objectives = [
  { icon: CheckCircle2, title: "Automatización del Servicio",  desc: "Sistema automatizado para reposición del servicio eléctrico, reduciendo significativamente los tiempos de espera.", color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: BarChart3,    title: "Gestión de Consumo",           desc: "Lectura automática del consumo energético y envío instantáneo de reportes a la plataforma.", color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: Users,        title: "Experiencia del Cliente",      desc: "Notificaciones instantáneas y acceso a información en tiempo real para una experiencia superior.", color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
];

const features = [
  "Administración y programación de servicios",
  "Monitoreo en tiempo real del consumo",
  "Gestión automatizada de pagos y reconexiones",
  "Sistema de GPS integrado",
  "Alertas y notificaciones instantáneas",
];

const featureColors = ["text-orange-400", "text-amber-400", "text-sky-400", "text-emerald-400", "text-violet-400"];

const validation = [
  { title: "Pruebas Piloto",       desc: "Validación exhaustiva en diferentes zonas para garantizar eficacia.", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  { title: "Capacitación Integral",desc: "Formación completa para personal técnico y usuarios finales.",        color: "text-sky-400",    border: "border-sky-500/30",    bg: "bg-sky-500/10" },
  { title: "Soporte Continuo",     desc: "Asistencia técnica permanente y actualizaciones del sistema.",        color: "text-emerald-400",border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
];

const stats = [
  { value: "99.8%", label: "Cobertura nacional", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { value: "16",    label: "Regiones",            color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/30" },
  { value: "24/7",  label: "Soporte técnico",     color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
];

const cities = ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco"];

const techItems = [
  { icon: Zap,    label: "Personal Técnico",  items: ["Funcionamiento técnico del dispositivo IoT", "Uso de plataforma web de administración", "Programación de cortes y reconexiones", "Protocolos de seguridad y GPS"], color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: Users,  label: "Usuarios Finales",  items: ["Acceso a plataforma web de consulta", "Interpretación de datos de consumo", "Gestión de notificaciones y alertas", "Proceso de pago y reconexión"],          color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
];

export default function AcercaDePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Acerca de <span className="text-gradient-orange">Electricautomaticchile</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pioneros en automatización del suministro eléctrico en Chile, implementando tecnología IoT que garantiza respuestas inmediatas y gestión inteligente del suministro energético.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/formulario">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                  Contactar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                  Ver Soluciones
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTEXTO */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Contexto y Problemática</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Entendiendo la situación actual del suministro eléctrico en Chile</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Antes */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl border border-red-500/30 bg-[#0a0a0a] overflow-hidden p-8">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/50" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-bold text-red-400">Antes</h3>
              </div>
              <ul className="space-y-3">
                {["Demoras de 24-48 horas en reposición", "Gestión logística ineficiente", "Sin automatización en reconexiones", "Sin monitoreo en tiempo real"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Después */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl border border-emerald-500/30 bg-[#0a0a0a] overflow-hidden p-8">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-emerald-400">Con ElectricAutomaticChile</h3>
              </div>
              <ul className="space-y-3">
                {["Reposición automática en minutos", "Reconexión sin personal en terreno", "Lectura automática en tiempo real", "Facturación instantánea con GPS"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Grupo objetivo */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl border border-orange-500/30 bg-[#0a0a0a] overflow-hidden p-8">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="font-bold text-orange-400">Grupo Objetivo</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Dirigido a <span className="font-bold text-foreground">hogares y empresas en Chile</span> que buscan gestión eficiente y automatizada del suministro eléctrico. Con 99.8% de cobertura nacional, el alcance es significativo en todo el territorio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target,    title: "Objetivo General",   color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30", desc: "Solucionar la problemática de la reposición del suministro eléctrico, eliminando las demoras excesivas causadas por la logística y gestión del personal. Nuestro sistema automatizado permite la reposición inmediata del servicio cuando se regulariza el pago." },
              { icon: Lightbulb, title: "Visión Innovadora",  color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30",  desc: "Ser líderes en la transformación digital del sector eléctrico chileno, implementando soluciones que combinen automatización, IoT y análisis de datos para un servicio eficiente, transparente y sin interrupciones." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${item.border} bg-[#0f0f0f] overflow-hidden p-8`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${item.bg}`} />
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${item.color}`}>{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJETIVOS */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Objetivos Específicos</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Metas concretas que guían nuestro trabajo diario</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {objectives.map((obj, i) => (
              <motion.div key={obj.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl border ${obj.border} bg-[#0a0a0a] p-6 overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${obj.bg}`} />
                <div className={`w-11 h-11 rounded-xl ${obj.bg} border ${obj.border} flex items-center justify-center mb-4`}>
                  <obj.icon className={`h-5 w-5 ${obj.color}`} />
                </div>
                <h3 className="font-bold mb-2">{obj.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Nuestra Metodología</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Enfoque estructurado y tecnología de vanguardia</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Implementación */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl border border-orange-500/30 bg-[#0f0f0f] overflow-hidden p-8">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-orange-400">Implementación Innovadora</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Sistema basado en dispositivo inteligente dentro del medidor, conectado a plataforma web avanzada. Metodologías <span className="font-semibold text-foreground">Lean Startup</span> y <span className="font-semibold text-foreground">Diseño Centrado en el Usuario</span>.
              </p>
              <div className="space-y-2.5">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${featureColors[i]} shrink-0`} style={{ background: "currentColor" }} />
                    <span className={`text-sm ${featureColors[i]}`}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Validación */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative rounded-2xl border border-sky-500/30 bg-[#0f0f0f] overflow-hidden p-8">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-400" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
                  <Telescope className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-sky-400">Validación y Mejora Continua</h3>
              </div>
              <div className="space-y-4">
                {validation.map((v, i) => (
                  <div key={i} className={`rounded-xl border ${v.border} ${v.bg} p-4`}>
                    <h4 className={`font-bold text-sm mb-1 ${v.color}`}>{v.title}</h4>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROGRAMA DE FORMACIÓN */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Programa de Formación</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Capacitación integral para garantizar el éxito de la implementación</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {techItems.map((t, i) => (
              <motion.div key={t.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${t.border} bg-[#0a0a0a] overflow-hidden p-8`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${t.bg}`} />
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl ${t.bg} border ${t.border} flex items-center justify-center`}>
                    <t.icon className={`h-5 w-5 ${t.color}`} />
                  </div>
                  <h3 className={`font-bold ${t.color}`}>{t.label}</h3>
                </div>
                <div className="space-y-3">
                  {t.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${t.color}`} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Cobertura Nacional</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Presencia a lo largo de Chile garantizando un servicio confiable en todo el territorio</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-5 mb-10">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl border ${s.border} ${s.bg} p-6 text-center overflow-hidden`}>
                <div className={`text-4xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl border border-orange-500/20 bg-[#0f0f0f] overflow-hidden p-8 text-center">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
            <div className="flex items-center justify-center gap-2 mb-5">
              <MapPin className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">Principales ciudades</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {cities.map((city, i) => (
                <span key={city} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                  i % 3 === 0 ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                  i % 3 === 1 ? "bg-sky-500/10 border-sky-500/30 text-sky-400" :
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}>{city}</span>
              ))}
            </div>
          </motion.div>
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
                <Shield className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">¿Quieres saber más?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Contáctanos y descubre cómo podemos transformar la gestión eléctrica de tu empresa</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/formulario">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 gap-2 group">
                    Contactar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/soluciones">
                  <Button size="lg" variant="outline" className="border-border hover:border-orange-500/40 hover:bg-orange-500/5">
                    Ver Soluciones
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
