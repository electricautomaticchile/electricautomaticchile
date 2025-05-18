"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BoltIcon, GaugeIcon, WrenchIcon, ArrowRight, Menu } from 'lucide-react';
import Link from "next/link";

import Consumo from "@/app/navservices/consumo/page";
import Hardware from "@/app/navservices/hardware/page";
import Reposicion from "@/app/navservices/reposicion/page";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("reposicion");
  const [navOpen, setNavOpen] = useState(false);
  
  const services = [
    {
      id: "reposicion",
      title: "Reposición Automatizada",
      icon: <BoltIcon className="h-5 w-5 text-orange-500" />,
      description: "Sistema inteligente para reposición automática del servicio eléctrico tras la regularización del pago.",
      benefits: ["Reposición inmediata", "Programación flexible", "Alertas en tiempo real"],
      component: <Reposicion />
    },
    {
      id: "hardware",
      title: "Integración de Hardware",
      icon: <WrenchIcon className="h-5 w-5 text-orange-500" />,
      description: "Dispositivos inteligentes para la medición y gestión eficiente de la energía eléctrica.",
      benefits: ["Fácil instalación", "Comunicación inalámbrica", "Compatible con sistemas existentes"],
      component: <Hardware />
    },
    {
      id: "consumo",
      title: "Control de Consumo",
      icon: <GaugeIcon className="h-5 w-5 text-orange-500" />,
      description: "Monitoreo en tiempo real del consumo energético para optimizar gastos y detectar anomalías.",
      benefits: ["Análisis de patrones", "Recomendaciones de ahorro", "Histórico detallado"],
      component: <Consumo />
    }
  ];

  return (
    <div className="w-full px-4 py-8 md:py-12">
      {/* Encabezado */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-block px-3 py-1 bg-orange-500/10 rounded-full text-orange-500 font-medium text-sm mb-4">
          Nuestros servicios
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Soluciones Inteligentes de Electricidad
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Ofrecemos tecnología avanzada para el monitoreo, control y automatización 
          de sistemas eléctricos, mejorando la eficiencia y reduciendo costos.
        </p>
      </div>

      {/* Navegación móvil */}
      <div className="mb-6 md:hidden">
        <div className="flex items-center justify-between p-3 border rounded-lg mb-4 bg-background">
          <div className="flex items-center gap-2">
            {services.find(s => s.id === activeTab)?.icon}
            <span className="font-semibold">{services.find(s => s.id === activeTab)?.title}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {navOpen && (
          <div className="flex flex-col gap-2 mb-6">
            {services.map(service => (
              <button
                key={service.id}
                className={`p-3 flex items-start gap-3 text-left border rounded-lg transition ${
                  activeTab === service.id 
                    ? 'bg-orange-500/5 border-orange-500/50' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => {
                  setActiveTab(service.id);
                  setNavOpen(false);
                }}
              >
                <div className="mt-0.5">{service.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{service.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layout principal (escritorio) */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Navegación lateral (escritorio) */}
          <div className="hidden md:block md:w-1/3 lg:w-1/4 space-y-4">
            <div className="flex flex-col gap-2 sticky top-24">
              {services.map(service => (
                <button
                  key={service.id}
                  className={`p-4 flex items-start justify-between text-left border rounded-lg transition ${
                    activeTab === service.id 
                      ? 'bg-orange-500/5 border-orange-500/50' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveTab(service.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{service.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{service.title}</div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-all duration-300 ${activeTab === service.id ? 'text-orange-500 translate-x-1' : 'opacity-0'}`} />
                </button>
              ))}

              {/* Tarjeta de beneficios */}
              <Card className="border-orange-500/10 mt-4">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Beneficios clave</CardTitle>
                  <CardDescription className="text-xs">
                    Ventajas del servicio de {services.find(s => s.id === activeTab)?.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-2">
                    {services.find(s => s.id === activeTab)?.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Link href="/formulario">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-sm">
                        Solicitar información
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="md:w-2/3 lg:w-3/4">
            {services.map(service => (
              <div 
                key={service.id} 
                className={activeTab === service.id ? "block" : "hidden"}
              >
                {service.component}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
