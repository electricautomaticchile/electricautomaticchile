"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ReposicionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-orange-500">Servicio Principal</Badge>
          <Badge variant="outline">Automatización IoT</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Reposición Automatizada del Servicio Eléctrico
        </h1>
        <p className="text-lg text-muted-foreground">
          Elimine las esperas de días y reponga el suministro eléctrico en
          minutos de forma completamente automática tras la regularización del
          pago.
        </p>
      </div>

      {/* Problema vs Solución */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              El Problema Tradicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-600">1</span>
              </div>
              <p className="text-sm">
                Cliente regulariza su deuda y espera la reconexión
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-600">2</span>
              </div>
              <p className="text-sm">
                Coordinación de cuadrillas y logística del personal
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-600">3</span>
              </div>
              <p className="text-sm">
                Espera de 24 a 72 horas para la reposición manual
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-600">4</span>
              </div>
              <p className="text-sm">
                Altos costos operativos y clientes insatisfechos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Nuestra Solución Automática
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">1</span>
              </div>
              <p className="text-sm">
                Sistema detecta automáticamente el pago regularizado
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">2</span>
              </div>
              <p className="text-sm">
                Dispositivo IoT recibe comando de reconexión instantánea
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">3</span>
              </div>
              <p className="text-sm">
                Servicio repuesto en menos de 5 minutos, sin intervención humana
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">4</span>
              </div>
              <p className="text-sm">
                Cliente satisfecho y costos operativos reducidos hasta 70%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  Integración con Sistema de Pagos
                </h3>
                <p className="text-muted-foreground">
                  Nuestra plataforma se integra con su sistema de facturación y
                  pagos existente. Cuando un cliente regulariza su deuda, el
                  sistema lo detecta automáticamente en tiempo real.
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
                  Comando Remoto al Dispositivo IoT
                </h3>
                <p className="text-muted-foreground">
                  La plataforma envía un comando seguro y encriptado al
                  dispositivo IoT instalado en el medidor del cliente. Este
                  comando viaja a través de nuestra red segura en cuestión de
                  segundos.
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
                  Reconexión Automática del Servicio
                </h3>
                <p className="text-muted-foreground">
                  El dispositivo IoT ejecuta el comando y reconecta el
                  suministro eléctrico de forma automática. Todo el proceso toma
                  menos de 5 minutos desde la confirmación del pago.
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
                  Notificación al Cliente
                </h3>
                <p className="text-muted-foreground">
                  El cliente recibe una notificación instantánea por email y SMS
                  confirmando la reposición del servicio. Transparencia total en
                  todo el proceso.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beneficios Medibles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Beneficios Medibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-orange-500 mb-2">
                &lt;5min
              </div>
              <p className="text-sm text-muted-foreground">
                Tiempo promedio de reposición vs 24-72 horas tradicional
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-500 mb-2">-70%</div>
              <p className="text-sm text-muted-foreground">
                Reducción en costos operativos (personal, combustible,
                vehículos)
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-500 mb-2">+85%</div>
              <p className="text-sm text-muted-foreground">
                Aumento en satisfacción del cliente y reducción de reclamos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Casos de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Casos de Uso Reales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2">
                Empresa Distribuidora con 50,000 Clientes
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Antes: 200 reposiciones manuales diarias, 3 cuadrillas, costos
                de $15,000 USD/mes
              </p>
              <p className="text-sm font-semibold text-green-600">
                Después: Reposiciones automáticas, 0 cuadrillas necesarias,
                costos reducidos a $4,500 USD/mes
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2">Zona Rural con Difícil Acceso</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Antes: Reposiciones tomaban hasta 5 días por distancia y
                logística
              </p>
              <p className="text-sm font-semibold text-green-600">
                Después: Reposición instantánea sin importar la ubicación
                geográfica
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
              <h4 className="font-bold mb-2">Horarios Fuera de Oficina</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Antes: Pagos nocturnos o fines de semana esperaban hasta el
                lunes
              </p>
              <p className="text-sm font-semibold text-green-600">
                Después: Reposición 24/7/365, sin importar día u hora
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Especificaciones Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Seguridad</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comunicación encriptada end-to-end</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Autenticación de dos factores para comandos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Registro completo de auditoría</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Cumplimiento normativo SEC</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Rendimiento</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tiempo de respuesta: &lt;5 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Disponibilidad: 99.9% uptime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Escalabilidad: Hasta 1M de dispositivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Operación 24/7/365</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Integración</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>API REST para sistemas existentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Webhooks para eventos en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Compatible con ERP y CRM principales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Documentación completa de API</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Monitoreo</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Dashboard en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Alertas automáticas de fallos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reportes históricos detallados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Métricas de rendimiento (KPIs)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <CardContent className="p-8 text-center">
          <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            ¿Listo para Automatizar su Reposición de Servicio?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Solicite una demostración gratuita y vea cómo puede reducir sus
            costos operativos hasta un 70% mientras mejora la satisfacción de
            sus clientes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/formulario">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Acceder al Portal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
