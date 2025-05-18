"use client";
import { Card, CardContent } from "@/components/ui/card"
import { BoltIcon, GaugeIcon, BellIcon, CheckCircle, Users, TrendingUp, Zap } from 'lucide-react'
import test from "@/public/test.jpg"
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-orange-500/5 hover:-translate-y-1 border border-border/50 h-full bg-background">
      <CardContent className="p-6 text-center h-full flex flex-col justify-between">
        <div className="mb-4 flex justify-center transform transition-transform duration-500 group-hover:scale-110 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-full blur-xl opacity-80"></div>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCounter({ value, label, icon, suffix = "" }: { value: number; label: string; icon: React.ReactNode; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = Math.min(value, 999);
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.min(Math.floor(start), end));
        
        if (start >= end) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center p-6 relative">
      <div className="mb-2 text-orange-500 relative z-10">
        {icon}
      </div>
      <div className="text-4xl font-bold mb-1 transition-colors group-hover:text-orange-500 relative z-10">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground relative z-10">{label}</div>
    </div>
  );
}

export default function Component() {
  const [visible, setVisible] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setVisible(true);
    
    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrollY = window.scrollY;
        heroBgRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <section className={`relative container mx-auto px-4 py-16 md:py-24 transition-all duration-1000 overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 z-0 pointer-events-none" ref={heroBgRef}>
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 md:pr-8">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">Automatiza tu energía</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Con tu medidor bajo control tu consumo eléctrico
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> disminuye</span>
            </h1>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              Automatiza la reposición del servicio y gestiona el consumo eléctrico con tecnología de punta. Obtén control total sobre tu electricidad.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/formulario">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow shadow-orange-500/20 px-8 py-6">
                  Empezar ahora
                </Button>
              </Link>
              <Link href="/navservices">
                <Button variant="outline" className="transition-all duration-300 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500 px-8 py-6">
                  Ver servicios
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-30 blur-md"></div>
            <Image
              src={test.src}
              alt="Dashboard de control eléctrico"
              className="relative rounded-lg shadow-[0_20px_50px_-15px_rgba(234,88,12,0.2)] w-full transform transition-transform duration-700 hover:scale-[1.02]"
              width={600}
              height={400}
              style={{ objectFit: 'cover' }}
            />
            
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-[0_10px_30px_-15px_rgba(234,88,12,0.3)] transform rotate-6 flex items-center justify-center">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="w-full py-16 bg-gradient-to-b from-background via-orange-500/[0.02] to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/[0.03] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-2xl font-bold text-center mb-10 max-w-xl mx-auto">
            Respaldados por <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">números</span> que hablan por sí solos
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <StatCounter value={98} label="Clientes satisfechos" icon={<Users className="w-8 h-8" />} suffix="%" />
            </Card>
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <StatCounter value={30} label="Reducción en consumo" icon={<TrendingUp className="w-8 h-8" />} suffix="%" />
            </Card>
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <StatCounter value={850} label="Instalaciones realizadas" icon={<CheckCircle className="w-8 h-8" />} />
            </Card>
            <Card className="group border border-orange-500/10 bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-[0_10px_25px_-15px_rgba(234,88,12,0.15)] hover:-translate-y-1">
              <StatCounter value={24} label="Servicio técnico" icon={<Zap className="w-8 h-8" />} suffix="/7" />
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block mb-3 px-3 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-500 font-medium text-sm">Características principales</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              No necesitas esperas, <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">necesitas automatización</span>
            </h2>
            <p className="text-muted-foreground">
              Nuestras soluciones inteligentes te permiten controlar y optimizar tu consumo eléctrico en todo momento
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <InfoCard
              icon={<BoltIcon className="w-12 h-12 text-orange-500 relative z-10" />}
              title="Reposición Automática"
              description="Restauración inmediata del servicio tras la regularización del pago, sin necesidad de esperas ni llamadas."
            />
            <InfoCard
              icon={<GaugeIcon className="w-12 h-12 text-orange-500 relative z-10" />}
              title="Lectura en Tiempo Real"
              description="Monitoreo automático del consumo energético a través de nuestra plataforma web y aplicación móvil."
            />
            <InfoCard
              icon={<BellIcon className="w-12 h-12 text-orange-500 relative z-10" />}
              title="Notificaciones Instantáneas"
              description="Alertas inmediatas sobre consumo anormal y estado del servicio para actuar preventivamente."
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/formulario">
              <Button variant="outline" className="transition-all duration-300 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500">
                Solicitar más información
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
