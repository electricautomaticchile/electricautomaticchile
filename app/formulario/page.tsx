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

    const formData = new FormData(e.currentTarget); // Captura los datos del formulario

    // Validar el tamaño del archivo
    const archivo = formData.get('file') as File;
    if (archivo && archivo.size > 10 * 1024 * 1024) { // 10 MB
        alert("El archivo debe ser menor de 10 MB.");
        setEnviando(false);
        return;
    }

    // Enviar los datos a la API
    await fetch('/api/enviarformulario', {
        method: 'POST',
        body: formData, // Enviar formData directamente
    })

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
          <div className="space-y-2">
            <Label htmlFor="file">Archivo</Label>
            <Input id="file" type="file" />
          </div>
          <Button type="submit" className="w-full" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      )}
    </div>
  )
}
