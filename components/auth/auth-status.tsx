"use client";

import { useApi } from "@/lib/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuthStatus() {
  const { user, isAuthenticated, logout } = useApi();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/auth/login")}
      >
        Iniciar Sesión
      </Button>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string, type?: string) => {
    // Verificar primero el rol
    switch (role) {
      case "admin":
      case "superadmin":
        return "destructive";
      case "empresa":
        return "default";
      case "cliente":
        return "secondary";
    }

    // Si no hay coincidencia por rol, verificar por tipo
    if (type) {
      switch (type) {
        case "admin":
        case "superadmin":
          return "destructive";
        case "empresa":
          return "default";
        case "cliente":
          return "secondary";
      }
    }

    // Valor por defecto
    return "outline";
  };

  const getRoleIcon = (role: string, type?: string) => {
    // Verificar primero el rol
    switch (role) {
      case "admin":
      case "superadmin":
        return <Shield className="h-3 w-3" />;
      case "empresa":
        return <User className="h-3 w-3" />;
      case "cliente":
        return <User className="h-3 w-3" />;
    }

    // Si no hay coincidencia por rol, verificar por tipo
    if (type) {
      switch (type) {
        case "admin":
        case "superadmin":
          return <Shield className="h-3 w-3" />;
        case "empresa":
          return <User className="h-3 w-3" />;
        case "cliente":
          return <User className="h-3 w-3" />;
      }
    }

    // Valor por defecto
    return <User className="h-3 w-3" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={(user as any).avatar}
              alt={(user as any).nombre}
            />
            <AvatarFallback>{getInitials((user as any).nombre)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">
              {(user as any).nombre || user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={getRoleBadgeVariant(
                  user.role || (user as any).tipoUsuario,
                  user.type || (user as any).tipoUsuario
                )}
                className="flex items-center gap-1 text-xs"
              >
                {getRoleIcon(
                  user.role || (user as any).tipoUsuario,
                  user.type || (user as any).tipoUsuario
                )}
                {user.role || (user as any).tipoUsuario}
              </Badge>
              {(user as any).numeroCliente && (
                <span className="text-xs text-muted-foreground">
                  #{(user as any).numeroCliente}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/perfil")}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/configuracion")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente simplificado para mostrar solo el estado
export function AuthStatusSimple() {
  const { user, isAuthenticated } = useApi();

  if (!isAuthenticated || !user) {
    return <Badge variant="destructive">No autenticado</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="default" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        {(user as any).nombre || user.name}
      </Badge>
      <Badge variant="outline">{user.role || (user as any).tipoUsuario}</Badge>
    </div>
  );
}
