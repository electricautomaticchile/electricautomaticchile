import {
  Target,
  Lightbulb,
  Users,
  CheckCircle,
  BarChart,
  Telescope,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcercaDePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full mx-auto text-center">
            <span className="text-orange-500 font-medium text-sm">
              Conoce nuestra empresa
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Transformando el Control
            <span className="text-orange-500"> Eléctrico en Chile</span>
          </h1>

          <p className="text-center max-w-3xl mx-auto text-lg mb-8 text-muted-foreground leading-relaxed">
            Somos pioneros en la automatización y gestión eficiente del
            suministro eléctrico. Nuestra misión es solucionar la problemática
            de los tiempos prolongados en la reposición del servicio,
            implementando tecnología IoT de vanguardia que garantiza respuestas
            inmediatas y gestión inteligente del suministro energético en todo
            Chile.
          </p>
        </div>
      </section>

      {/* Context & Problem */}
      <section className="py-16 bg-gradient-to-b from-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">
                El desafío que enfrentamos
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Contexto y Problemática</h2>
            <p className="text-muted-foreground">
              Entendiendo la situación actual del suministro eléctrico en Chile
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-orange-500/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-orange-500">
                  Situación Actual
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Según datos del Ministerio de Energía de Chile, el{" "}
                  <span className="font-bold text-foreground">99.8%</span> de
                  los hogares del país cuentan con suministro eléctrico. Sin
                  embargo, la calidad del servicio presenta desafíos
                  significativos:
                </p>
                <ul className="space-y-3">
                  {[
                    "Demoras excesivas en la reposición del servicio tras regularizar pagos",
                    "Gestión logística ineficiente que genera tiempos de espera prolongados",
                    "Falta de automatización en procesos críticos de reconexión",
                    "Ausencia de monitoreo en tiempo real del consumo energético",
                    "Procesos de facturación con tiempos de gestión innecesarios",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-orange-500">
                  La Brecha que Abordamos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600">
                      Estado Actual
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Reposición manual del servicio</li>
                      <li>• Tiempos de espera de días o semanas</li>
                      <li>• Lectura manual de medidores</li>
                      <li>• Facturación con demoras</li>
                      <li>• Sin trazabilidad de dispositivos</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">
                      Estado Objetivo
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Reposición automática inmediata</li>
                      <li>• Reconexión en minutos</li>
                      <li>• Lectura automática en tiempo real</li>
                      <li>• Facturación instantánea</li>
                      <li>• GPS integrado para seguridad</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-orange-500">
                  Grupo Objetivo
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestra solución está dirigida a{" "}
                  <span className="font-bold text-foreground">
                    hogares y empresas en Chile
                  </span>{" "}
                  que experimentan demoras en la reposición del servicio
                  eléctrico y buscan una gestión más eficiente y automatizada.
                  Con el 99.8% de los hogares chilenos con acceso a
                  electricidad, el alcance potencial de nuestra tecnología es
                  significativo, especialmente en zonas donde la calidad del
                  servicio presenta mayores desafíos.
                </p>
              </CardContent>
            </Card>
          </div>
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
                Solucionar la problemática de la reposición del suministro
                eléctrico, eliminando las demoras excesivas causadas por la
                logística y gestión del personal. Nuestro sistema automatizado
                permite la reposición inmediata del servicio cuando se
                regulariza el pago, reconociendo que el suministro eléctrico es
                una prioridad fundamental en la vida moderna.
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
                Ser líderes en la transformación digital del sector eléctrico
                chileno, implementando soluciones innovadoras que combinen
                automatización, IoT y análisis de datos. Aspiramos a un futuro
                donde cada hogar y empresa tenga acceso a un servicio eléctrico
                eficiente, transparente y sin interrupciones innecesarias.
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
              <span className="text-orange-500 font-medium text-sm">
                Lo que nos proponemos
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Objetivos Específicos</h2>
            <p className="text-muted-foreground">
              Metas concretas que guían nuestro trabajo diario hacia la
              excelencia en servicios eléctricos
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
            <span className="text-orange-500 font-medium text-sm">
              Cómo lo hacemos
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Nuestra Metodología</h2>
          <p className="text-muted-foreground">
            Enfoque estructurado y tecnología de vanguardia para garantizar
            resultados excepcionales
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nuestro sistema se basa en la instalación de un dispositivo
              inteligente dentro del medidor de luz, conectado a una plataforma
              web avanzada. Utilizamos metodologías ágiles como{" "}
              <span className="font-semibold text-foreground">
                Lean Startup
              </span>{" "}
              para iteración continua y{" "}
              <span className="font-semibold text-foreground">
                Diseño Centrado en el Usuario (UCD)
              </span>{" "}
              para garantizar que la solución responda a necesidades reales.
            </p>
            <p className="text-sm font-semibold text-orange-500 mb-3">
              Funcionalidades principales:
            </p>
            <ul className="space-y-4">
              {[
                "Administración y programación de servicios",
                "Monitoreo en tiempo real del consumo",
                "Gestión automatizada de pagos y reconexiones",
                "Sistema de GPS integrado",
                "Alertas y notificaciones instantáneas",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 group-hover:scale-150 transition-transform duration-300" />
                  <span className="text-muted-foreground group-hover:text-orange-500 transition-colors duration-300">
                    {item}
                  </span>
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
                  description:
                    "Realizamos pruebas exhaustivas en diferentes zonas para garantizar la eficacia del sistema.",
                },
                {
                  title: "Capacitación Integral",
                  description:
                    "Proporcionamos formación completa para el personal técnico y usuarios finales.",
                },
                {
                  title: "Soporte Continuo",
                  description:
                    "Ofrecemos asistencia técnica permanente y actualizaciones del sistema.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-orange-500/10 rounded-lg p-6 transition-all duration-300 hover:translate-y-[-2px] hover:border-orange-500/20 bg-background"
                >
                  <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Program */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
            <span className="text-orange-500 font-medium text-sm">
              Capacitación y soporte
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Programa de Formación</h2>
          <p className="text-muted-foreground">
            Capacitación integral para garantizar el éxito de la implementación
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-orange-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Users className="text-orange-500 h-6 w-6" />
                </div>
                Personal Técnico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Formación especializada de 1-2 semanas que incluye:
              </p>
              <ul className="space-y-3">
                {[
                  "Funcionamiento técnico del dispositivo IoT",
                  "Uso de la plataforma web de administración",
                  "Programación de cortes y reconexiones",
                  "Protocolos de seguridad y GPS",
                  "Resolución de problemas y mantenimiento",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Users className="text-orange-500 h-6 w-6" />
                </div>
                Usuarios Finales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Capacitación práctica y accesible que cubre:
              </p>
              <ul className="space-y-3">
                {[
                  "Acceso a la plataforma web de consulta",
                  "Interpretación de datos de consumo",
                  "Gestión de notificaciones y alertas",
                  "Proceso de pago y reconexión",
                  "Soporte técnico 24/7",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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
              <span className="text-orange-500 font-medium text-sm">
                Dónde operamos
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Cobertura Nacional</h2>
            <p className="text-muted-foreground">
              Nuestra presencia a lo largo de Chile garantiza un servicio
              confiable en todo el territorio
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <p className="text-center text-muted-foreground leading-relaxed">
                Nuestra solución está diseñada para adaptarse a diferentes zonas
                y necesidades específicas en todo el territorio nacional. Con
                una cobertura del 99.8% de los hogares con suministro eléctrico,
                estamos preparados para implementar nuestra tecnología donde sea
                necesario.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="text-center p-6 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    99.8%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cobertura nacional
                  </div>
                </div>
                <div className="text-center p-6 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    16
                  </div>
                  <div className="text-sm text-muted-foreground">Regiones</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Soporte técnico
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <p className="text-sm font-semibold text-orange-500 mb-4">
                  Principales ciudades con cobertura:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    "Santiago",
                    "Antofagasta",
                    "Concepción",
                    "Puerto Montt",
                    "La Serena",
                    "Valdivia",
                    "Valparaíso",
                    "Temuco",
                  ].map((ciudad) => (
                    <span
                      key={ciudad}
                      className="px-4 py-2 bg-orange-500/10 rounded-full text-sm font-medium"
                    >
                      {ciudad}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ObjectiveCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:translate-y-[-2px] border border-border/50 h-full bg-background">
      <CardContent className="p-6 space-y-4">
        <div className="mb-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
