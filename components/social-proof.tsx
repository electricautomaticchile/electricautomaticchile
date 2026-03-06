import React from "react";
import { Star, Quote } from "lucide-react";

const testimonios = [
  {
    nombre: "Carlos Mendoza",
    cargo: "Administrador de Condominio",
    empresa: "Condominio Los Aromos, Santiago",
    texto:
      "Antes tardábamos 3 días en leer todos los medidores. Ahora los datos llegan solos y la facturación es automática. Le ahorramos al condominio más de $200.000 mensuales en gestión.",
    estrellas: 5,
  },
  {
    nombre: "Patricia Rojas",
    cargo: "Gerente de Operaciones",
    empresa: "Empresa distribuidora, Región Metropolitana",
    texto:
      "La detección de anomalías nos ayudó a identificar 12 conexiones ilegales en el primer mes. El sistema se pagó solo en menos de 60 días.",
    estrellas: 5,
  },
  {
    nombre: "Roberto Fuentes",
    cargo: "Propietario",
    empresa: "Edificio comercial, Providencia",
    texto:
      "Tengo 8 locales comerciales y ahora puedo ver el consumo de cada uno desde el celular. Si alguno se pasa del límite, me llega una alerta al instante.",
    estrellas: 5,
  },
];

const metricas = [
  { valor: "200+", label: "Medidores activos" },
  { valor: "5+", label: "Condominios y empresas" },
  { valor: "99.5%", label: "Precisión en lecturas" },
  { valor: "80%", label: "Reducción en visitas técnicas" },
];

export function SocialProof() {
  return (
    <section className="relative bg-black py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {metricas.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">{m.valor}</div>
              <div className="text-sm text-white/50">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Lo que dicen nuestros clientes
        </h2>

        {/* Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonios.map((t) => (
            <div
              key={t.nombre}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 relative hover:border-orange-500/30 transition-colors"
            >
              <Quote className="w-8 h-8 text-orange-500/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-white text-sm">{t.nombre}</div>
                <div className="text-xs text-white/40">{t.cargo}</div>
                <div className="text-xs text-orange-400">{t.empresa}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
