"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FormularioContacto() {
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)
    // Aquí iría la lógica para enviar el formulario
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulación de envío
    setEnviando(false)
    setExito(true)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Contacto</h2>
        <p className="text-muted-foreground">Estamos aquí para ayudarte. Envíanos tu mensaje.</p>
      </div>
      {exito ? (
        <Alert>
          <AlertDescription>
            ¡Gracias por tu mensaje! Te responderemos pronto.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={manejarEnvio} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Ingresa tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" type="email" placeholder="Ingresa tu correo electronico" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Ingresa tu mensaje" className="min-h-[120px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileInput">Adjunta Archivo</Label>
            <Input  id="fileInput" name="file"  type="file" />
          </div>
          <Button type="submit" className="w-full" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      )}
    </div>
  )
}
