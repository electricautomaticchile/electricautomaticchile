"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  FileText,
  Download,
} from "lucide-react";
import test from "@/public/test.jpg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { apiService } from "@/lib/api/apiService";

export default function HeroComercial() {
  const [visible, setVisible] = useState(false);
  const [leadMagnetEmail, setLeadMagnetEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);

    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrollY = window.scrollY;
        heroBgRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLeadMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadMagnetEmail || isDownloading) return;

    setIsDownloading(true);

    try {
      const response = await apiService.enviarLeadMagnet({
        email: leadMagnetEmail,
      });

      if (response.success) {
        alert(
          "¡Excelente! El informe ha sido enviado a su email. Revise su bandeja de entrada (y carpeta de spam)."
        );
        setLeadMagnetEmail("");
      } else {
        alert(
          response.error ||
            "Hubo un error al enviar el informe. Por favor intente nuevamente."
        );
      }
    } catch (error) {
      alert("Error de conexión. Por favor intente nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-16 lg:py-20">
      {/* Hero Principal - Enfoque Comercial/Emocional */}
      <section
        className={`relative container mx-auto px-4 py-16 md:py-24 transition-all duration-1000 overflow-hidden ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          ref={heroBgRef}
        >
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 md:pr-8">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">
                Solución IoT para Empresas Eléctricas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              ¿Cansado de Esperar
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {" "}
                Días por la Reposición
              </span>{" "}
              del Servicio?
            </h1>
            <h2 className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Nuestra tecnología IoT repone el suministro eléctrico en minutos,
              no en días. Ahorre tiempo, reduzca costos operativos y mejore la
              satisfacción de sus clientes.
            </h2>

            <div className="flex flex-wrap gap-4">
              <Link href="/formulario">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow shadow-orange-500/20 px-8 py-6 text-lg">
                  Solicitar Demo Gratuita
                </Button>
              </Link>
              <Link href="/navservices">
                <Button
                  variant="outline"
                  className="transition-all duration-300 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500 px-8 py-6 text-lg"
                >
                  Ver Cómo Funciona
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-30 blur-md"></div>
            <Image
              src={test.src}
              alt="Dashboard de control eléctrico IoT"
              className="relative rounded-lg shadow-[0_20px_50px_-15px_rgba(234,88,12,0.2)] w-full transform transition-transform duration-700 hover:scale-[1.02]"
              width={600}
              height={400}
              style={{ objectFit: "cover" }}
            />

            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-[0_10px_30px_-15px_rgba(234,88,12,0.3)] transform rotate-6 flex items-center justify-center">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* El Problema - Enfoque Emocional */}
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              El Problema que{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Todos Conocen
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-6 border border-red-500/20 rounded-lg bg-red-500/5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-500 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Cliente Regulariza Pago
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      El cliente paga su deuda y espera la reconexión del
                      servicio
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-red-500/20 rounded-lg bg-red-500/5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-500 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Espera de 24-72 Horas
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Logística del personal, coordinación de cuadrillas,
                      desplazamientos
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-red-500/20 rounded-lg bg-red-500/5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-500 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Costos Operativos Altos
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Combustible, personal, vehículos, tiempo perdido en
                      desplazamientos
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-red-500/20 rounded-lg bg-red-500/5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-500 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Clientes Insatisfechos
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Reclamos, mala imagen, pérdida de confianza en el servicio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 border border-green-500/20 rounded-lg bg-gradient-to-r from-green-500/5 to-orange-500/5">
              <div className="inline-block mb-3 px-3 py-1 bg-green-500/10 rounded-full">
                <span className="text-green-500 font-medium text-sm">
                  La Solución
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Reposición{" "}
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Automática e Instantánea
                </span>
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Con nuestra tecnología IoT, el servicio se repone
                automáticamente en cuanto se confirma el pago. Sin esperas, sin
                personal en terreno, sin costos adicionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios de Negocio */}
      <section className="py-16 w-full bg-gradient-to-r from-background via-orange-500/[0.01] to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beneficios{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Reales para su Empresa
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Resultados medibles que impactan directamente en su rentabilidad
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  Reduzca Costos Operativos
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed mb-4">
                  Elimine gastos en cuadrillas, combustible y desplazamientos.
                  Ahorre hasta un 70% en costos de reposición del servicio.
                </p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-orange-500">
                    -70%
                  </span>
                  <p className="text-sm text-muted-foreground">
                    en costos operativos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Beneficio 2 */}
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  Reposición Instantánea
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed mb-4">
                  De 72 horas de espera a reconexión automática en minutos.
                  Mejore drásticamente la experiencia de sus clientes.
                </p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-orange-500">
                    &lt;5min
                  </span>
                  <p className="text-sm text-muted-foreground">
                    tiempo de reposición
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Beneficio 3 */}
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  Clientes Más Satisfechos
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed mb-4">
                  Menos reclamos, mejor imagen corporativa y mayor fidelización.
                  Sus clientes valorarán el servicio rápido y eficiente.
                </p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-orange-500">
                    +85%
                  </span>
                  <p className="text-sm text-muted-foreground">
                    satisfacción del cliente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Proceso Simple en 3 Pasos */}
      <section className="w-full py-16 bg-gradient-to-b from-background via-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Simple, Rápido y{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Efectivo
            </span>
          </h3>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Nuestra solución se implementa en 3 pasos simples
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Línea conectora */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/50 to-orange-500/20 -translate-y-1/2 z-0"></div>

              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {/* Paso 1 */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">1</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">
                    Instalamos el Dispositivo
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Nuestro equipo técnico instala el dispositivo IoT en el
                    medidor. Proceso rápido y sin interrupciones.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">2</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">
                    Configuramos la Plataforma
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Acceso a la plataforma web con capacitación incluida.
                    Comience a gestionar desde el primer día.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">3</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">
                    Automatización Total
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    El sistema opera automáticamente. Reposiciones instantáneas,
                    lecturas automáticas y reportes en tiempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/navservices">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 py-6">
                  Ver Detalles Técnicos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="py-8 md:py-16 w-full">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-orange-600/5">
            <CardContent className="p-6 md:p-12 text-center">
              <div className="mb-4 md:mb-6 flex justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                Descargue Nuestro Caso de Estudio: Automatización del Suministro
                Eléctrico
              </h3>
              <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
                Conozca cómo nuestra solución IoT reduce los tiempos de
                reposición del servicio eléctrico de días a minutos, optimiza la
                gestión operativa y mejora la experiencia del cliente. Incluye
                análisis de ROI y casos de éxito.
              </p>

              <form
                onSubmit={handleLeadMagnetSubmit}
                className="max-w-md mx-auto px-2"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <Input
                    type="email"
                    placeholder="Su email empresarial"
                    value={leadMagnetEmail}
                    onChange={(e) => setLeadMagnetEmail(e.target.value)}
                    required
                    className="flex-1 h-12"
                  />
                  <Button
                    type="submit"
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed h-12 px-4 sm:px-6"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span className="hidden sm:inline">Enviando...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          Descargar GRATIS
                        </span>
                        <span className="sm:hidden">Descargar</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-muted-foreground mt-3 md:mt-4 px-2">
                Al descargar acepta recibir comunicaciones relevantes sobre la
                industria energética.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
