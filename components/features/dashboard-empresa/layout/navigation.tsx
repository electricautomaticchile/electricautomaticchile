"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, Battery, BellRing, BarChart3,
  Settings, Menu, X, Headphones, Zap,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { Logo } from "@/components/logo";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "clientes", title: "Clientes", icon: Users },
  { id: "dispositivos", title: "Dispositivos", icon: Battery },
  { id: "alertas", title: "Alertas", icon: BellRing },
  { id: "soporte", title: "Soporte", icon: Headphones },
  { id: "estadisticas", title: "Estadísticas", icon: BarChart3 },
  { id: "configuracion", title: "Configuración", icon: Settings },
];

interface SidebarEmpresaProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  ticketsAbiertos?: number;
  notificacionesNoLeidas?: number;
}

export function BarraNavegacionLateral({
  activeTab = "dashboard",
  onTabChange,
  ticketsAbiertos = 0,
  notificacionesNoLeidas = 0,
}: SidebarEmpresaProps) {
  const { user, logout, isAuthenticated } = useApi();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getBadge = (id: string) => {
    if (id === "alertas" && notificacionesNoLeidas > 0) return notificacionesNoLeidas.toString();
    if (id === "soporte" && ticketsAbiertos > 0) return ticketsAbiertos.toString();
    return null;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header — usuario */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-orange-500/40">
        {isAuthenticated && user ? (
          <>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {((user as any)?.nombreEmpresa || user?.name || "E").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">
                {(user as any)?.nombreEmpresa || user?.name || "Empresa"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground truncate">
                  {(user as any)?.empresa || "Administrador"}
                </span>
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
                <span className="text-xs text-muted-foreground">Panel Empresa</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Navegación
          </span>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = getBadge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange?.(item.id); setIsMobileMenuOpen(false); }}
              className={cn(
                "sidebar-item w-full",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: "18px", height: "18px" }} />
              <span className="flex-1 text-left text-sm">{item.title}</span>
              {badge && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 min-w-[16px]">
                  {badge}
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
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="glass border-border/60 shadow-lg w-9 h-9"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-60 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "bg-[#0a0a0a] border-r border-orange-500/40"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

