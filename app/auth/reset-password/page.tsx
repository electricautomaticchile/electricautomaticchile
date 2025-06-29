"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/lib/api/apiService";

// Componente principal del contenido
const ResetPasswordContent = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados de validación
  const [validations, setValidations] = useState({
    minLength: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log("🔐 Token recibido:", tokenFromUrl.substring(0, 10) + "...");
      setTokenValid(true); // Asumimos que es válido inicialmente
    } else {
      console.log("❌ No se encontró token en la URL");
      setTokenValid(false);
      setError("Token no válido. Solicita un nuevo enlace de recuperación.");
    }
  }, [searchParams]);

  // Validaciones en tiempo real
  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 8,
      passwordsMatch: newPassword === confirmPassword && newPassword.length > 0,
    });
  }, [newPassword, confirmPassword]);

  const allValidationsPass =
    validations.minLength && validations.passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token no válido");
      return;
    }

    if (!allValidationsPass) {
      setError("Por favor corrige los errores de validación");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Restableciendo contraseña...");

      const response = await apiService.restablecerPassword(token, newPassword);

      if (response.success) {
        console.log("✅ Contraseña restablecida exitosamente");
        setSuccess(true);
      } else {
        console.error("❌ Error al restablecer:", response.error);
        setError(response.error || "Error al restablecer contraseña");

        // Si el token es inválido, marcar como tal
        if (
          response.error?.includes("inválido") ||
          response.error?.includes("expirado")
        ) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      console.error("💥 Error inesperado:", error);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-full flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>

          <Card className="border-green-200 dark:border-green-900/40 shadow-xl">
            <CardHeader className="space-y-2 text-center pb-6 border-b border-green-100 dark:border-green-900/30">
              <CardTitle className="text-2xl font-bold tracking-tight text-green-700 dark:text-green-500">
                ¡Contraseña Restablecida!
              </CardTitle>
              <CardDescription className="text-green-700/70 dark:text-green-300/70">
                Tu contraseña ha sido actualizada exitosamente
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50 mb-6">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Tu contraseña ha sido restablecida exitosamente. Ya puedes
                  iniciar sesión con tu nueva contraseña.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      ✓
                    </span>
                  </div>
                  <div>
                    <strong>Nueva contraseña activa</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      Tu contraseña anterior ya no es válida
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      ✓
                    </span>
                  </div>
                  <div>
                    <strong>Sesiones cerradas</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      Por seguridad, se han cerrado todas las sesiones activas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      ✓
                    </span>
                  </div>
                  <div>
                    <strong>Token usado</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      El enlace de recuperación ya no es válido
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  Iniciar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Token inválido
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-200 dark:border-red-900/40 shadow-xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-red-700 dark:text-red-500">
                Enlace No Válido
              </CardTitle>
              <CardDescription className="text-red-700/70 dark:text-red-300/70">
                Este enlace de recuperación no es válido o ha expirado
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  El enlace de recuperación puede haber expirado (10 minutos) o
                  ya haber sido usado. Solicita un nuevo enlace para continuar.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/auth/recovery")}
                  className="w-full"
                >
                  Solicitar Nuevo Enlace
                </Button>

                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="outline"
                  className="w-full"
                >
                  Volver al Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-900/40 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-blue-100 dark:border-blue-900/30">
            <CardTitle className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-500">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-blue-700/70 dark:text-blue-300/70">
              Ingresa tu nueva contraseña segura
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-blue-800 dark:text-blue-300"
                >
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                    className="pr-10 border-blue-200 dark:border-blue-900/50 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500/70 hover:text-blue-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${validations.minLength ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span
                    className={
                      validations.minLength ? "text-green-600" : "text-gray-500"
                    }
                  >
                    Mínimo 8 caracteres
                  </span>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-blue-800 dark:text-blue-300"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                    className="pr-10 border-blue-200 dark:border-blue-900/50 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500/70 hover:text-blue-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${validations.passwordsMatch ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span
                    className={
                      validations.passwordsMatch
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Las contraseñas coinciden
                  </span>
                </div>
              </div>

              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50">
                <Shield className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <strong>Consejo de seguridad:</strong> Usa una combinación de
                  letras, números y símbolos. Evita información personal como
                  fechas de nacimiento o nombres.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white mt-6 shadow-md shadow-blue-500/20"
                disabled={isLoading || !allValidationsPass}
              >
                {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                prefetch={false}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Esqueleto de carga
const ResetPasswordSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-pulse">
        <div className="w-full flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-200 dark:bg-blue-800"></div>
        </div>
        <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );
};

// Componente principal con Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
