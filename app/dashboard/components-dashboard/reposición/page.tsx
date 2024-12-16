"use client"
import { useState } from 'react'
import { useCliente } from '../reposición/hooks/useCliente'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { es } from 'date-fns/locale'

export default function ReposicionEnergia() {
  const [reposicionAutomatica, setReposicionAutomatica] = useState(false)
  const [fechaCorte, setFechaCorte] = useState<Date | undefined>(undefined)
  const { numeroCliente, setNumeroCliente, cliente, buscarCliente } = useCliente()
  const [horaCorte, setHoraCorte] = useState('')
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('')

  const handleReposicionAutomatica = (checked: boolean) => {
    if (cliente && cliente.deudaRegularizada) {
      setReposicionAutomatica(checked)
    } else {
      alert("No se puede activar la reposición automática debido a deudas pendientes.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reposición de Energía</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="numero-cliente">Número de Cliente</Label>
          <p className="text-sm text-muted-foreground">Ingrese los 5 dígitos del número de cliente</p>
          <div className="flex space-x-2">
            <Input
              id="numero-cliente"
              value={numeroCliente}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                setNumeroCliente(value);
              }}
              placeholder="Ingrese el número de cliente"
              maxLength={5}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button onClick={buscarCliente}>Buscar</Button>
          </div>
        </div>

        {cliente && (
          <div className="p-4 bg-muted rounded-md space-y-2">
            <h3 className="font-semibold mb-2">Información del Cliente</h3>
            <p>Nombre: {cliente.nombre}</p>
            <p>Dirección: {cliente.direccion}</p>
            <p>Deuda: ${cliente.deuda.toFixed(2)}</p>
            <p>Días de atraso: {cliente.diasAtraso}</p>
            <p>Estado de deuda: {cliente.deudaRegularizada ? 'Regularizada' : 'Pendiente'}</p>
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="reposicion-automatica"
                checked={reposicionAutomatica}
                onCheckedChange={handleReposicionAutomatica}
                disabled={!cliente.deudaRegularizada}
              />
              <Label htmlFor="reposicion-automatica">
                Reposición Automática
                {!cliente.deudaRegularizada && (
                  <span className="text-sm text-muted-foreground ml-2">(No disponible debido a deudas pendientes)</span>
                )}
              </Label>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Programar Corte de Servicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fechaCorte && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaCorte ? format(fechaCorte, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fechaCorte}
                onSelect={setFechaCorte}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {fechaCorte && (
          <div className="space-y-2">
            <Label htmlFor="hora-corte">Hora de Corte</Label>
            <Input
              id="hora-corte"
              type="time"
              className="w-full"
              value={horaCorte}
              onChange={(e) => setHoraCorte(e.target.value)}
            />
          </div>
        )}

        <Button 
          onClick={() => {
            if (fechaCorte && horaCorte) {
              setMensajeConfirmacion(`Corte de servicio programado para ${format(fechaCorte, "PPP", { locale: es })} a las ${horaCorte}`);
            }
          }}
          disabled={!fechaCorte || !horaCorte}
          className="mt-4"
        >
          Confirmar Corte de Servicio
        </Button>

        {mensajeConfirmacion && (
          <Alert>
            <AlertDescription>{mensajeConfirmacion}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

