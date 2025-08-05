"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import { Logo } from "@/components/logo";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard-cliente",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Mis Cotizaciones",
    href: "/dashboard-cliente/cotizaciones",
    icon: FileText,
    badge: "3",
  },
  {
    title: "Facturación",
    href: "/dashboard-cliente/facturacion",
    icon: CreditCard,
    badge: null,
  },
  {
    title: "Reportes",
    href: "/dashboard-cliente/reportes",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Configuración",
    href: "/dashboard-cliente/configuracion",
    icon: Settings,
    badge: null,
  },
];

export function BarraNavegacionLateral() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useApi();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Barra lateral */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "bg-white border-r border-gray-200"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <Logo width={32} height={32} />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Electric Automatic
              </h1>
              <p className="text-xs text-gray-500">Panel Cliente</p>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated && user && (
              <>
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || "Cliente"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {user?.id && `Cliente #${user.id}`}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
