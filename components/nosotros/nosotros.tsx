"use client";
import { Target } from "lucide-react";
import { Telescope } from "lucide-react";

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 md:py-16 lg:py-20">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Electricautomaticchile
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Empresa líder en soluciones tecnológicas para la gestión del
          suministro eléctrico en América Latina, reconocida por su innovación,
          eficiencia y compromiso con la sostenibilidad.
        </p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Target className="h-12 w-12 text-primary" />
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold">Nuestra Misión</h3>
            <p className="text-muted-foreground">
              Desarrollar y ofrecer soluciones tecnológicas innovadoras que
              optimicen la gestión del suministro eléctrico, contribuyendo a la
              eficiencia energética, la reducción de costos y la sostenibilidad
              ambiental, para el beneficio de nuestros clientes y la comunidad.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Telescope className="h-12 w-12 text-primary" />
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold">Nuestra Visión</h3>
            <p className="text-muted-foreground">
              Nuestra visión es convertirnos en la empresa de referencia en
              nuestro mercado, a través de la innovación constante y el
              compromiso con la excelencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
