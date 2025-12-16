"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/shared";
import { AlertCircle, KeyRound } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api/apiService";

// Componente para el contenido de login
const LoginContent = () => {
  const [clientNumber, setClientNumber] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Obtener parámetros de la URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  // Mostrar error si viene en la URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setError(
        "Credenciales incorrectas. Por favor, verifique su información."
      );
    }
  }, [searchParams]);

  const validateClientNumber = (value: string) => {
    const regex = /^\d{6}-\d$/;
    return regex.test(value);
  };

  const handleClientNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remover todo excepto números
    value = value.replace(/[^\d]/g, "");

    // Limitar a 7 dígitos máximo
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    // Agregar guion automáticamente después del 6to dígito
    if (value.length > 6) {
      value = value.slice(0, 6) + "-" + value.slice(6);
    }

    setClientNumber(value);
    setIsValidFormat(validateClientNumber(value) || value === "" || value.length < 8);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!clientNumber || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    if (!isValidFormat) {
      setError("El formato del número de cliente es incorrecto");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login({
        email: clientNumber,
        password: password,
      });

      if (response.success && response.data) {
        const role = response.data.user.role;
        const type = response.data.user.type;

        if (role === "empresa" || type === "empresa") {
          window.location.href = "/empresa";
        } else if (role === "cliente" || type === "cliente") {
          window.location.href = "/cliente";
        } else {
          window.location.href = "/empresa";
        }
      } else {
        setError(response.error || "Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Portal de Clientes
            </CardTitle>
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
              <FormField
                label="Número de cliente"
                name="clientNumber"
                value={clientNumber}
                onChange={(value) => {
                  let val = String(value).replace(/[^\d]/g, "");
                  if (val.length > 7) val = val.slice(0, 7);
                  if (val.length > 6) val = val.slice(0, 6) + "-" + val.slice(6);
                  setClientNumber(val);
                  setIsValidFormat(validateClientNumber(val) || val === "" || val.length < 8);
                  if (error) setError("");
                }}
                error={!isValidFormat && clientNumber ? "El formato debe ser XXXXXX-X (6 números, guion, 1 número)" : undefined}
                placeholder="Formato: 111111-1"
                disabled={isLoading}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contraseña</span>
                  <Link
                    href="/auth/recovery"
                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                    prefetch={false}
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <FormField
                  label=""
                  name="password"
                  type="password"
                  value={password}
                  onChange={(value) => {
                    setPassword(value as string);
                    if (error) setError("");
                  }}
                  placeholder="Ingrese su contraseña"
                  disabled={isLoading}
                />
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
  );
};

// Componente para el esqueleto de carga
const LoginSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-pulse">
        <div className="w-full flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-orange-200 dark:bg-orange-800"></div>
        </div>
        <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );
};

// Componente principal que envuelve el contenido con Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
