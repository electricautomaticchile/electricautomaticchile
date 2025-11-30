"use client";

import { Button } from "@/components/ui/button";
import { Zap, Clock, BarChart3, Shield, ArrowRight, CheckCircle2, MapPin, Smartphone, Users, Building2, TrendingDown, Wifi } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroComercial() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Wifi className="h-4 w-4" />
              <span className="font-medium text-sm">Tecnología IoT Certificada</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Automatización Inteligente del
              <span className="block text-white/90">Suministro Eléctrico</span>
            </h1>

            <p className="text-xl md:text-2xl mb-6 text-white/90 leading-relaxed">
              Eliminamos los tiempos de espera en la reposición del servicio eléctrico 
              con tecnología IoT de vanguardia
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Reposición Instantánea</p>
                  <p className="text-white/80">De 24-48 horas a minutos. Automatización completa del proceso</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Monitoreo en Tiempo Real</p>
                  <p className="text-white/80">Lectura automática de consumo con reportes instantáneos vía web, SMS y email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Gestión Remota Total</p>
                  <p className="text-white/80">Control desde cualquier lugar con protección GPS y comandos remotos seguros</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/formulario">
                <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                  Solicitar Demo Gratuita
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/soluciones">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 w-full sm:w-auto">
                  Ver Soluciones
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">99.8%</div>
                <div className="text-sm text-white/80">Cobertura Chile</div>
              </div>
              <div>
                <div className="text-3xl font-bold">80%</div>
                <div className="text-sm text-white/80">Ahorro de tiempo</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Monitoreo activo</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <Clock className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Reposición Automática</h3>
                <p className="text-white/80 text-sm">Servicio restablecido en minutos tras regularizar pago</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <BarChart3 className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lectura Inteligente</h3>
                <p className="text-white/80 text-sm">Consumo en tiempo real con reportes automáticos</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <Shield className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Gestión Remota</h3>
                <p className="text-white/80 text-sm">Control total desde la plataforma web</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <MapPin className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Protección GPS</h3>
                <p className="text-white/80 text-sm">Localización y seguridad del dispositivo</p>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Reduce Costos Operativos hasta 70%</h3>
                  <p className="text-white/90 mb-4">
                    Elimina visitas técnicas innecesarias, optimiza la gestión de personal 
                    y automatiza procesos de facturación y reconexión
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Sin personal en terreno</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Facturación automática</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Cero errores humanos</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-center text-sm text-white/80 mb-8 font-medium">
            Colaboramos con empresas líderes del sector eléctrico en Chile
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-black rounded-xl shadow-lg border dark:border-white/10"
            >
              <Zap className="h-10 w-10 text-orange-500" />
              <div className="text-left">
                <div className="font-bold text-lg text-gray-900 dark:text-white">Chilquinta Energía</div>
                <div className="text-xs text-gray-500">Socio Estratégico</div>
              </div>
            </motion.div>
          </div>

          {/* Certificaciones */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="font-medium">Certificado ISO 9001</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="font-medium">Normativa SEC Chile</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="font-medium">Tecnología IoT Certificada</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="font-medium">Soporte 24/7</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Soluciones para Cada Sector
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Desde compañías eléctricas hasta hogares, nuestra tecnología se adapta 
            a las necesidades específicas de cada cliente
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          {[
            {
              icon: Building2,
              title: "Compañías Eléctricas",
              description: "Gestión masiva de clientes con reducción de costos operativos del 70%",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Users,
              title: "Condominios",
              description: "Control centralizado con facturación individual automatizada",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Building2,
              title: "Industrias",
              description: "Optimización energética con análisis detallado por área",
              color: "from-purple-500 to-purple-600"
            },
            {
              icon: Building2,
              title: "Comercios",
              description: "Control remoto de múltiples sucursales desde un solo lugar",
              color: "from-orange-400 to-orange-500"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full bg-white dark:bg-black dark:border dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                <Link href="/soluciones" className="inline-flex items-center gap-2 mt-4 text-orange-500 font-medium group-hover:gap-3 transition-all">
                  Ver más <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center pb-8"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">Descubre más</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="h-5 w-5 rotate-90" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
