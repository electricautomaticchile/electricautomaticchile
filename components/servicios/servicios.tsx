"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"


export default function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Servicios de Automatización Eléctrica</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Optimiza tu hogar o negocio con nuestros servicios de automatización eléctrica. Disfruta de un mayor
              control, eficiencia energética y comodidad.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex gap-4">
                <LightbulbIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Control de Consumo</h3>
                  <p className="text-muted-foreground">Optimiza y reduce tu consumo energético con nuestras soluciones inteligentes.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ThermometerIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Programación de Tareas</h3>
                  <p className="text-muted-foreground">Programa y automatiza tus procesos eléctricos para mayor eficiencia.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <GaugeIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Monitoreo de Consumo</h3>
                  <p className="text-muted-foreground">
                    Supervisa y optimiza el consumo energético de tus dispositivos.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <CalendarIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Programación de Dispositivos</h3>
                  <p className="text-muted-foreground">Programa y automatiza el funcionamiento de tus dispositivos.</p>
                </div>
              </li>
            </ul>
          </div>
          <Image
            src="/placeholder.svg"
            width="550"
            height="310"
            alt="Automatización Eléctrica"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
        <div className="flex justify-center">
          <Button size="lg">Solicitar Información</Button>
        </div>
      </div>
    </section>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function GaugeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}


function LightbulbIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}


function ThermometerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  )
}