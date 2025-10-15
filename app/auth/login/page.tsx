"use client";
import { useState, useEffect, Suspense } from "react";
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
import { AlertCircle, KeyRound, User, LockKeyhole } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api/apiService";

// ============================================
// USUARIO DE DESARROLLO (SOLO MODO LOCAL)
// ============================================
const DEV_USER = {
  numeroCliente: "000000-0",
  password: "dev123456",
};

const DEV_USER_DATA = {
  superadmin: {
    id: "dev-superadmin-001",
    name: "Admin Desarrollo",
    email: "admin@dev.local",
    numeroCliente: "000000-0",
    type: "superadmin",
    role: "superadmin",
  },
  empresa: {
    id: "dev-empresa-001",
    name: "Empresa Desarrollo",
    email: "empresa@dev.local",
    numeroCliente: "000000-0",
    type: "empresa",
    role: "empresa",
  },
  cliente: {
    id: "dev-cliente-001",
    name: "Cliente Desarrollo",
    email: "cliente@dev.local",
    numeroCliente: "000000-0",
    type: "cliente",
    role: "cliente",
  },
};

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

    // ============================================
    // ✨ MODO DESARROLLO: Login sin backend
    // ============================================
    if (
      process.env.NODE_ENV === "development" &&
      clientNumber === DEV_USER.numeroCliente &&
      password === DEV_USER.password
    ) {
      console.log("🔧 Modo desarrollo: Login sin backend activado");

      // Determinar tipo de usuario según la URL de callback
      let userType: "empresa" | "cliente" = "empresa";

      if (callbackUrl.includes("dashboard-cliente")) {
        userType = "cliente";
      } else {
        userType = "empresa";
      }

      const userData = DEV_USER_DATA[userType];

      // Crear token mock con estructura JWT válida
      const mockToken = btoa(JSON.stringify({
        sub: userData.id,
        userId: userData.id,
        email: userData.email,
        numeroCliente: userData.numeroCliente,
        role: userData.role,
        type: userData.type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
      }));

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Guardar en cookies para el middleware
        document.cookie = `auth_token=${mockToken}; path=/; max-age=3600; SameSite=Lax`;
      }

      // Redirigir según tipo
      const redirectPath =
        userType === "empresa" ? "/dashboard-empresa" :
          "/dashboard-cliente";

      console.log("🔗 Redirigiendo a:", redirectPath);
      console.log("✅ Token guardado en localStorage y cookies");

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);

      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🚀 Iniciando login...");

      // Usar nuestro apiService en lugar de NextAuth
      const response = await apiService.login({
        email: clientNumber, // El backend busca por número de cliente en el campo email
        password: password,
      });

      console.log(
        "📡 Respuesta completa del backend:",
        JSON.stringify(response, null, 2)
      );

      if (response.success && response.data) {
        console.log("✅ Login exitoso:", response.data);

        // Verificar si requiere cambio de contraseña
        if (response.data.requiereCambioPassword) {
          console.log("⚠️ Usuario requiere cambio de contraseña");

          // Guardar datos del usuario (el token ya se guarda automáticamente por apiService)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("requiereCambioPassword", "true");
          }

          // Redirigir al dashboard pero con flag de cambio de contraseña
          const targetUrl = callbackUrl || "/dashboard-empresa";

          console.log(
            "🔗 Redirigiendo con cambio de contraseña requerido:",
            targetUrl
          );

          try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            await router.push(targetUrl);
            console.log(
              "✅ Router.push ejecutado (requiere cambio de contraseña)"
            );
          } catch (routerError) {
            console.error("❌ Error con router.push:", routerError);
            window.location.href = targetUrl;
          }

          return;
        }

        // Redirigir según el tipo de usuario (login normal)
        // Obtener tipo de usuario y rol, con fallbacks para compatibilidad
        const tipoUsuario =
          response.data.user.type || (response.data.user as any).tipoUsuario;
        const role = response.data.user.role;

        console.log("🎯 Datos del usuario para redirección:", {
          tipoUsuario,
          role,
          nombre: response.data.user.name || (response.data.user as any).nombre,
          fullUserData: response.data.user,
          responseData: response.data,
        });

        let redirectPath = "/dashboard-empresa"; // default

        // Lógica de redirección mejorada
        if (role === "cliente" || tipoUsuario === "cliente") {
          redirectPath = "/dashboard-cliente";
          console.log("👤 Usuario cliente detectado");
        } else if (role === "empresa" || tipoUsuario === "empresa") {
          redirectPath = "/dashboard-empresa";
          console.log("🏢 Usuario empresa detectado");
        }

        console.log("📍 Path calculado:", redirectPath);

        // Usar callbackUrl si existe, sino usar redirectPath
        const targetUrl = callbackUrl || redirectPath;

        console.log("🔗 URL final de redirección:", targetUrl);

        // Guardar datos del usuario (el token ya se guarda automáticamente por apiService)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Redirección INMEDIATA usando window.location para mayor confiabilidad
        console.log(
          "🚀 Ejecutando redirección inmediata con window.location..."
        );

        // Usar window.location.href directamente para garantizar la redirección
        setTimeout(() => {
          console.log("🔄 Redirigiendo a:", targetUrl);
          window.location.href = targetUrl;
        }, 500); // Dar tiempo para que se guarden los datos
      } else {
        console.error("❌ Error en respuesta:", response);
        setError(
          response.error ||
          "Credenciales incorrectas. Por favor, verifique su información."
        );
      }
    } catch (error) {
      console.error("💥 Error durante el login:", error);
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
              <div className="space-y-2">
                <Label
                  htmlFor="clientNumber"
                  className="text-sm font-medium text-orange-800 dark:text-orange-300"
                >
                  Número de cliente
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500/70 dark:text-orange-500/80">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="clientNumber"
                    type="text"
                    placeholder="Formato: 111111-1"
                    value={clientNumber}
                    onChange={handleClientNumberChange}
                    disabled={isLoading}
                    className={`pl-10 ${!isValidFormat && clientNumber ? "border-destructive focus-visible:ring-destructive/30" : "border-orange-200 dark:border-orange-900/50"} dark:bg-slate-800 dark:text-orange-100 focus-visible:ring-orange-500/50`}
                  />
                </div>
                {!isValidFormat && clientNumber && (
                  <p className="text-destructive text-xs mt-1">
                    El formato debe ser XXXXXX-X (6 números, guion, 1 número)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-orange-800 dark:text-orange-300"
                  >
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/recovery"
                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                    prefetch={false}
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500/70 dark:text-orange-500/80">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    className="pl-10 border-orange-200 dark:border-orange-900/50 dark:bg-slate-800 dark:text-orange-100 focus-visible:ring-orange-500/50"
                  />
                </div>
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
