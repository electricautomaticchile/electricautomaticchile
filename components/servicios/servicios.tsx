"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Gauge } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Thermometer } from "lucide-react";
import Electric from "@/public/Designer.jpeg";
import Link from "next/link";

export default function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Servicios de Automatización Eléctrica
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Optimiza tu hogar o negocio con nuestros servicios de
              automatización eléctrica. Disfruta de un mayor control, eficiencia
              energética y comodidad.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex gap-4">
                <Lightbulb color="#e66100" className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Control de Consumo</h3>
                  <p className="text-muted-foreground">
                    Optimiza y reduce tu consumo energético con nuestras
                    soluciones inteligentes.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Thermometer color="#e66100" className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">
                    Programación de reposicion de suministro electrico
                  </h3>
                  <p className="text-muted-foreground">
                    Programa y automatiza la reposicion de tu suministro
                    eléctrico para mayor eficiencia.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Gauge color="#e66100" className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Monitoreo de Consumo</h3>
                  <p className="text-muted-foreground">
                    Genera cambios de comportamiento a partir de la información
                    recopilada.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Calendar color="#e66100" className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Generar alertas</h3>
                  <p className="text-muted-foreground">
                    Toma acciones oportunas ante cualquier eventualidad.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <Image
            src={Electric}
            width="550"
            height="310"
            alt="Automatización Eléctrica"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
        <div className="flex justify-center">
          <Link href="/formulario">
            <Button size="lg">Solicitar Información</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
