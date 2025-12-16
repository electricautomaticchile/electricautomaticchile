"use client";
import Link from "next/link";
import { Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Component() {
  return (
    <footer className="border-t border-border mt-12 dark:bg-black">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo y Términos */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              prefetch={false}
            >
              <Logo
                showText={true}
                className="transition-transform duration-300 group-hover:scale-125"
              />
              <span className="text-lg font-semibold transition-colors hover:text-orange-500"></span>
            </Link>
            <Link
              href="/terminosycondiciones"
              className="flex hover:text-orange-500 transition-colors"
              prefetch={false}
            >
              <span className="text-base font-medium">
                Términos y condiciones
              </span>
            </Link>
          </div>

          {/* Páginas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative w-fit">
              <span>Páginas</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-12 bg-gradient-to-r from-orange-400 to-orange-600"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-orange-500"
                  prefetch={false}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/acercade"
                  className="text-muted-foreground transition-colors hover:text-orange-500"
                  prefetch={false}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/navservices"
                  className="text-muted-foreground transition-colors hover:text-orange-500"
                  prefetch={false}
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/formulario"
                  className="text-muted-foreground transition-colors hover:text-orange-500"
                  prefetch={false}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative w-fit">
              <span>Contacto</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-12 bg-gradient-to-r from-orange-400 to-orange-600"></span>
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:Electricautomaticchile@gmail.com"
                className="flex items-center gap-2 group"
              >
                <Mail
                  color="#e66100"
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-orange-500">
                  Electricautomaticchile@gmail.com
                </span>
              </a>
              <a
                href="https://maps.app.goo.gl/NQGvzcTTDYKD8o319"
                className="flex items-start gap-2 group"
              >
                <MapPin
                  color="#e66100"
                  className="h-5 w-5 mt-1 shrink-0 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-orange-500">
                  Region De Valparaiso, Villa Alemana, 1198 C. Alcalde Rodolfo
                  Galleguillos
                </span>
              </a>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative w-fit">
              <span>Redes Sociales</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-12 bg-gradient-to-r from-orange-400 to-orange-600"></span>
            </h3>
            <Link
              href="https://www.linkedin.com/company/electricautomatichile/about/?viewAsMember=true"
              className="flex items-center gap-2 group"
              prefetch={false}
            >
              <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-blue-600 to-blue-800"></span>
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm backdrop-blur-3xl">
                  <Linkedin className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
              </span>
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-orange-500">
                LinkedIn
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Electricautomaticchile. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
