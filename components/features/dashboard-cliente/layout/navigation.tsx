"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, Zap, FileText, Power, Bell, User, HelpCircle, Menu, X,
} from "lucide-react";
import { useNotificacionesCliente } from "@/hooks/useNotificacionesCliente";
import { useApi } from "@/hooks/useApi";
import { Logo } from "@/components/logo";

const navItems = [
  { id: "resumen", label: "Dashboard", icon: Home },
  { id: "consumo", label: "Mi Consumo", icon: Zap },
  { id: "servicio", label: "Control de Servicio", icon: Power },
  { id: "boletas", label: "Pagos", icon: FileText },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, showBadge: true },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "soporte", label: "Soporte", icon: HelpCircle },
];

interface NavigationClienteProps {
  onNavigate?: (item: string | null) => void;
  activeItem?: string | null;
  imagenPerfil?: string;
}

const NavigationCliente: React.FC<NavigationClienteProps> = ({ onNavigate, activeItem, imagenPerfil }) => {
  const { resumen } = useNotificacionesCliente();
  const { user, logout, isAuthenticated } = useApi();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const notificacionesNoLeidas = resumen.noLeidas;

  const handleClick = (itemId: string) => {
    onNavigate?.(itemId === "resumen" ? null : itemId);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header — usuario */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-orange-500/40">
        {isAuthenticated && user ? (
          <>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {imagenPerfil ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagenPerfil} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                (user?.name || (user as any)?.nombre || "C").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">
                {user?.name || (user as any)?.nombre || "Cliente"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Portal Cliente</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-sm" />
              <Logo showText={false} className="relative w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">Electric Automatic</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Portal Cliente</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Menú
          </span>
        </div>
        {navItems.map(({ id, label, icon: Icon, showBadge }) => {
          const isActive = activeItem === id || (activeItem === null && id === "resumen");
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                "sidebar-item w-full",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
            >
              <Icon style={{ width: "18px", height: "18px" }} className="shrink-0" />
              <span className="flex-1 text-left text-sm">{label}</span>
              {showBadge && notificacionesNoLeidas > 0 && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-[16px]">
                  {notificacionesNoLeidas}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="glass border-border/60 shadow-lg w-9 h-9"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-60 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "bg-[#0a0a0a] border-r border-orange-500/40 flex flex-col"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default NavigationCliente;

