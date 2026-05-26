"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { Building2, Mail, Lock, AlertCircle, ArrowLeft, Zap, Eye, EyeOff, HelpCircle } from "lucide-react";
import Link from "next/link";

function safeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/empresa/";
  }
  return value;
}

export default function LoginEmpresaPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showApiNotice = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/login/empresa", { email, password });
      
      const isProduction = window.location.protocol === "https:";
      const cookieOptions = `path=/; max-age=${24 * 60 * 60}; samesite=lax${isProduction ? "; secure" : ""}`;
      
      // Limpiar cookies anteriores
      document.cookie = `user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `permisos=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      // Setear solo datos no sensibles. La sesión real está en cookies HttpOnly.
      const user = data.user || data.data?.user;
      const permisos = data.permisos || data.data?.permisos;

      if (user) {
        document.cookie = `user_data=${encodeURIComponent(JSON.stringify({
          id: user._id || user.id, nombre: user.nombre, correo: user.correo,
          role: user.role || "empresa", tipoUsuario: "empresa",
          empresaId: user.empresaId || user._id || user.id, activo: user.activo,
        }))}; ${cookieOptions}`;
      }
      if (permisos) {
        document.cookie = `permisos=${encodeURIComponent(JSON.stringify(permisos))}; ${cookieOptions}`;
      }
      
      // Redirect con full page load
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
      window.location.replace(callbackUrl);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.error || err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-black lg:min-h-screen">
      {/* Left panel - brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 hero-grid-pattern opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10 text-center space-y-6 max-w-sm">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Portal <span className="text-gradient-orange">Empresas</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Gestiona clientes, dispositivos y estadísticas de consumo eléctrico desde un solo lugar.
          </p>
          <div className="space-y-3 text-left">
            {["Gestión de clientes", "Control de dispositivos", "Estadísticas avanzadas"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Zap className="h-3 w-3 text-orange-400" />
                </div>
                <span className="text-sm text-white/60">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-start justify-center px-5 pb-10 pt-8 sm:pt-12 lg:items-center lg:p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-7 w-7 text-orange-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Acceso Empresa</h1>
            <p className="text-sm text-white/40 mt-1">Ingresa con tu email corporativo</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-white/60 uppercase tracking-wide">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password" className="text-xs font-semibold text-white/60 uppercase tracking-wide">Contraseña</Label>
                <Link href="/recovery" className="text-xs font-semibold text-orange-400 hover:text-orange-300">
                  Recuperar
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl h-11"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-orange-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
            <div className="flex gap-3">
              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              <div>
                <p className="font-medium text-white/70">¿Problemas para entrar?</p>
                <Link href="/formulario" className="mt-1 inline-block text-orange-400 hover:text-orange-300">
                  Contactar soporte
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-orange-400 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
