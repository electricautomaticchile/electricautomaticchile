import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, BarChart3, Shield, MapPin, Smartphone, TrendingDown, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Soluciones para Comercios | Electricautomaticchile",
  description:
    "Control eléctrico remoto para comercios y cadenas de tiendas. Monitorea múltiples sucursales, detecta consumos anómalos y reduce tu cuenta de luz.",
};

const beneficios = [
  { icon: MapPin, titulo: "Control multi-sucursal", desc: "Gestiona el consumo eléctrico de todas tus tiendas desde un solo panel. Sin importar cuántas sucursales tengas ni dónde estén." },
  { icon: Smartphone, titulo: "Alertas en tiempo real", desc: "Recibe notificaciones al instante si una sucursal supera su límite de consumo o si hay un equipo encendido fuera de horario." },
  { icon: TrendingDown, titulo: "Reducción de costos", desc: "Identifica equipos que consumen en standby, optimiza horarios de climatización y reduce tu factura eléctrica mensual." },
  { icon: Zap, titulo: "Corte remoto de emergencia", desc: "Ante una emergencia o cierre de local, corta el suministro de forma remota sin necesidad de enviar personal." },
  { icon: BarChart3, titulo: "Comparativa entre sucursales", desc: "Compara el consumo entre locales del mismo tamaño. Detecta cuál está siendo ineficiente y toma acción." },
  { icon: Shield, titulo: "Protección contra robos eléctricos", desc: "Detecta consumos inusuales fuera del horario comercial que podrían indicar accesos no autorizados." },
];

const casos = [
  {
    tipo: "Cadenas de retail",
    desc: "Monitoreo centralizado de decenas de tiendas con reportes consolidados por región o formato.",
    metricas: ["Dashboard unificado multi-tienda", "Alertas por consumo fuera de horario", "Reportes mensuales automáticos"],
  },
  {
    tipo: "Restaurantes y cafeterías",
    desc: "Control de cocinas industriales, cámaras de frío y sistemas de climatización en tiempo real.",
    metricas: ["Protección de equipos de frío", "Optimización de horarios pico", "Reducción 20% en consumo"],
  },
  {
    tipo: "Oficinas y coworks",
    desc: "Gestión eléctrica por piso o área arrendada. Facturación individual para cada arrendatario.",
    metricas: ["Medición por arrendatario", "Corte remoto al vencer contrato", "Reportes de consumo individuales"],
  },
];

export default function ComerciosPage() {
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
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Solución para Comercios</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Control Eléctrico para <span className="text-orange-500">Comercios</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Gestiona el consumo eléctrico de todas tus sucursales desde un solo lugar.
            Alertas en tiempo real, corte remoto y reportes automáticos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Solicitar demostración <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/soluciones" className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-colors">
              Ver todas las soluciones
            </Link>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Todo bajo control</h2>
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
          <h2 className="text-3xl font-bold text-white text-center mb-10">Tipos de comercio</h2>
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
          <h2 className="text-3xl font-bold text-white mb-4">Empieza a ahorrar desde hoy</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            La instalación es rápida y no interrumpe tu operación. En menos de una semana
            tienes visibilidad total de tu consumo eléctrico.
          </p>
          <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-colors">
            Contactar a un especialista <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
