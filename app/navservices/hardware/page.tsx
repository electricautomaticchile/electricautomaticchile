"use client";
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Cpu, BarChart2, WifiIcon } from "lucide-react"

export default function Component() {
  return (
    <Card className="w-full border-orange-500/10">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">Dispositivos en Medidores de Electricidad</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Medición de Consumo</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Mide el consumo eléctrico en tiempo real, registrando voltaje y corriente.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Procesamiento de Datos</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Procesa la información recopilada, calculando el consumo en kilowatt-hora (kWh).</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Análisis de Patrones</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Analiza patrones de consumo, ayudando a identificar horas punta y consumos anómalos.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <WifiIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Transmisión de Datos</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Envía los datos a la compañía eléctrica, facilitando la facturación precisa y en tiempo real.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
            Estos dispositivos inteligentes ayudan a modernizar la red eléctrica,
            permitiendo una gestión más eficiente de la energía y proporcionando a los usuarios un mejor
            control sobre su consumo eléctrico.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
