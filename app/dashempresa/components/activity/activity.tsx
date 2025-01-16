import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Reposición #123</p>
              <p className="text-sm text-muted-foreground">Sector Norte - 15:30</p>
            </div>
            <div className="ml-auto font-medium text-green-500">Completado</div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Lectura Automática #456</p>
              <p className="text-sm text-muted-foreground">Sector Sur - 15:15</p>
            </div>
            <div className="ml-auto font-medium text-yellow-500">En Proceso</div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Alerta GPS #789</p>
              <p className="text-sm text-muted-foreground">Dispositivo desconectado</p>
            </div>
            <div className="ml-auto font-medium text-red-500">Urgente</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

