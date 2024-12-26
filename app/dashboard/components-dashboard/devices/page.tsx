"use client"
import DeviceList from '@/app/dashboard/components-dashboard/devices/deviceslist'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Añadir declaración de módulo explícita
export {}

export default function DevicesPage() {
 
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Dispositivos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Perdidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold"></p>
          </CardContent>
        </Card>
      </div>
        <DeviceList />
    </div>
  )
}

