"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Wifi,
  Shield,
  Zap,
  CheckCircle,
  MapPin,
  Battery,
  Thermometer,
  ArrowRight,
  Settings,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function HardwarePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-orange-500">Servicio Principal</Badge>
          <Badge variant="outline">Dispositivo IoT</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Dispositivo IoT Inteligente
        </h1>
        <p className="text-lg text-muted-foreground">
          Hardware de última generación diseñado específicamente para la gestión
          inteligente del suministro eléctrico. Instalación simple, operación
          confiable y tecnología de punta.
        </p>
      </div>

      {/* ¿Qué es? */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            ¿Qué es el Dispositivo IoT?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Nuestro dispositivo IoT es un equipo electrónico inteligente que se
            instala dentro del medidor eléctrico existente. Actúa como el
            cerebro del sistema, permitiendo el control remoto del suministro,
            la lectura automática del consumo y la comunicación bidireccional
            con nuestra plataforma en la nube.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Cpu className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Procesamiento Local</h4>
              <p className="text-sm text-muted-foreground">
                Toma decisiones inteligentes en tiempo real
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Wifi className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Conectividad 4G/5G</h4>
              <p className="text-sm text-muted-foreground">
                Comunicación constante con la nube
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Shield className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Seguridad Avanzada</h4>
              <p className="text-sm text-muted-foreground">
                Encriptación y protección contra manipulación
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Características Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">
                    Control Remoto del Suministro
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Capacidad de cortar y reponer el servicio eléctrico de forma
                    remota mediante comandos seguros desde la plataforma.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">
                    Lectura Automática de Consumo
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Medición precisa del consumo energético en tiempo real con
                    transmisión automática de datos a la plataforma.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">GPS Integrado</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema de geolocalización para rastreo en caso de robo o
                    extravío del dispositivo. Protección anti-fraude.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Conectividad Dual</h4>
                  <p className="text-sm text-muted-foreground">
                    Conexión 4G/5G principal con respaldo WiFi. Garantiza
                    comunicación constante incluso en zonas remotas.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Seguridad Multicapa</h4>
                  <p className="text-sm text-muted-foreground">
                    Encriptación end-to-end, autenticación de comandos y
                    protección física contra manipulación no autorizada.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Battery className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Batería de Respaldo</h4>
                  <p className="text-sm text-muted-foreground">
                    Batería interna que mantiene el dispositivo operativo
                    durante cortes de energía, garantizando comunicación
                    continua.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Monitoreo de Temperatura</h4>
                  <p className="text-sm text-muted-foreground">
                    Sensores que detectan sobrecalentamiento y alertan sobre
                    posibles problemas en la instalación eléctrica.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Actualizaciones OTA</h4>
                  <p className="text-sm text-muted-foreground">
                    Actualizaciones de firmware remotas (Over-The-Air) sin
                    necesidad de visitas técnicas al terreno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proceso de Instalación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Proceso de Instalación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Evaluación Técnica</h3>
                <p className="text-muted-foreground">
                  Nuestro equipo técnico evalúa el medidor existente y verifica
                  la compatibilidad. El dispositivo es compatible con el 95% de
                  los medidores instalados en Chile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Instalación del Dispositivo
                </h3>
                <p className="text-muted-foreground">
                  Instalación profesional dentro del medidor en menos de 30
                  minutos. No requiere modificaciones en la instalación
                  eléctrica existente. Proceso certificado por la SEC.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Configuración y Pruebas
                </h3>
                <p className="text-muted-foreground">
                  Configuración del dispositivo, conexión a la red y pruebas de
                  funcionamiento. Verificación de comunicación con la plataforma
                  y calibración de lecturas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Puesta en Marcha</h3>
                <p className="text-muted-foreground">
                  Activación del dispositivo en la plataforma y capacitación
                  básica al cliente. El sistema queda operativo inmediatamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especificaciones Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Especificaciones Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Hardware</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Procesador de bajo consumo energético</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Memoria flash para almacenamiento local</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Relé de estado sólido de alta confiabilidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sensores de corriente y voltaje de precisión</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Módulo GPS integrado</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Conectividad</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>4G LTE / 5G (según disponibilidad)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>WiFi 2.4GHz/5GHz (respaldo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Protocolo MQTT para IoT</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Encriptación TLS 1.3</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reconexión automática</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Alimentación</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Alimentación directa desde el medidor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Batería de respaldo de litio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Autonomía: 72 horas sin energía</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consumo: &lt;2W en operación normal</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Certificaciones</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Certificación SEC (Superintendencia de Electricidad)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Norma IEC 62052-11 (Medidores)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>IP54 (Protección contra polvo y agua)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Rango de temperatura: -10°C a 60°C</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad y Protección */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Seguridad y Protección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Protección Anti-Manipulación
              </h4>
              <p className="text-sm text-muted-foreground">
                El dispositivo cuenta con sensores que detectan intentos de
                apertura o manipulación no autorizada. Cualquier intento genera
                una alerta inmediata en la plataforma y puede bloquear el
                dispositivo automáticamente.
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Sistema GPS Anti-Robo
              </h4>
              <p className="text-sm text-muted-foreground">
                En caso de robo o extravío, el GPS integrado permite rastrear la
                ubicación del dispositivo en tiempo real. Se puede aplicar un
                cargo adicional al cliente por reposición del equipo robado.
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                Comandos Remotos Seguros
              </h4>
              <p className="text-sm text-muted-foreground">
                Todos los comandos enviados al dispositivo están encriptados y
                requieren autenticación. Es posible enviar comandos de
                reconfiguración individual o masiva para múltiples dispositivos
                simultáneamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mantenimiento y Soporte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mantenimiento y Soporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Vida Útil y Garantía</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vida útil estimada: 10+ años</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Garantía del fabricante: 3 años</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mantenimiento preventivo incluido</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reemplazo sin costo en caso de falla</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Soporte Técnico</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Soporte 24/7/365</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Diagnóstico remoto de problemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Técnicos certificados en todo Chile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tiempo de respuesta: &lt;24 horas</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <CardContent className="p-8 text-center">
          <Cpu className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Tecnología de Punta para su Red Eléctrica
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestro dispositivo IoT es la base de una gestión eléctrica moderna,
            eficiente y segura. Solicite más información sobre especificaciones
            técnicas y opciones de implementación.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/formulario">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Solicitar Información Técnica
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Ver Especificaciones Completas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
