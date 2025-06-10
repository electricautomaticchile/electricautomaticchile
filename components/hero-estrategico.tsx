"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  BoltIcon,
  GaugeIcon,
  BellIcon,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Download,
  Building2,
  DollarSign,
  BarChart3,
  Cpu,
  Eye,
  FileText,
  ArrowRight,
} from "lucide-react";
import test from "@/public/test.jpg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SistemaElectricoMetrics from "@/components/sistema-electrico-metrics";

export default function HeroEstrategico() {
  const [visible, setVisible] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
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

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario de demo
    alert(
      "¡Gracias! Nos contactaremos contigo pronto para agendar tu demostración."
    );
    setShowDemoForm(false);
  };

  const handleLeadMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadMagnetEmail || isDownloading) return;

    setIsDownloading(true);

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: leadMagnetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "¡Excelente! El informe ha sido enviado a su email. Revise su bandeja de entrada (y carpeta de spam)."
        );
        setLeadMagnetEmail("");
      } else {
        alert(
          data.error ||
            "Hubo un error al enviar el informe. Por favor intente nuevamente."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión. Por favor intente nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-16 lg:py-20">
      {/* Hero Section - Nueva Propuesta de Valor */}
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
                Plataforma IoT Empresarial
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Reponga el Suministro en
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                {" "}
                Minutos, no en Días
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              La plataforma IoT para empresas distribuidoras que reduce
              drásticamente los costos operativos y automatiza la gestión de la
              red eléctrica en Chile.
            </h2>

            <div className="flex flex-wrap gap-4">
              <Link href="/formulario">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow shadow-orange-500/20 px-8 py-6 text-lg">
                  Contactar a Ventas
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="transition-all duration-300 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500 px-8 py-6 text-lg"
                >
                  Portal Clientes
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

      {/* Sección de Confianza y Credibilidad */}
      <section className="w-full py-16 bg-gradient-to-b from-background via-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Diseñado para la{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Red Eléctrica de Chile
            </span>
          </h3>

          <div className="flex justify-center">
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1 max-w-md">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4">
                  Cumplimiento Normativo como Prioridad
                </h4>
                <div className="mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                </div>
                <p className="text-muted-foreground">
                  Nuestros dispositivos y plataforma están diseñados siguiendo
                  los lineamientos y requisitos técnicos de la Superintendencia
                  de Electricidad y Combustibles (SEC).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección Problema/Solución */}
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <div className="inline-block mb-3 px-3 py-1 bg-red-500/10 rounded-full">
              <span className="text-red-500 font-medium text-sm">
                El Problema
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">
              El 95% de las reposiciones de servicio post-pago tardan hasta 72
              horas
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Generando altos costos operativos, reclamos de clientes y pérdida
              de ingresos
            </p>

            <div className="inline-block mb-3 px-3 py-1 bg-green-500/10 rounded-full">
              <span className="text-green-500 font-medium text-sm">
                Nuestra Solución
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestra plataforma lo{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                automatiza en segundos
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Vea cómo transformamos el proceso completo:
              {/* Métricas del Sistema Eléctrico Nacional */}
              <SistemaElectricoMetrics />
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Beneficios Segmentados */}
      <section className="py-16 w-full bg-gradient-to-r from-background via-orange-500/[0.01] to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Para Director de Finanzas (CFO) */}
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Optimice su Rentabilidad y Reduzca el OPEX
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Deje de invertir recursos en cuadrillas para reposiciones
                  manuales. Nuestra plataforma automatiza el ciclo completo,
                  desde la lectura hasta el corte y la reconexión, generando un
                  ROI claro en menos de 18 meses. Reduzca los costos asociados a
                  reclamos y multas por demoras.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                      Reducción de costos operativos &gt; 30%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm">ROI en menos de 18 meses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                      Reducción de multas y reclamos
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Para Director de Operaciones (COO) */}
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Seguridad, Eficiencia y Control Total de la Red
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Obtenga visibilidad en tiempo real de su infraestructura.
                  Nuestros dispositivos IoT con GPS integrado previenen el
                  fraude y el robo de nuestros dispositivos. La plataforma se
                  integra de forma segura con sus sistemas existentes y le
                  entrega reportes automáticos, liberando a su equipo técnico
                  para tareas de mayor valor.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">
                      Monitoreo en tiempo real 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">GPS anti-fraude integrado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">
                      Integración con sistemas existentes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Magnet - Imán de Leads */}
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
                Análisis Exclusivo: El Futuro de la Gestión Energética en Chile
              </h3>
              <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
                Acceda a nuestro informe completo sobre la infraestructura
                energética inteligente, los desafíos regulatorios y las
                tecnologías que están definiendo el futuro del sector en Chile.
                Un recurso indispensable para la toma de decisiones
                estratégicas.
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
