"use client"
import Link from "next/link"
import { Zap } from "lucide-react"
import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Locate } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';



export default function Component() {
  return (
    <footer className="p-6 md:py-12 w-full h-full">
      <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Zap color="#e66100" className="h-6 w-6" />
            <span className="text-lg font-semibold">Electricautomaticchile</span>
          </Link>
          <p className="text-muted-foreground"></p>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Páginas</h3>
          <Link href="#" className="hover:underline" prefetch={false}>
            Inicio
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Servicios
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Productos
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Contacto
          </Link>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Contacto</h3>
          <div className="flex items-center gap-2">
            <Phone color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <span>+56 (9) 6356-7384</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <span>Electricautomaticchile@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Locate color="#e66100" className="h-5 w-5 text-muted-foreground" />
            <span></span>
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Redes Sociales</h3>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary" prefetch={false}>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

