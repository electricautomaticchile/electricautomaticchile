import { Target, Lightbulb, Users, Map, CheckCircle, BarChart, Telescope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';
import cobertura from "@/public/corbetura.jpg"

export default function AcercaDePage() {
  return (
      <div className="">
        {/* Hero Section */}
        <section className="relative  py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
              Transformando el Control
              <span className="text-orange-500"> Eléctrico en Chile</span>
            </h1>
            <p className=" text-center max-w-3xl mx-auto text-lg mb-8">
              Somos pioneros en la automatización y gestión eficiente del suministro eléctrico, 
              trabajando para revolucionar la forma en que se maneja la energía en todo el país.
            </p>
          </div>
        </section>
    
        {/* Mission & Vision */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-orange-500 h-6 w-6" />
                  Objetivo General
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <p>
                  Solucionar la problemática de la reposición del suministro eléctrico, reduciendo 
                  significativamente los tiempos de espera y mejorando la gestión del servicio cuando 
                  se regulariza el pago de la deuda. Nuestro sistema automatizado garantiza una 
                  respuesta eficiente y oportuna.
                </p>
              </CardContent>
            </Card>
    
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-orange-500 h-6 w-6" />
                  Visión Innovadora
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <p>
                  Buscamos revolucionar la gestión del suministro eléctrico en Chile mediante 
                  tecnología de punta, automatización inteligente y un compromiso inquebrantable 
                  con la satisfacción del cliente.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
    
        {/* Objectives */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Objetivos Específicos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ObjectiveCard
                icon={<CheckCircle className="h-8 w-8 text-orange-500" />}
                title="Automatización del Servicio"
                description="Implementar un sistema automatizado para la reposición del servicio eléctrico, reduciendo significativamente los tiempos de espera."
              />
              <ObjectiveCard
                icon={<BarChart className="h-8 w-8 text-orange-500" />}
                title="Gestión de Consumo"
                description="Desarrollar funcionalidades de lectura automática del consumo energético y envío instantáneo de reportes a la plataforma."
              />
              <ObjectiveCard
                icon={<Users className="h-8 w-8 text-orange-500" />}
                title="Experiencia del Cliente"
                description="Mejorar la experiencia del usuario mediante notificaciones instantáneas y acceso a información en tiempo real."
              />
            </div>
          </div>
        </section>
    
        {/* Methodology */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestra Metodología</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-orange-500">Implementación Innovadora</h3>
              <p className="">
                Nuestro sistema se basa en la instalación de un dispositivo inteligente dentro del 
                medidor de luz, conectado a una plataforma web avanzada que permite:
              </p>
              <ul className="space-y-4">
                {[
                  "Administración y programación de servicios",
                  "Monitoreo en tiempo real del consumo",
                  "Gestión automatizada de pagos y reconexiones",
                  "Sistema de GPS integrado",
                  "Alertas y notificaciones instantáneas"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 ">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-orange-500">Validación y Mejora Continua</h3>
              <p className="">
                Nuestro proceso de implementación incluye:
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Pruebas Piloto",
                    description: "Realizamos pruebas exhaustivas en diferentes zonas para garantizar la eficacia del sistema."
                  },
                  {
                    title: "Capacitación Integral",
                    description: "Proporcionamos formación completa para el personal técnico y usuarios finales."
                  },
                  {
                    title: "Soporte Continuo",
                    description: "Ofrecemos asistencia técnica permanente y actualizaciones del sistema."
                  }
                ].map((item, index) => (
                  <div key={index} className="border  rounded-lg p-4">
                    <h4 className="font-bold mb-2">{item.title}</h4>
                    <p className="">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    
        {/* Coverage */}
        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Cobertura Nacional</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Presencia en Todo Chile</h3>
                <p className="">
                  Nuestra solución está diseñada para adaptarse a diferentes zonas y necesidades 
                  específicas en todo el territorio nacional. Con una cobertura del 99.8% de los 
                  hogares con suministro eléctrico, estamos preparados para implementar nuestra 
                  tecnología donde sea necesario.
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src={cobertura.src}
                  alt="Imagen de cobertura nacional"
                  className="w-full rounded-lg"
                  width={500}
                  height={300}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    
  );
}

function ObjectiveCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <Card className="">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          {icon}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="">{description}</p>
      </CardContent>
    </Card>
  );
}
