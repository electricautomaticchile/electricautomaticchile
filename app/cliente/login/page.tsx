"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api/client";
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
      const response = await apiClient.post('/api/auth/login', { numeroCliente, password });
      
      if (response.data) {
        const userData = response.data.user;
        const token = response.data.token;
        const requiereCambioPassword = response.data.requiereCambioPassword;
        
        if (typeof window !== 'undefined') {
          const isProduction = window.location.protocol === 'https:';
          
          const tokenOptions = [
            `auth_token=${token}`,
            'path=/',
            `max-age=${24 * 60 * 60}`,
            'samesite=strict',
          ];
          if (isProduction) {
            tokenOptions.push('secure');
          }
          document.cookie = tokenOptions.join('; ');
          
          const userOptions = [
            `user_data=${encodeURIComponent(JSON.stringify({
              id: userData._id,
              _id: userData._id,
              nombre: userData.nombre,
              correo: userData.correo,
              numeroCliente: userData.numeroCliente,
              role: userData.role,
              tipoUsuario: userData.tipoUsuario,
              activo: userData.activo,
            }))}`,
            'path=/',
            `max-age=${24 * 60 * 60}`,
            'samesite=strict',
          ];
          if (isProduction) {
            userOptions.push('secure');
          }
          document.cookie = userOptions.join('; ');
          
          if (requiereCambioPassword) {
            const cambioOptions = [
              `requiereCambioPassword=true`,
              'path=/',
              `max-age=${24 * 60 * 60}`,
              'samesite=strict',
            ];
            if (isProduction) {
              cambioOptions.push('secure');
            }
            document.cookie = cambioOptions.join('; ');
          }
        }
        
        window.location.href = "/cliente";
      }
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
