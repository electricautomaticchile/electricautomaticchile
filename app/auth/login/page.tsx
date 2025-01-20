"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [clientNumber, setClientNumber] = useState("")
  const [isValidFormat, setIsValidFormat] = useState(true)
  const [password, setPassword] = useState("")

  const validateClientNumber = (value: string) => {
    const regex = /^\d{6}-\d$/
    return regex.test(value)
  }

  const handleClientNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setClientNumber(value)
    setIsValidFormat(validateClientNumber(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        clientNumber,
        password,
        redirect: false,
      })
      
      if (result?.ok) {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error durante el login:', error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard'
      })
    } catch (error) {
      console.error('Error durante el login con Google:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen w-full max-w-md mx-auto space-y-6 py-40">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Autenticación</h2>
        <p className="text-muted-foreground">Inicia sesión para continuar.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="clientNumber">Número de cliente</Label>
            <Input
              id="clientNumber"
              type="text"
              placeholder="Ingresa tu Número de cliente (ej: 111111-1)"
              value={clientNumber}
              onChange={handleClientNumberChange}
              className={!isValidFormat && clientNumber ? "border-red-500" : ""}
            />
            {!isValidFormat && clientNumber && (
              <p className="text-red-500 text-sm mt-1">
                El formato debe ser XXXXXX-X (6 números, guion, 1 número)
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 py-2">
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
            </div>
          </div>
        </div>
        <Link href="#" className="underline" prefetch={false}>
          <div className="text-center text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?{" "}
          </div>
        </Link>
      </div>
    </form>
  )
}
