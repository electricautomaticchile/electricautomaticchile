"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { User, CreditCard, Lock, AlertCircle, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

export default function LoginClientePage() {
  const router = useRouter();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(formatRut(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/login", { rut, password });
      const isProduction = window.location.protocol === "https:";
      const cookieOptions = `path=/; max-age=${24 * 60 * 60}; samesite=lax${isProduction ? "; secure" : ""}`;
      // Limpiar token anterior primero
      document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `auth_token=${encodeURIComponent(data.token)}; ${cookieOptions}`;
      document.cookie = `refresh_token=${encodeURIComponent(data.refreshToken)}; ${cookieOptions}`;
      document.cookie = `user_data=${encodeURIComponent(JSON.stringify({
        id: data.user._id, nombre: data.user.nombre, correo: data.user.correo,
        numeroCliente: data.user.numeroCliente, role: data.user.role || "cliente",
        tipoUsuario: "cliente", activo: data.user.activo,
      }))}; ${cookieOptions}`;
      if (data.requiereCambioPassword) {
        document.cookie = `requiereCambioPassword=true; ${cookieOptions}`;
      }
      // Pequeño delay para asegurar que las cookies se escriban antes del redirect
      await new Promise(r => setTimeout(r, 50));
      router.replace("/cliente");
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left panel — brand */}
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

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6 lg:hidden">
            </div>
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
              <Label htmlFor="password" className="text-xs font-semibold text-white/60 uppercase tracking-wide">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl h-11"
                  required
                />
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
