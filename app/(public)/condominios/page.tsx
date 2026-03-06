import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Zap, BarChart3, Shield, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Soluciones para Condominios | Electricautomaticchile",
  description:
    "Gestión eléctrica inteligente para condominios y edificios residenciales. Monitoreo por unidad, corte remoto y reportes automáticos.",
};

const beneficios = [
  { icon: BarChart3, titulo: "Medición individual por unidad", desc: "Cada departamento/casa tiene su propio dispositivo inteligente. Facturación justa y transparente para todos los residentes." },
  { icon: Zap, titulo: "Corte y reposición remota", desc: "El administrador gestiona el suministro de cada unidad desde cualquier lugar, sin visitas técnicas." },
  { icon: BarChart3, titulo: "Reportes automáticos", desc: "Genera informes de consumo mensuales por unidad. Simplifica la rendición ante el comité de administración." },
  { icon: Shield, titulo: "Alertas de consumo anómalo", desc: "Detecta fugas eléctricas o consumos inusuales en tiempo real. Protege la infraestructura del condominio." },
  { icon: Smartphone, titulo: "App para clientes", desc: "Cada cliente ve su consumo, historial y facturas desde la app móvil. Menos consultas al administrador." },
  { icon: Building2, titulo: "Áreas comunes incluidas", desc: "Monitorea el consumo de pasillos, ascensores, piscina y otros espacios comunes por separado." },
];

const pasos = [
  { num: "01", titulo: "Instalación de medidores", desc: "Técnicos certificados instalan los medidores IoT en cada unidad." },
  { num: "02", titulo: "Configuración del sistema", desc: "Activamos la plataforma y capacitamos al administrador." },
  { num: "03", titulo: "Operación continua", desc: "Soporte técnico permanente y actualizaciones automáticas." },
];

export default function CondominiosPage() {
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
            <Building2 className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Solución para Condominios</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gestión Eléctrica <span className="text-orange-500">Inteligente</span><br />para Condominios
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Simplifica la administración del suministro eléctrico. Medición individual,
            corte remoto y reportes automáticos desde una sola plataforma.
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
          <h2 className="text-3xl font-bold text-white text-center mb-10">Todo lo que necesita tu condominio</h2>
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

        {/* Cómo funciona */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pasos.map((p) => (
              <div key={p.num} className="text-center">
                <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {p.num}
                </div>
                <h3 className="font-semibold text-white mb-1">{p.titulo}</h3>
                <p className="text-sm text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border border-white/10 rounded-2xl p-12 bg-white/5">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para modernizar tu condominio?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
          </p>
          <Link href="/formulario" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-colors">
            Contactar a un especialista <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
