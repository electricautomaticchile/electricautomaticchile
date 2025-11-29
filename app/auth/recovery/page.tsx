"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
  KeyRound,
  Mail,
  User,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api/apiService";

export default function RecoveryPage() {
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Detectar si el input es email o número
  const isEmail = emailOrNumber.includes("@");
  const isValidInput = emailOrNumber.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidInput) {
      setError("Por favor ingrese su email o número de cliente");
      return;
    }

    setIsLoading(true);
    setError("");

    try {

      const response = await apiService.solicitarRecuperacion(emailOrNumber);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || "Error al solicitar recuperación");
      }
    } catch (error) {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
                ¡Solicitud Enviada!
              </CardTitle>
              <CardDescription className="text-green-700/70 dark:text-green-300/70">
                Revisa tu correo electrónico
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50 mb-6">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Si el email/número existe en nuestro sistema</strong>,
                  recibirás un enlace de recuperación en tu correo electrónico
                  en los próximos minutos.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      1
                    </span>
                  </div>
                  <div>
                    <strong>Revisa tu bandeja de entrada</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      El email puede tardar unos minutos en llegar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      2
                    </span>
                  </div>
                  <div>
                    <strong>Revisa spam/promociones</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      Si no lo encuentras, revisa otras carpetas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">
                      3
                    </span>
                  </div>
                  <div>
                    <strong>Haz clic en el enlace</strong>
                    <p className="text-gray-500 dark:text-gray-400">
                      El enlace expira en 10 minutos por seguridad
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  Solicitar otro enlace
                </Button>

                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <KeyRound className="h-10 w-10 text-white" />
          </div>
        </div>

        <Card className="border-orange-200 dark:border-orange-900/40 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-orange-100 dark:border-orange-900/30">
            <CardTitle className="text-2xl font-bold tracking-tight text-orange-700 dark:text-orange-500">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-orange-700/70 dark:text-orange-300/70">
              Ingresa tu email o número de cliente para restablecer tu
              contraseña
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
              <div className="space-y-2">
                <Label
                  htmlFor="emailOrNumber"
                  className="text-sm font-medium text-orange-800 dark:text-orange-300"
                >
                  Email o Número de Cliente
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500/70 dark:text-orange-500/80">
                    {isEmail ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <Input
                    id="emailOrNumber"
                    type="text"
                    placeholder="ejemplo@correo.com o 123456-7"
                    value={emailOrNumber}
                    onChange={(e) => {
                      setEmailOrNumber(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                    className="pl-10 border-orange-200 dark:border-orange-900/50 dark:bg-slate-800 dark:text-orange-100 focus-visible:ring-orange-500/50"
                  />
                </div>
                {emailOrNumber && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isEmail
                      ? "📧 Se enviará el enlace a este email"
                      : "📧 Se enviará el enlace al email asociado a este número"}
                  </p>
                )}
              </div>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Importante:</strong> El enlace de recuperación
                  expirará en 10 minutos por seguridad. Si no recibes el email,
                  revisa tu carpeta de spam.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white mt-6 shadow-md shadow-orange-500/20"
                disabled={isLoading || !isValidInput}
              >
                {isLoading
                  ? "Enviando enlace..."
                  : "Enviar Enlace de Recuperación"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:underline"
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
}
