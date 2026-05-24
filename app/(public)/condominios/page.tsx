"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Zap, BarChart3, Shield, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

const beneficios = [
  { icon: BarChart3,  titulo: "Medición individual por unidad", desc: "Cada departamento tiene su propio dispositivo. Facturación justa y transparente para todos los residentes.",  color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  { icon: Zap,        titulo: "Corte y reposición remota",      desc: "El administrador gestiona el suministro de cada unidad desde cualquier lugar, sin visitas técnicas.",           color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30" },
  { icon: BarChart3,  titulo: "Reportes automáticos",           desc: "Informes de consumo mensuales por unidad. Simplifica la rendición ante el comité de administración.",            color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/30" },
  { icon: Shield,     titulo: "Alertas de consumo anómalo",     desc: "Detecta fugas eléctricas o consumos inusuales en tiempo real. Protege la infraestructura del condominio.",       color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/30" },
  { icon: Smartphone, titulo: "App para residentes",            desc: "Cada residente ve su consumo, historial y facturas desde la app móvil. Menos consultas al administrador.",       color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/30" },
  { icon: Building2,  titulo: "Áreas comunes incluidas",        desc: "Monitorea el consumo de pasillos, ascensores, piscina y otros espacios comunes por separado.",                   color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
];

const pasos = [
  { num: "01", titulo: "Instalación de medidores",  desc: "Técnicos certificados instalan los medidores IoT en cada unidad.",              color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/40" },
  { num: "02", titulo: "Configuración del sistema", desc: "Activamos la plataforma y capacitamos al administrador.",                        color: "text-sky-400",    bg: "bg-sky-500/15",    border: "border-sky-500/40" },
  { num: "03", titulo: "Operación continua",        desc: "Soporte técnico permanente y actualizaciones automáticas del sistema.",          color: "text-emerald-400",bg: "bg-emerald-500/15",border: "border-emerald-500/40" },
];

export default function CondominiosPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-400 text-xs font-semibold">
              <Building2 className="h-3.5 w-3.5" />
              Solución para Condominios
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Gestión Eléctrica <span className="text-gradient-orange">Inteligente</span>
              <br />para Condominios
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simplifica la administración del suministro eléctrico. Medición individual, corte remoto y reportes automáticos desde una sola plataforma.
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

      {/* VISUAL */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0a0a0a]"
          >
            <Image
              src="/images/hero/hero-comercial-wall.png"
              alt="Medidor inteligente con paneles de consumo y ubicación para condominios"
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Todo lo que necesita tu condominio</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Gestión eléctrica completa para administradores y residentes</p>
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

      {/* CÓMO FUNCIONA */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Cómo funciona</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Proceso simple y sin interrupciones para tu condominio</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pasos.map((p, i) => (
              <motion.div key={p.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl border ${p.border} bg-[#0f0f0f] p-6 text-center overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${p.bg}`} />
                <div className={`w-14 h-14 ${p.bg} border ${p.border} ${p.color} rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4`}>
                  {p.num}
                </div>
                <h3 className="font-bold mb-2">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
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
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-7 w-7 text-sky-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">¿Listo para modernizar tu condominio?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Contáctanos y te mostramos cómo simplificar la administración eléctrica de tu edificio.</p>
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
