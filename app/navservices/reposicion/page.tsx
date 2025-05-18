"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, RefreshCw } from "lucide-react"

export default function Component() {

  return (
    <Card className="w-full border-orange-500/10">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">Reposición Automatizada de Energía</CardTitle>
        <CardDescription className="text-xs sm:text-sm">En este panel te ayudaremos a entender tu dashboard de sistema inteligente de gestión y reposición de energía</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold">Estado Actual de la reposición</h3>
            <CardDescription className="text-xs sm:text-sm">En este panel muestra el estado en el que está tu servicio de reposición automatizada. Viene activado por defecto pero también puedes desactivarlo si no estarás en casa/oficina por un periodo largo de tiempo.</CardDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-5">
          <CardTitle className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Historial de Reposición Automatizada</CardTitle>
          <CardDescription className="text-xs sm:text-sm">En este panel muestra el historial de las regularizaciones de tus deudas impagas y también la reposición del servicio automatizado</CardDescription>
          <div className="space-y-2">
            {[
              { time: '10:30 AM', source: '12 de septiembre', amount: 'Regulación de deuda' },
              { time: '02:15 PM', source: '12 de abril', amount: 'Regulación de deuda' },
              { time: '06:45 PM', source: '12 de mayo', amount: 'Regulación de deuda' },
              { time: '11:00 PM', source: '12 de Noviembre', amount: 'Regulación de deuda' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col xs:flex-row xs:items-center xs:justify-between bg-muted p-2 rounded-md text-xs sm:text-sm space-y-1 xs:space-y-0">
                <span>{item.time}</span>
                <span className="font-medium">{item.source}</span>
                <Badge variant="secondary" className="self-start xs:self-auto">{item.amount}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-5">
          <h3 className="text-base sm:text-lg font-semibold">Configuración de Reposición Automática</h3>
          <CardDescription className="text-xs sm:text-sm">Configura las opciones de tu sistema de reposición automatizada según tus necesidades</CardDescription>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span>Reposición nocturna</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span>Modo de ahorro en picos de demanda</span>
            <Switch />
          </div>
          <Button className="w-full text-xs sm:text-sm" variant="outline">
            <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Ajustes avanzados
          </Button>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-5">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Alertas y Notificaciones</h3>
          <CardDescription className="text-xs sm:text-sm">Recibe notificaciones sobre eventos importantes en tu sistema de reposición</CardDescription>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-600 bg-green-100 p-2 rounded-md text-xs sm:text-sm">
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span>Reposición automática programada para las 2:00 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
