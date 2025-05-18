"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, KeyRound, User, LockKeyhole } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [clientNumber, setClientNumber] = useState("")
  const [isValidFormat, setIsValidFormat] = useState(true)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateClientNumber = (value: string) => {
    const regex = /^\d{6}-\d$/
    return regex.test(value)
  }

  const handleClientNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setClientNumber(value)
    setIsValidFormat(validateClientNumber(value) || value === "")
    if (error) setError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones
    if (!clientNumber || !password) {
      setError("Por favor complete todos los campos")
      return
    }
    
    if (!isValidFormat) {
      setError("El formato del número de cliente es incorrecto")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await signIn('credentials', {
        clientNumber,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        setError("Credenciales incorrectas. Por favor, verifique su información.")
      } else if (result?.ok) {
        window.location.href = '/dashboard-empresa'
      }
    } catch (error) {
      setError("Error al iniciar sesión. Intente nuevamente.")
      console.error('Error durante el login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard-empresa'
      })
    } catch (error) {
      console.error('Error durante el login con Google:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <KeyRound className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <Card className="border-orange-200 dark:border-orange-900/40 shadow-xl ">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-orange-100 dark:border-orange-900/30">
            <CardTitle className="text-2xl font-bold tracking-tight text-orange-700 dark:text-orange-500">Portal de Clientes</CardTitle>
            <CardDescription className="text-orange-700/70 dark:text-orange-300/70">
              Ingrese sus credenciales para acceder a su cuenta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 text-sm p-3 rounded-md mb-5 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="clientNumber" className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  Número de cliente
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500/70 dark:text-orange-500/80">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="clientNumber"
                    type="text"
                    placeholder="Formato: 111111-1"
                    value={clientNumber}
                    onChange={handleClientNumberChange}
                    className={`pl-10 ${!isValidFormat && clientNumber ? "border-destructive focus-visible:ring-destructive/30" : "border-orange-200 dark:border-orange-900/50"} dark:bg-slate-800 dark:text-orange-100 focus-visible:ring-orange-500/50`}
                  />
                </div>
                {!isValidFormat && clientNumber && (
                  <p className="text-destructive text-xs mt-1">
                    El formato debe ser XXXXXX-X (6 números, guion, 1 número)
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Contraseña
                  </Label>
                  <Link href="/auth/recovery" className="text-xs text-orange-600 dark:text-orange-400 hover:underline" prefetch={false}>
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500/70 dark:text-orange-500/80">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 border-orange-200 dark:border-orange-900/50 dark:bg-slate-800 dark:text-orange-100 focus-visible:ring-orange-500/50"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white mt-6 shadow-md shadow-orange-500/20" 
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
