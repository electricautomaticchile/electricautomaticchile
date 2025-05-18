import { Target, Lightbulb, Users, Map, CheckCircle, BarChart, Telescope, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';
import cobertura from "@/public/corbetura.jpg"

export default function AcercaDePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full mx-auto text-center">
            <span className="text-orange-500 font-medium text-sm">Conoce nuestra empresa</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Transformando el Control
            <span className="text-orange-500"> Eléctrico en Chile</span>
          </h1>
          
          <p className="text-center max-w-3xl mx-auto text-lg mb-8 text-muted-foreground leading-relaxed">
            Somos pioneros en la automatización y gestión eficiente del suministro eléctrico, 
            trabajando para revolucionar la forma en que se maneja la energía en todo el país.
          </p>
        </div>
      </section>
  
      {/* Mission & Vision */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border border-orange-500/10 transition-all duration-300 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Target className="text-orange-500 h-6 w-6" />
                </div>
                Objetivo General
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Solucionar la problemática de la reposición del suministro eléctrico, reduciendo 
                significativamente los tiempos de espera y mejorando la gestión del servicio cuando 
                se regulariza el pago de la deuda. Nuestro sistema automatizado garantiza una 
                respuesta eficiente y oportuna.
              </p>
            </CardContent>
          </Card>
  
          <Card className="overflow-hidden border border-orange-500/10 transition-all duration-300 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Lightbulb className="text-orange-500 h-6 w-6" />
                </div>
                Visión Innovadora
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Buscamos revolucionar la gestión del suministro eléctrico en Chile mediante 
                tecnología de punta, automatización inteligente y un compromiso inquebrantable 
                con la satisfacción del cliente.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
  
      {/* Objectives */}
      <section className="py-16 bg-gradient-to-b from-background via-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">Lo que nos proponemos</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Objetivos Específicos</h2>
            <p className="text-muted-foreground">
              Metas concretas que guían nuestro trabajo diario hacia la excelencia en servicios eléctricos
            </p>
          </div>
          
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
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
            <span className="text-orange-500 font-medium text-sm">Cómo lo hacemos</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Nuestra Metodología</h2>
          <p className="text-muted-foreground">
            Enfoque estructurado y tecnología de vanguardia para garantizar resultados excepcionales
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6 bg-background/50 p-8 rounded-lg border border-orange-500/10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 rounded-full bg-orange-500/10 inline-flex">
                <Zap className="text-orange-500 h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Implementación Innovadora
              </span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
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
                <li key={index} className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 group-hover:scale-150 transition-transform duration-300" />
                  <span className="text-muted-foreground group-hover:text-orange-500 transition-colors duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 bg-background/50 p-8 rounded-lg border border-orange-500/10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 rounded-full bg-orange-500/10 inline-flex">
                <Telescope className="text-orange-500 h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Validación y Mejora Continua
              </span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
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
                <div key={index} className="border border-orange-500/10 rounded-lg p-6 transition-all duration-300 hover:translate-y-[-2px] hover:border-orange-500/20 bg-background">
                  <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  
      {/* Coverage */}
      <section className="py-16 bg-gradient-to-b from-background via-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">Dónde operamos</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Cobertura Nacional</h2>
            <p className="text-muted-foreground">
              Nuestra presencia a lo largo de Chile garantiza un servicio confiable en todo el territorio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Presencia en Todo Chile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nuestra solución está diseñada para adaptarse a diferentes zonas y necesidades 
                específicas en todo el territorio nacional. Con una cobertura del 99.8% de los 
                hogares con suministro eléctrico, estamos preparados para implementar nuestra 
                tecnología donde sea necesario.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">99.8%</div>
                  <div className="text-sm text-muted-foreground">Cobertura nacional</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">16</div>
                  <div className="text-sm text-muted-foreground">Regiones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">24/7</div>
                  <div className="text-sm text-muted-foreground">Soporte técnico</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-0.5 rounded-lg bg-orange-500/20 opacity-50 blur-sm"></div>
                <Image
                  src={cobertura.src}
                  alt="Imagen de cobertura nacional"
                  className="relative rounded-lg w-full transform transition-transform duration-700 hover:scale-[1.02]"
                  width={500}
                  height={300}
                />
              </div>
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
    <Card className="group overflow-hidden transition-all duration-300 hover:translate-y-[-2px] border border-border/50 h-full bg-background">
      <CardContent className="p-6 space-y-4">
        <div className="mb-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
