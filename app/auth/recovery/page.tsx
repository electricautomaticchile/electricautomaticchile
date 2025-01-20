"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type PasswordRecoveryProps = {}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/password-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Error al solicitar el restablecimiento.")
        return
      }

      setMessage("Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.")
    } catch (error: any) {
      setError("Error al solicitar el restablecimiento. Por favor, inténtalo de nuevo.")
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Recuperación de Contraseña</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="Ingresa tu correo electronico"
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar instrucciones
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PasswordRecovery

