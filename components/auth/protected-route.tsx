"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/hooks/useApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedUserTypes?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  allowedUserTypes = [],
  redirectTo = "/auth/login",
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useApi();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Si no requiere autenticación, permitir acceso
    if (!requireAuth) {
      setIsAuthorized(true);
      return;
    }

    // Si requiere auth pero no está autenticado
    if (!isAuthenticated || !user) {
      const currentPath = window.location.pathname;
      router.push(
        `${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`
      );
      return;
    }

    // Verificar roles si se especificaron
    if (allowedRoles.length > 0) {
      const hasValidRole = allowedRoles.some(
        (role) => user.role === role || (user as any).tipoUsuario === role
      );

      if (!hasValidRole) {
        setAuthError(
          `Acceso denegado. Rol requerido: ${allowedRoles.join(", ")}`
        );
        return;
      }
    }

    // Verificar tipos de usuario si se especificaron
    if (allowedUserTypes.length > 0) {
      // Usar type o tipoUsuario para compatibilidad
      const userType = user.type || (user as any).tipoUsuario;
      const hasValidType = allowedUserTypes.some(
        (type) => userType === type || user.role === type
      );

      if (!hasValidType) {
        setAuthError(
          `Acceso denegado. Tipo de usuario requerido: ${allowedUserTypes.join(
            ", "
          )}`
        );
        return;
      }
    }

    // Si llegó hasta aquí, está autorizado
    setIsAuthorized(true);
    setAuthError(null);
  }, [
    isLoading,
    isAuthenticated,
    user,
    allowedRoles,
    allowedUserTypes,
    requireAuth,
    router,
    redirectTo,
  ]);

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de autorización
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full px-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <strong>Acceso Restringido</strong>
              <br />
              {authError}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autorizado y no hay error específico, no mostrar nada
  if (!isAuthorized) {
    return null;
  }

  // Usuario autorizado, mostrar contenido
  return <>{children}</>;
}

// HOC para proteger páginas específicas
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, "children"> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Componentes específicos para cada tipo de dashboard
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedUserTypes={["admin", "superadmin"]}
      allowedRoles={["admin", "superadmin"]}
    >
      {children}
    </ProtectedRoute>
  );
}

export function ClienteRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserTypes={["cliente"]} allowedRoles={["cliente"]}>
      {children}
    </ProtectedRoute>
  );
}

export function EmpresaRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserTypes={["empresa"]} allowedRoles={["empresa"]}>
      {children}
    </ProtectedRoute>
  );
}
