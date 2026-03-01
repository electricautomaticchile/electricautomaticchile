"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { User, Hash, Lock, AlertCircle } from "lucide-react";

export default function LoginClientePage() {
  const [numeroCliente, setNumeroCliente] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await apiClient.post('/api/auth/login', { numeroCliente, password });

      const isProduction = window.location.protocol === 'https:';
      const cookieOptions = `path=/; max-age=${24 * 60 * 60}; samesite=lax${isProduction ? '; secure' : ''}`;

      document.cookie = `auth_token=${encodeURIComponent(data.token)}; ${cookieOptions}`;
      document.cookie = `refresh_token=${encodeURIComponent(data.refreshToken)}; ${cookieOptions}`;
      document.cookie = `user_data=${encodeURIComponent(JSON.stringify({
        id: data.user._id,
        nombre: data.user.nombre,
        correo: data.user.correo,
        numeroCliente: data.user.numeroCliente,
        role: data.user.role || 'cliente',
        tipoUsuario: 'cliente',
        activo: data.user.activo,
      }))}; ${cookieOptions}`;

      if (data.requiereCambioPassword) {
        document.cookie = `requiereCambioPassword=true; ${cookieOptions}`;
      }

      window.location.href = "/cliente";
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-500 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Portal Clientes</CardTitle>
          <CardDescription>Ingresa con tu número de cliente</CardDescription>
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
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            <div className="text-center text-sm text-gray-600">
              <a href="/" className="hover:text-orange-500">← Volver al inicio</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
