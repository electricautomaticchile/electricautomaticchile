"use client";

import { useAuth } from "@/lib/hooks/useApi";
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
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return "destructive";
      case "empresa":
        return "default";
      case "cliente":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return <Shield className="h-3 w-3" />;
      case "empresa":
        return <User className="h-3 w-3" />;
      case "cliente":
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.nombre} />
            <AvatarFallback>{getInitials(user.nombre)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.nombre}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={getRoleBadgeVariant(user.role || user.tipoUsuario)}
                className="flex items-center gap-1 text-xs"
              >
                {getRoleIcon(user.role || user.tipoUsuario)}
                {user.role || user.tipoUsuario}
              </Badge>
              {user.numeroCliente && (
                <span className="text-xs text-muted-foreground">
                  #{user.numeroCliente}
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
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Badge variant="destructive">No autenticado</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="default" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        {user.nombre}
      </Badge>
      <Badge variant="outline">{user.role || user.tipoUsuario}</Badge>
    </div>
  );
}
