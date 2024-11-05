import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Cpu, BarChart2, WifiIcon } from "lucide-react"

export default function Component() {
  return (
    <Card className=" w-full max-w-2xl mb-32 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Arduino en Medidores de Electricidad en Chile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Zap className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <h3 className="font-semibold">Medición de Consumo</h3>
              <p className="text-sm text-muted-foreground">El Arduino mide el consumo eléctrico en tiempo real, registrando voltaje y corriente.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Cpu className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold">Procesamiento de Datos</h3>
              <p className="text-sm text-muted-foreground">Procesa la información recopilada, calculando el consumo en kilowatt-hora (kWh).</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <BarChart2 className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold">Análisis de Patrones</h3>
              <p className="text-sm text-muted-foreground">Analiza patrones de consumo, ayudando a identificar horas punta y consumos anómalos.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <WifiIcon className="h-6 w-6 text-purple-500 mt-1" />
            <div>
              <h3 className="font-semibold">Transmisión de Datos</h3>
              <p className="text-sm text-muted-foreground">Envía los datos a la compañía eléctrica, facilitando la facturación precisa y en tiempo real.</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            En Chile, estos medidores inteligentes basados en Arduino ayudan a modernizar la red eléctrica,
            permitiendo una gestión más eficiente de la energía y proporcionando a los usuarios un mejor
            control sobre su consumo eléctrico.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
