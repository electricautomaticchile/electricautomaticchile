"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Locate } from "lucide-react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";

export default function Component() {
  return (
    <footer className=" flex flex-col  p-6 md:py-12 w-full h-full">
      <div className="container max-w-10xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-25 gap-8">
        <div className="grid flex-col gap-5 items-center">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Zap color="#e66100" className="h-6 w-6" />
            <span className="text-lg font-semibold">
              Electricautomaticchile
            </span>
          </Link>
          <Link href="/terminosycondiciones" className="flex items-center gap-2 px-6" prefetch={false}>
            <span className="text-lg font-semibold">
              Terminos y condiciones
            </span>
          </Link>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Páginas</h3>
          <Link href="/" className="hover:underline" prefetch={false}>
            Inicio
          </Link>
          <Link href="/acercade" className="hover:underline" prefetch={false}>
            Nosotros
          </Link>
          <Link href="/" className="hover:underline" prefetch={false}>
            Servicios
          </Link>
          <Link href="/formulario" className="hover:underline" prefetch={false}>
            Contacto
          </Link>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Contacto</h3>
          <div className="flex items-center gap-2">
            <Phone color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <a href="tel:+56963567384">+56 (9) 6356-7384</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <a href="mailito:Electricautomaticchile@gmail.com">
              Electricautomaticchile@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Locate color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <a href="https://maps.app.goo.gl/NQGvzcTTDYKD8o319">
              Region De Valparaiso,Villa Alemana, 1198 C. Alcalde Rodolfo
              Galleguillos
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Redes Sociales</h3>
          <Link
            href="https://www.linkedin.com/company/electricautomatichile/about/?viewAsMember=true"
            className="hover:text-primary"
            prefetch={false}
          >
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
