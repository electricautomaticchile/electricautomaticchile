import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, BarChart3, Shield, TrendingDown, AlertTriangle, Settings, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Soluciones para Industrias | Electricautomaticchile",
  description:
    "Optimización energética industrial con IoT. Control de demanda máxima, monitoreo por área y reducción de costos eléctricos para plantas industriales.",
};

const beneficios = [
  { icon: BarChart3, titulo: "Monitoreo por área o línea", desc: "Mide el consumo de cada zona de tu planta por separado. Identifica qué proceso consume más y optimiza en tiempo real." },
  { icon: TrendingDown, titulo: "Control de demanda máxima", desc: "Evita multas por exceder la demanda contratada. El sistema alerta antes de llegar al límite y puede actuar automáticamente." },
  { icon: AlertTriangle, titulo: "Alertas de consumo anómalo", desc: "Detecta equipos con fallas eléctricas, fugas de corriente o consumos fuera de rango antes de que se conviertan en problemas mayores." },
  { icon: Zap, titulo: "Corte y reconexión remota", desc: "Gestiona el suministro de cada área o máquina desde la plataforma. Sin necesidad de personal en terreno." },
  { icon: Settings, titulo: "Aplicación para Industrias", desc: "Nuestra aplicación movil con tus sistemas de control industrial existentes mediante API REST o protocolos estándar." },
  { icon: Shield, titulo: "Reportes de eficiencia energética", desc: "Genera informes automáticos para auditorías internas, certificaciones ISO 50001 y reportes de sostenibilidad." },
];

const casos = [
  {
    tipo: "Plantas de manufactura",
    desc: "Monitorea líneas de producción, hornos, compresores y sistemas de climatización por separado.",
    metricas: ["Reducción 25% en costos eléctricos", "Cero multas por demanda", "Mantenimiento predictivo"],
  },
  {
    tipo: "Minería y extracción",
    desc: "Control eléctrico en faenas remotas con conectividad satelital y respaldo de datos local.",
    metricas: ["Operación en zonas sin cobertura", "Alertas críticas 24/7", "Reportes regulatorios automáticos"],
  },
  {
    tipo: "Agroindustria",
    desc: "Gestión eléctrica de sistemas de riego, cámaras frigoríficas y plantas de procesamiento.",
    metricas: ["Protección de cadena de frío", "Optimización de tarifa nocturna", "Control multi-predio"],
  },
];

export default function IndustriasPage() {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <Settings className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Solución Industrial</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Optimización Eléctrica para <span className="text-orange-500">Industrias</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Reduce costos, evita multas por demanda máxima y monitorea cada área de tu planta
            en tiempo real con tecnología IoT industrial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Solicitar diagnóstico gratuito <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/soluciones" className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-colors">
              Ver todas las soluciones
            </Link>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Capacidades para tu planta</h2>
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
          <h2 className="text-3xl font-bold text-white text-center mb-10">Sectores industriales</h2>
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
          <h2 className="text-3xl font-bold text-white mb-4">¿Cuánto estás perdiendo en energía?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Un diagnóstico gratuito puede revelar oportunidades de ahorro que no sabías que existían.
          </p>
          <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-colors">
            Solicitar diagnóstico gratuito <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
