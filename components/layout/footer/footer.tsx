"use client";
import Link from "next/link";
import { Linkedin, MapPin, Mail, Zap } from "lucide-react";
import { Logo } from "@/components/logo";

const pages = [
  { href: "/", label: "Inicio" },
  { href: "/acerca-de", label: "Nosotros" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/formulario", label: "Contacto" },
  { href: "/blog", label: "Blog" },
];

const solutions = [
  { href: "/empresas-electricidad", label: "Compañías Eléctricas" },
  { href: "/condominios", label: "Condominios" },
  { href: "/industrias", label: "Industrias" },
  { href: "/comercios", label: "Comercios" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-orange-500/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto py-16 px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo showText={true} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Automatización inteligente del suministro eléctrico para Chile. Control total, en tiempo real.
            </p>

            <div className="flex gap-3 pt-1">
              <Link
                href="/terminos-condiciones"
                className="text-xs text-muted-foreground hover:text-orange-500 transition-colors"
              >
                Términos y condiciones
              </Link>
              <span className="text-muted-foreground/30">·</span>
              <Link
                href="/privacidad"
                className="text-xs text-muted-foreground hover:text-orange-500 transition-colors"
              >
                Privacidad
              </Link>
            </div>
          </div>

          {/* Páginas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500" />
              Páginas
            </h3>
            <ul className="space-y-2.5">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500" />
              Soluciones
            </h3>
            <ul className="space-y-2.5">
              {solutions.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500" />
              Contacto
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:Electricautomaticchile@gmail.com"
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/40 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-orange-500 transition-colors pt-1">
                  Electricautomaticchile@gmail.com
                </span>
              </a>
              <a
                href="https://maps.app.goo.gl/NQGvzcTTDYKD8o319"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-emerald-400 transition-colors">
                  Región de Valparaíso, Villa Alemana
                </span>
              </a>
              <Link
                href="https://www.linkedin.com/company/electricautomatichile/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                  <Linkedin className="h-4 w-4 text-sky-400" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-sky-400 transition-colors">
                  LinkedIn
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Electricautomaticchile. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            Hecho en Chile con tecnología IoT
          </div>
        </div>
      </div>
    </footer>
  );
}

