"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Gauge, Lightbulb, Thermometer, Zap, WrenchIcon, BarChart } from "lucide-react";
import Electric from "@/public/Designer.jpeg";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";

function ServiceCard({ 
  icon, 
  title, 
  description, 
  link 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  link: string;
}) {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 border border-border">
      <CardContent className="p-6 flex gap-4 h-full">
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-500">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={link} className="text-sm text-orange-500 hover:underline inline-flex items-center gap-1 transition-all duration-200 hover:gap-2">
          Ver detalles <span className="text-xs">→</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function Component() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);
  
  const services = [
    {
      icon: <Gauge color="#e66100" className="w-6 h-6" />,
      title: "Control de Consumo",
      description: "Monitoreo en tiempo real del consumo eléctrico para optimizar costos y mejorar la eficiencia energética.",
      link: "/servicios/consumo"
    },
    {
      icon: <Zap color="#e66100" className="w-6 h-6" />,
      title: "Reposición Automatizada",
      description: "Sistema inteligente para reposición automática del servicio eléctrico tras la regularización del pago.",
      link: "/servicios/reposicion"
    },
    {
      icon: <WrenchIcon color="#e66100" className="w-6 h-6" />,
      title: "Integración de Hardware",
      description: "Dispositivos inteligentes para la medición y gestión eficiente de la energía eléctrica.",
      link: "/servicios/hardware"
    },
    {
      icon: <BarChart color="#e66100" className="w-6 h-6" />,
      title: "Alertas y Notificaciones",
      description: "Recibe alertas en tiempo real sobre anomalías en el consumo y eventos importantes.",
      link: "/servicios/alertas"
    },
  ];
  
  return (
    <section className={`w-full py-12 md:py-24 lg:py-32 transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-orange-500/10 rounded-full">
            <span className="text-orange-500 font-medium text-sm">Nuestros servicios</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Soluciones Inteligentes de <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Electricidad</span>
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ofrecemos tecnología avanzada para el monitoreo, control y automatización 
              de sistemas eléctricos, mejorando la eficiencia y reduciendo costos.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 opacity-50 blur-sm"></div>
            <Image
              src={Electric}
              width="550"
              height="310"
              alt="Automatización Eléctrica"
              className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center shadow-xl sm:w-full lg:order-last transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold">¿Por qué elegir nuestros servicios?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-500">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Tecnología de vanguardia</h3>
                  <p className="text-sm text-muted-foreground">Utilizamos las últimas tecnologías para ofrecer soluciones innovadoras y eficientes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-500">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Soporte continuo</h3>
                  <p className="text-sm text-muted-foreground">Brindamos asistencia técnica permanente para garantizar el funcionamiento óptimo de tu sistema.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-500">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Personalización total</h3>
                  <p className="text-sm text-muted-foreground">Adaptamos nuestras soluciones a las necesidades específicas de tu hogar o empresa.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/formulario">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30">
              Solicitar Información
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
