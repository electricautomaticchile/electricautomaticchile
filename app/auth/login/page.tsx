"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function Component() {
  const [clientNumber, setClientNumber] = useState("")
  const [isValidFormat, setIsValidFormat] = useState(true)

  const validateClientNumber = (value: string) => {
    const regex = /^\d{6}-\d$/
    return regex.test(value)
  }

  const handleClientNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setClientNumber(value)
    setIsValidFormat(validateClientNumber(value))
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto space-y-6 py-60 ">
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
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>

        </div>
        <div className="flex flex-col gap-2 py-2">
        <Button onClick={() => signIn("google", { redirectTo: "/dashboard" })}>Iniciar sesión con Google.
        </Button>
        </div>
        <Link href="#" className="underline" prefetch={false}>
          <div className="text-center text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?{" "}
          </div>
        </Link>
      </div>
    </div>
  )
}
