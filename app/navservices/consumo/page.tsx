"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GaugeIcon,
  BarChart3,
  Bell,
  Mail,
  Smartphone,
  CheckCircle,
  TrendingDown,
  Clock,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function ConsumoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-orange-500">Servicio Principal</Badge>
          <Badge variant="outline">Lectura Automática</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Control y Monitoreo Automático de Consumo
        </h1>
        <p className="text-lg text-muted-foreground">
          Lectura automática del consumo energético mensual con envío
          instantáneo de reportes a la plataforma web y notificaciones por email
          y SMS, sin gestión manual de facturación.
        </p>
      </div>

      {/* ¿Qué es? */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            ¿Qué es el Control de Consumo Automático?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Nuestro sistema de control de consumo elimina completamente la
            necesidad de lecturas manuales. El dispositivo IoT instalado en el
            medidor toma lecturas automáticas del consumo energético y las
            transmite en tiempo real a nuestra plataforma, generando reportes
            instantáneos y notificaciones automáticas tanto para la empresa como
            para el cliente final.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border rounded-lg text-center">
              <Clock className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Lecturas Automáticas</h4>
              <p className="text-sm text-muted-foreground">
                Cada hora, día o mes según configuración
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Bell className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">
                Notificaciones Instantáneas
              </h4>
              <p className="text-sm text-muted-foreground">
                Email y SMS automáticos al cliente
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <FileText className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Reportes Detallados</h4>
              <p className="text-sm text-muted-foreground">
                Históricos y análisis de patrones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ¿Cómo Funciona? */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">¿Cómo Funciona el Sistema?</CardTitle>
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
                <h3 className="font-bold text-lg mb-2">
                  Lectura Automática del Medidor
                </h3>
                <p className="text-muted-foreground">
                  El dispositivo IoT lee automáticamente el consumo energético
                  del medidor según la frecuencia configurada (horaria, diaria o
                  mensual). No requiere intervención humana ni visitas al
                  terreno.
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
                  Transmisión en Tiempo Real
                </h3>
                <p className="text-muted-foreground">
                  Los datos de consumo se transmiten de forma segura y
                  encriptada a nuestra plataforma en la nube. La información
                  está disponible instantáneamente en el dashboard de la empresa
                  y del cliente.
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
                  Generación Automática de Reportes
                </h3>
                <p className="text-muted-foreground">
                  El sistema genera automáticamente reportes detallados con
                  gráficos, comparativas históricas y análisis de patrones de
                  consumo. Estos reportes se almacenan en la plataforma y están
                  disponibles para descarga.
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
                <h3 className="font-bold text-lg mb-2">
                  Notificaciones Multi-canal
                </h3>
                <p className="text-muted-foreground">
                  El cliente recibe notificaciones automáticas por email y SMS
                  con su consumo mensual, monto a pagar y fecha de vencimiento.
                  Todo sin gestión manual de facturación.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beneficios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Beneficios para su Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Operacionales</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Eliminación de Lecturas Manuales
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No más personal en terreno tomando lecturas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Reducción de Errores Humanos</p>
                    <p className="text-sm text-muted-foreground">
                      Lecturas 100% precisas y verificables
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Facturación Automática</p>
                    <p className="text-sm text-muted-foreground">
                      Integración directa con sistemas de facturación
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Ahorro de Tiempo</p>
                    <p className="text-sm text-muted-foreground">
                      Proceso que tomaba días ahora es instantáneo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Financieros</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Reducción de Costos 60%</p>
                    <p className="text-sm text-muted-foreground">
                      En personal, combustible y logística
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Detección de Fraudes</p>
                    <p className="text-sm text-muted-foreground">
                      Identificación automática de consumos anómalos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mejora en Cobranza</p>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones oportunas aumentan tasa de pago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">ROI en 12 Meses</p>
                    <p className="text-sm text-muted-foreground">
                      Retorno de inversión rápido y medible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Sistema de Notificaciones Multi-canal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <Mail className="w-10 h-10 text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-3">
                Notificaciones por Email
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reporte mensual de consumo detallado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Factura adjunta en PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Gráficos de consumo histórico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comparativa con mes anterior</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Recomendaciones de ahorro</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <Smartphone className="w-10 h-10 text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-3">Notificaciones por SMS</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Resumen de consumo mensual</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Monto total a pagar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Fecha de vencimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Link de pago directo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Alertas de consumo elevado</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis y Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Análisis Inteligente de Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Nuestra plataforma no solo registra el consumo, sino que lo
              analiza para proporcionar insights valiosos:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
                <h4 className="font-bold mb-2">Detección de Anomalías</h4>
                <p className="text-sm text-muted-foreground">
                  Identificación automática de consumos inusuales que podrían
                  indicar fraude, fuga eléctrica o mal funcionamiento de
                  equipos.
                </p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
                <h4 className="font-bold mb-2">Patrones de Consumo</h4>
                <p className="text-sm text-muted-foreground">
                  Análisis de horarios pico, días de mayor consumo y tendencias
                  estacionales para optimizar la gestión de la red.
                </p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
                <h4 className="font-bold mb-2">Predicción de Demanda</h4>
                <p className="text-sm text-muted-foreground">
                  Proyecciones de consumo futuro basadas en históricos y
                  patrones identificados para mejor planificación.
                </p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
                <h4 className="font-bold mb-2">Comparativas</h4>
                <p className="text-sm text-muted-foreground">
                  Comparación con períodos anteriores, promedios del sector y
                  benchmarks para identificar oportunidades de mejora.
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
              <h4 className="font-semibold mb-3">Frecuencia de Lecturas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Horaria: Para monitoreo en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Diaria: Para control detallado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mensual: Para facturación estándar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Personalizable según necesidades</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Precisión y Confiabilidad</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Precisión: ±0.5% (Clase 1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Certificación SEC</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Respaldo de datos en la nube</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Histórico de 10 años</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Optimice su Gestión de Consumo Hoy
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Elimine las lecturas manuales y automatice completamente su proceso
            de facturación. Reduzca costos y mejore la experiencia de sus
            clientes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/formulario">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Solicitar Información
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Ver Demo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
