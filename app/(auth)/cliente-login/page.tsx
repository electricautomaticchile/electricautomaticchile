"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { User, CreditCard, Lock, AlertCircle, ArrowLeft, Zap, Eye, EyeOff, HelpCircle } from "lucide-react";
import Link from "next/link";

function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

function safeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/cliente/";
  }
  return value;
}

export default function LoginClientePage() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showApiNotice = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(formatRut(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/login", { rut, password });
      const user = data.user || data.data?.user;
      const requiereCambioPassword = data.requiereCambioPassword ?? data.data?.requiereCambioPassword;

      if (!user) {
        throw new Error("Login exitoso, pero la respuesta no incluyó datos de usuario");
      }

      const isProduction = window.location.protocol === "https:";
      const cookieOptions = `path=/; max-age=${24 * 60 * 60}; samesite=lax${isProduction ? "; secure" : ""}`;

      document.cookie = `user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `permisos=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `requiereCambioPassword=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      document.cookie = `user_data=${encodeURIComponent(JSON.stringify({
        id: user._id || user.id, nombre: user.nombre, correo: user.correo,
        numeroCliente: user.numeroCliente, role: user.role || "cliente",
        tipoUsuario: "cliente", empresaId: user.empresaId, activo: user.activo,
      }))}; ${cookieOptions}`;

      if (requiereCambioPassword) {
        document.cookie = `requiereCambioPassword=true; ${cookieOptions}`;
      }

      // Full page redirect para que el middleware de Next.js verifique la cookie
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      window.location.replace(safeCallbackUrl(callbackUrl));
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || "Error al iniciar sesión";
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
            Portal <span className="text-gradient-orange">Clientes</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Monitorea tu consumo eléctrico, gestiona pagos y controla tu servicio en tiempo real.
          </p>
          <div className="space-y-3 text-left">
            {["Consumo en tiempo real", "Historial de pagos", "Control remoto del servicio"].map((f) => (
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
              <User className="h-7 w-7 text-orange-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Bienvenido</h1>
            <p className="text-sm text-white/40 mt-1">Ingresa con tu RUT para continuar</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="rut" className="text-xs font-semibold text-white/60 uppercase tracking-wide">RUT</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={handleRutChange}
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
