"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/api/services/authService";
import { User, Hash, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginClientePage() {
  const router = useRouter();
  const [numeroCliente, setNumeroCliente] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ numeroCliente, password });
      
      console.log("Login response:", response);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.user._id,
        nombre: response.user.nombre,
        correo: response.user.correo,
        numeroCliente: response.user.numeroCliente,
        role: response.user.role,
        tipoUsuario: response.user.tipoUsuario,
        activo: response.user.activo,
        empresaId: response.user.empresaId
      }));
      localStorage.setItem("userType", "cliente");
      
      console.log("Redirigiendo a:", response.requiereCambioPassword ? "/cliente/cambiar-password" : "/cliente");
      
      if (response.requiereCambioPassword) {
        window.location.href = "/cliente/cambiar-password";
      } else {
        window.location.href = "/cliente";
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Portal Clientes</CardTitle>
          <CardDescription>
            Ingresa con tu número de cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="numeroCliente">Número de Cliente</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="numeroCliente"
                  type="text"
                  placeholder="1234567-8"
                  value={numeroCliente}
                  onChange={(e) => setNumeroCliente(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <a href="/" className="hover:text-blue-500">
                ← Volver al inicio
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
