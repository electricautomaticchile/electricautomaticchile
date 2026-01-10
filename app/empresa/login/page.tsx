"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authEmpresaService } from "@/lib/api/services/authEmpresaService";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginEmpresaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authEmpresaService.login({ email, password });
     
      localStorage.setItem("user", JSON.stringify({
        id: response.user._id,
        nombre: response.user.nombre,
        correo: response.user.correo,
        role: response.user.role,
        empresaId: response.user.empresaId,
        activo: response.user.activo,
        tipoCliente: response.user.tipoCliente
      }));
      localStorage.setItem("permisos", JSON.stringify(response.permisos));
      localStorage.setItem("userType", "empresa");
      
      setTimeout(() => {
        window.location.href = "/empresa";
      }, 100);
    } catch (err: any) {
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
            <div className="p-3 bg-orange-500 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Portal Empresas</CardTitle>
          <CardDescription>
            Ingresa con tu email corporativo
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <a href="/" className="hover:text-orange-500">
                ← Volver al inicio
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
