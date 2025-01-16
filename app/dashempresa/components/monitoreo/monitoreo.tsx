import { Activity, AlertTriangle, BatteryCharging, Clock, FileText, Power, Signal, Zap } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const monitoringData = [
  { hora: "00:00", consumo: 45, reposiciones: 2 },
  { hora: "02:00", consumo: 38, reposiciones: 1 },
  { hora: "04:00", consumo: 42, reposiciones: 0 },
  { hora: "06:00", consumo: 56, reposiciones: 3 },
  { hora: "08:00", consumo: 72, reposiciones: 5 },
  { hora: "10:00", consumo: 85, reposiciones: 4 },
  { hora: "12:00", consumo: 78, reposiciones: 3 },
  { hora: "14:00", consumo: 89, reposiciones: 2 },
  { hora: "16:00", consumo: 95, reposiciones: 4 },
  { hora: "18:00", consumo: 86, reposiciones: 3 },
  { hora: "20:00", consumo: 72, reposiciones: 2 },
  { hora: "22:00", consumo: 58, reposiciones: 1 },
]

export function MonitoringSection() {
  const currentEfficiency = 82.5
  const getStatusLevel = (value: number) => {
    if (value < 30) return "Crítico"
    if (value < 50) return "En Riesgo"
    if (value < 70) return "Regular"
    if (value < 90) return "Bueno"
    return "Excelente"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Monitoreo del Sistema</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Estado del Sistema de Automatización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-8">
              <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-8 border-muted">
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">{currentEfficiency}%</span>
                  <span className="text-sm text-muted-foreground">{getStatusLevel(currentEfficiency)}</span>
                </div>
                <div className="absolute inset-0">
                  <Progress value={currentEfficiency} className="h-2 w-full rounded-full" />
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Tiempo Promedio Reposición"
                    value="45"
                    unit="min"
                    description="Reducción del 60% en tiempo de espera"
                    icon={Clock}
                    trend="decrease"
                  />
                  <MetricCard
                    title="Lecturas Automáticas"
                    value="1,234"
                    unit="medidores"
                    description="99.8% de precisión en lecturas"
                    icon={Signal}
                    trend="increase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Cortes Programados"
                    value="28"
                    unit="pendientes"
                    description="Por falta de pago"
                    icon={Power}
                    trend="neutral"
                  />
                  <MetricCard
                    title="Alertas del Sistema"
                    value="12"
                    unit="activas"
                    description="3 requieren atención inmediata"
                    icon={AlertTriangle}
                    trend="increase"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Monitoreo en Tiempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Estado GPS</span>
                  </div>
                  <span className="text-sm text-green-500">Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Última Lectura</span>
                  </div>
                  <span className="text-sm">Hace 5 minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BatteryCharging className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Batería Dispositivo</span>
                  </div>
                  <span className="text-sm">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Consumo Actual</span>
                  </div>
                  <span className="text-sm">2.4 kWh</span>
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monitoringData}>
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar name="Consumo (kWh)" dataKey="consumo" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar name="Reposiciones" dataKey="reposiciones" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  unit: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: "increase" | "decrease" | "neutral"
}) {
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

