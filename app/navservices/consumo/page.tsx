import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Battery, Zap, Wifi } from "lucide-react"

export default function Component() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Consumo de Energía</CardTitle>
        <CardDescription>
          Este panel te ayuda a entender el monitoreo y optimización de tu consumo de energía en que se muestra en tu dashboard con tus datos en tiempo real,
          ayudándote a reducir costos y mejorar la eficiencia energética de tu hogar o negocio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consumo Actual</h3>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">2.4 kWh</span>
            </div>
            <CardDescription>
              Muestra tu consumo de energía en tiempo real. Te ayuda a identificar picos de consumo
              y a tomar decisiones inmediatas para reducir el gasto energético.
            </CardDescription>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Telemetría</h3>
            <div className="flex items-center space-x-2">
              <Wifi className="h-6 w-6 text-blue-500" />
              <span className="text-sm">Datos en tiempo real activados</span>
            </div>
            <CardDescription>
              Proporciona acceso remoto a tus datos de consumo energético. Te permite monitorear
              y analizar tu uso de energía desde cualquier lugar, facilitando la toma de decisiones informadas.
            </CardDescription>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Gráfico de Consumo Semanal</h3>
          <div className="h-64 bg-muted rounded-md flex items-end justify-around p-4">
            {[40, 60, 45, 55, 70, 50, 65].map((height, index) => (
              <div
                key={index}
                className="bg-primary w-8 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>
          <CardDescription className="mt-2">
            Visualiza tu consumo de energía a lo largo de la semana. Esta gráfica te ayuda a
            identificar patrones de uso y días de mayor consumo, permitiéndote ajustar tus hábitos
            para una mayor eficiencia energética.
          </CardDescription>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Consejos de Optimización</h3>
          <CardDescription className="mb-2">
            Recomendaciones prácticas para reducir tu consumo de energía y maximizar la eficiencia
            energética en tu hogar o negocio.
          </CardDescription>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>Utiliza electrodomésticos de alta eficiencia energética</li>
            <li>Programa los dispositivos para funcionar en horas de baja demanda</li>
            <li>Aprovecha la luz natural y utiliza iluminación LED</li>
            <li>Mantén los sistemas de climatización en temperaturas óptimas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
