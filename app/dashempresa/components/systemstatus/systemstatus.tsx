import { MapPin, Power } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface MetricCardProps {
  title: string
  value: string
  unit: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: "increase" | "decrease" | "neutral"
}

function MetricCard({ title, value, unit, description, icon: Icon, trend }: MetricCardProps) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increase":
        return "text-green-500"
      case "decrease":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex items-center space-x-4 rounded-lg border p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className={`text-xs ${getTrendColor(trend)}`}>{description}</p>
      </div>
    </div>
  )
}

export function SystemStatus() {
  const systemEfficiency = 82.5
  
  const getStatusLevel = (value: number) => {
    if (value < 30) return "Crítico"
    if (value < 50) return "En Riesgo"
    if (value < 70) return "Regular"
    if (value < 90) return "Bueno"
    return "Excelente"
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Estado del Sistema de Automatización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-8 border-muted">
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold">{systemEfficiency}%</span>
              <span className="text-sm text-muted-foreground">{getStatusLevel(systemEfficiency)}</span>
            </div>
            <div className="absolute inset-0">
              <Progress value={systemEfficiency} className="h-2 w-full rounded-full" />
            </div>
          </div>
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="GPS Activos"
                value="1,234"
                unit="dispositivos"
                description="100% de cobertura"
                icon={MapPin}
                trend="increase"
              />
              <MetricCard
                title="Cortes Programados"
                value="28"
                unit="pendientes"
                description="Por falta de pago"
                icon={Power}
                trend="neutral"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

