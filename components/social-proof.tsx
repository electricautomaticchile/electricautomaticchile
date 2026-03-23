"use client";

import { motion } from "framer-motion";
import { Star, Quote, TrendingDown, Clock, Shield, Zap } from "lucide-react";
import Image from "next/image";

interface Testimonio {
  nombre: string;
  cargo: string;
  empresa: string;
  texto: string;
  estrellas: number;
  avatar: string;
  avatarImg?: string;
  color: string;
}

const testimonios: Testimonio[] = [
  {
    nombre: "Carlos Mendoza",
    cargo: "Administrador de Condominio",
    empresa: "Condominio Gran Oceano, Recreo, Vina del Mar",
    texto: "Desde que implementamos Electricautomaticchile, la gestion energetica del condominio cambio completamente. Tenemos visibilidad total del consumo en tiempo real y las alertas nos permiten actuar antes de que los problemas escalen. Una herramienta indispensable para cualquier administrador.",
    estrellas: 5,
    avatar: "CM",
    color: "from-orange-500 to-orange-700",
  },
  {
    nombre: "Cristian Andres Martinez Vergara",
    cargo: "CEO",
    empresa: "Chilquinta Energia S.A.",
    texto: "Gestionar cientos de clientes residenciales y comerciales requiere datos confiables en tiempo real. Electricautomaticchile nos entrega visibilidad completa sobre el consumo de toda la cartera, reduce los tiempos de respuesta ante incidencias y nos permite escalar la operacion sin aumentar el equipo.",
    estrellas: 5,
    avatar: "CM",
    avatarImg: "/Ceo Chilquinta S.A.jpg",
    color: "from-orange-600 to-red-700",
  },
  {
    nombre: "Roberto Fuentes",
    cargo: "Propietario",
    empresa: "Condominio Parque Carolina Rabat, Vitacura",
    texto: "Por fin puedo ver en tiempo real cuanto estoy consumiendo y cuanto me va a costar a fin de mes. Antes esperaba la boleta para darme cuenta que habia gastado de mas -- ahora recibo alertas al instante y puedo tomar decisiones antes de que sea tarde. Lo recomendaria a cualquier propietario.",
    estrellas: 5,
    avatar: "RF",
    color: "from-orange-400 to-orange-600",
  },
];

const metricas = [
  { valor: "200+",  label: "Medidores activos",      icon: Zap,          color: "text-orange-400", bg: "bg-orange-500/10",  border: "border-orange-500/30" },
  { valor: "5+",    label: "Empresas y condominios", icon: Shield,       color: "text-sky-400",    bg: "bg-sky-500/10",     border: "border-sky-500/30" },
  { valor: "99.5%", label: "Precision en lecturas",  icon: TrendingDown, color: "text-emerald-400",bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { valor: "80%",   label: "Menos visitas tecnicas", icon: Clock,        color: "text-amber-400",  bg: "bg-amber-500/10",   border: "border-amber-500/30" },
];

export function SocialProof() {
  return (
    <section className="relative bg-background py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {metricas.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-2xl p-6 text-center card-hover cursor-default border ${m.border}`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${m.bg} border ${m.border} mb-3`}>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div className={`text-3xl font-extrabold ${m.color} mb-1`}>{m.valor}</div>
              <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
            Testimonios reales
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonios.map((t, i) => (
            <motion.div
              key={t.nombre}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative card-hover cursor-default flex flex-col"
            >
              <Quote className="w-8 h-8 text-orange-500/15 absolute top-5 right-5" />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.estrellas }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                &ldquo;{t.texto}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden`}>
                  {t.avatarImg ? (
                    <Image src={t.avatarImg} alt={t.nombre} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    t.avatar
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.nombre}</div>
                  <div className="text-xs text-muted-foreground">{t.cargo}</div>
                  <div className="text-xs text-orange-500 font-medium">{t.empresa}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
