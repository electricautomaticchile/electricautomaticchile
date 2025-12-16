"use client";

import { Building2, Home, Factory, Store, Zap, Clock, Shield, BarChart3, Smartphone, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SolucionesPage() {
  const solutions = [
    {
      icon: Building2,
      title: "Compañías Eléctricas",
      description: "Optimiza la gestión de miles de clientes con nuestra plataforma integral. Reduce costos operativos hasta en un 70% y mejora la recuperación de cartera morosa.",
      benefits: [
        "Gestión masiva de cortes y reposiciones automáticas",
        "Reducción drástica de costos de personal en terreno",
        "Reportes automáticos de consumo y facturación",
        "Dashboard centralizado para monitoreo en tiempo real",
        "Integración con sistemas de facturación existentes"
      ],
      stats: { value: "70%", label: "Reducción de costos operativos" }
    },
    {
      icon: Home,
      title: "Condominios y Edificios",
      description: "Control centralizado del suministro eléctrico de múltiples unidades con facturación individual automatizada y transparente.",
      benefits: [
        "Facturación automática por unidad habitacional",
        "Control independiente de áreas comunes",
        "Transparencia total en consumos individuales",
        "Gestión de morosos sin afectar a otros residentes",
        "Reportes mensuales automáticos para administración"
      ],
      stats: { value: "100%", label: "Transparencia en consumos" }
    },
    {
      icon: Factory,
      title: "Industrias",
      description: "Monitoreo detallado de consumo energético para optimizar procesos productivos y reducir costos operacionales significativamente.",
      benefits: [
        "Análisis de consumo por área o línea de producción",
        "Detección automática de anomalías y fugas energéticas",
        "Optimización de horarios de producción según tarifas",
        "Reportes de eficiencia energética en tiempo real",
        "Alertas de consumo fuera de parámetros normales"
      ],
      stats: { value: "30%", label: "Ahorro energético promedio" }
    },
    {
      icon: Store,
      title: "Comercios y Retail",
      description: "Gestión eficiente del suministro en locales comerciales con control remoto centralizado y alertas inteligentes de consumo.",
      benefits: [
        "Control remoto de múltiples sucursales desde un solo lugar",
        "Alertas de consumo anormal o fuera de horario",
        "Reportes mensuales automáticos por local",
        "Programación de horarios de operación",
        "Comparativas de consumo entre sucursales"
      ],
      stats: { value: "24/7", label: "Control remoto" }
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Reposición Automática",
      description: "Elimina tiempos de espera. El servicio se restablece automáticamente al regularizar el pago, sin necesidad de personal en terreno. Según datos del Ministerio de Energía, reducimos los tiempos de reposición de 24-48 horas a minutos."
    },
    {
      icon: BarChart3,
      title: "Lectura Inteligente",
      description: "Toma automática de consumo mensual con reportes instantáneos vía web, SMS y correo electrónico. Elimina errores de lectura manual y reduce costos de facturación en un 60%."
    },
    {
      icon: Shield,
      title: "Gestión Remota",
      description: "Administra cortes y reposiciones desde la plataforma web. Control total sin desplazamientos. Gestión masiva o individual con comandos remotos seguros y encriptados."
    },
    {
      icon: MapPin,
      title: "Protección GPS",
      description: "Localización en tiempo real del dispositivo. Protección contra extravío o manipulación indebida. Sistema de alertas ante intentos de remoción no autorizada."
    },
    {
      icon: Smartphone,
      title: "Notificaciones Instantáneas",
      description: "Alertas automáticas de consumo, pagos pendientes y estado del servicio en tiempo real. Integración con WhatsApp, SMS y email para máxima cobertura."
    },
    {
      icon: Zap,
      title: "Comandos Remotos",
      description: "Reconfiguración masiva o individual de dispositivos sin necesidad de visitas técnicas. Actualizaciones de firmware remotas y diagnóstico en línea."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-medium text-sm">Nuestras Soluciones</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tecnología que Transforma la Gestión Eléctrica
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Soluciones integrales adaptadas a cada sector, desde compañías eléctricas 
              hasta hogares, con tecnología IoT de vanguardia y soporte 24/7
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 dark:bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Soluciones para Cada Necesidad
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Adaptable a diferentes sectores y escalas de operación, con resultados medibles
            </p>
          </div>

          <div className="space-y-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-orange-500/20 hover:border-orange-500/40 transition-all dark:bg-black">
                  <CardContent className="p-8 md:p-12">
                    <div className="grid md:grid-cols-[auto,1fr,auto] gap-8 items-start">
                      <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                        <solution.icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>

                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">{solution.title}</h3>
                        <p className="text-gray-600 dark:text-white/80 mb-6 text-lg">{solution.description}</p>
                        
                        <div className="space-y-3">
                          {solution.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-white/90">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 min-w-[180px]">
                        <div className="text-4xl font-bold text-orange-500 mb-2">{solution.stats.value}</div>
                        <div className="text-sm text-gray-600 dark:text-white/70">{solution.stats.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="py-20 px-4 bg-gray-50 dark:bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características de Nuestra Tecnología
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Solución integral que automatiza procesos, reduce costos operativos y mejora la experiencia del cliente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow dark:bg-black dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-white/80 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 dark:bg-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para Transformar tu Gestión Eléctrica?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Agenda una demo gratuita y descubre cómo podemos optimizar tus operaciones
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/formulario">
                <Button size="lg" variant="secondary">
                  Solicitar Demo Gratuita
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  Acceder a la Plataforma
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
