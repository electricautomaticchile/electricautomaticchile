import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, BarChart3, Shield, Cpu, Users, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Soluciones para Empresas de Electricidad | Electricautomaticchile",
  description:
    "Plataforma IoT para empresas distribuidoras y contratistas eléctricos. Gestión masiva de medidores, telemetría en tiempo real y automatización de cortes.",
};

const beneficios = [
  { icon: Cpu, titulo: "Gestión masiva de medidores", desc: "Administra miles de medidores inteligentes desde un solo panel. Escalable desde 1 hasta 10.000+ puntos de medición." },
  { icon: Zap, titulo: "Telemetría en tiempo real", desc: "Datos de consumo, voltaje, corriente y factor de potencia actualizados en tiempo real vía GPRS/4G." },
  { icon: BarChart3, titulo: "API de integración", desc: "Integra nuestra plataforma con tus sistemas ERP, CRM o de facturación mediante nuestra API REST." },
  { icon: Shield, titulo: "Detección de fraude eléctrico", desc: "Algoritmos de detección de anomalías que identifican conexiones ilegales y manipulación de medidores." },
  { icon: Users, titulo: "Multi-empresa y multi-zona", desc: "Gestiona múltiples zonas geográficas o empresas subsidiarias con permisos granulares." },
  { icon: FileText, titulo: "Reportería regulatoria", desc: "Genera automáticamente los reportes exigidos por la SEC y otras entidades regulatorias." },
];

const casos = [
  {
    tipo: "Distribuidoras eléctricas",
    desc: "Automatiza la lectura de medidores, reduce costos operativos y mejora la precisión de la facturación.",
    metricas: ["Reducción 80% en visitas técnicas", "99.5% precisión en lecturas", "Facturación automática"],
  },
  {
    tipo: "Contratistas eléctricos",
    desc: "Ofrece a tus clientes un servicio de valor agregado con monitoreo continuo post-instalación.",
    metricas: ["Nuevas fuentes de ingreso recurrente", "Diferenciación competitiva", "Soporte remoto 24/7"],
  },
  {
    tipo: "Empresas industriales",
    desc: "Controla el consumo de múltiples plantas o instalaciones con alertas de demanda máxima.",
    metricas: ["Optimización de tarifa eléctrica", "Reducción de multas por demanda", "Reportes de eficiencia"],
  },
];

export default function EmpresasElectricidadPage() {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Solución para Empresas Eléctricas</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Plataforma IoT para el <span className="text-orange-500">Sector Eléctrico</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Tecnología de medición inteligente y gestión remota para distribuidoras,
            contratistas y empresas industriales. Escala tu operación sin escalar tus costos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Solicitar demo técnica <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/soluciones" className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-colors">
              Ver soluciones
            </Link>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Capacidades de la plataforma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficios.map((b) => (
              <div key={b.titulo} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <b.icon className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white text-base mb-2">{b.titulo}</h3>
                <p className="text-white/50 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Casos de uso */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Casos de uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {casos.map((c) => (
              <div key={c.tipo} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <h3 className="font-bold text-orange-400 text-lg mb-2">{c.tipo}</h3>
                <p className="text-white/60 text-sm mb-4">{c.desc}</p>
                <ul className="space-y-2">
                  {c.metricas.map((m) => (
                    <li key={m} className="text-sm flex items-center gap-2 text-white/70">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border border-white/10 rounded-2xl p-12 bg-white/5">
          <h2 className="text-3xl font-bold text-white mb-4">Hablemos de tu proyecto</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Cada empresa tiene necesidades distintas. Nuestro equipo técnico puede diseñar una solución a medida.
          </p>
          <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-colors">
            Contactar equipo técnico <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
