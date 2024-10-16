import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, RefreshCw } from "lucide-react"

export default function Component() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reposición Automatizada de Energía</CardTitle>
        <CardDescription>En este panel te ayudaremos a entender tu dashboard de sistema inteligente de gestión y reposición de energía</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold">Estado Actual de la reposición</h3>
            <CardDescription>En este panel muestra el estado en el que esta tu servicio de reposición automatizada viene activado por defecto pero tambien puedes desactivarlo por si no estas en casa/oficina por un periodo largo de tiempo</CardDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-2">
                  <Switch checked={true} />
                  <span>Activo</span>
                </div>
              </div>
                <Switch checked={false}  />
                <span>Desactivado</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5 ">
          <CardTitle className="text-lg font-semibold mb-4">Historial de Reposición Automatizada</CardTitle>
          <CardDescription >En este panel muestra el historial de las regularizaciones de tus deudas impagas y tambien la reposición del servicio automatizado </CardDescription>
          <div className="space-y-2">
            {[
              { time: '10:30 AM', source: '12 de septiembre', amount: 'Regulación de deuda' },
              { time: '02:15 PM', source: '12 de abril', amount: 'Regulación de deuda' },
              { time: '06:45 PM', source: '12 de mayo', amount: 'Regulación de deuda' },
              { time: '11:00 PM', source: '12 de Noviembre', amount: 'Regulación de deuda' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm">{item.time}</span>
                <span className="text-sm font-medium">{item.source}</span>
                <Badge variant="secondary">{item.amount}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <h3 className="text-lg font-semibold">Configuración de Reposición Automática</h3>
          <CardDescription>En este panel te ayudaremos a entender tu dashboard de sistema inteligente de gestión y reposición de energía</CardDescription>
          <div className="flex items-center justify-between">
            <span>Reposición nocturna</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Modo de ahorro en picos de demanda</span>
            <Switch />
          </div>
          <Button className="w-full" variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Ajustes avanzados
          </Button>
        </div>

        <div className="mt-8 space-y-5">
          <h3 className="text-lg font-semibold mb-4">Alertas y Notificaciones</h3>
          <CardDescription>En este panel te ayudaremos a entender tu dashboard de sistema inteligente de gestión y reposición de energía</CardDescription>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-600 bg-green-100 p-2 rounded-md">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm">Reposición automática programada para las 2:00 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
