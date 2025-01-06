"use client"
import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FormularioContacto() {
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre,
      email,
      mensaje,
      // archivo: formData.get('file'), // Si decides manejar el archivo
    };

    // Enviar los datos a la API
    const response = await fetch('/api/envioformulario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alert("Error al enviar el formulario.");
    }

    setEnviando(false);
    setExito(true);
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
            <Input id="name" placeholder="Ingresa tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" type="email" placeholder="Ingresa tu correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Ingresa tu mensaje" className="min-h-[120px]" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
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
