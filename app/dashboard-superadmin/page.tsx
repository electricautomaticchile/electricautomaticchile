"use client";
import React, { useState, useEffect } from "react";
import { SuperAdminRoute } from "@/components/auth/protected-route";
import { BarrasNavegacion } from "./componentes/barras-navegacion";
import { NavegacionMovil } from "./componentes/navegacion-movil";
import { Encabezado } from "./componentes/encabezado";
import GestionEmpresas from "./componentes/gestion-empresas";
import { EstadisticasGlobales } from "./componentes/estadisticas-globales";
import { Notificaciones } from "./componentes/notificaciones";
import { Mensajeria } from "./componentes/mensajeria";
import { Configuracion } from "./componentes/configuracion";
import { RegistrosActividad } from "./componentes/registros-actividad";
import { FacturacionGlobal } from "./componentes/facturacion-global";
import { CotizacionesDashboard } from "./componentes/cotizaciones-dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { apiService, ICliente, ICotizacion } from "@/lib/api/apiService";

/**
 * Dashboard para Superadmin (Electric Automatic Chile)
 * Permite administrar toda la plataforma, clientes corporativos y estadísticas globales
 */
export default function DashboardSuperadmin() {
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [sesionActiva, setSesionActiva] = useState(true);

  // Control de tiempo de inactividad (30 minutos)
  useEffect(() => {
    let temporizador: NodeJS.Timeout;

    const manejarActividad = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        setSesionActiva(false);
        signOut({ callbackUrl: "/auth/login" });
      }, 1800000); // 30 minutos
    };

    // Iniciar el temporizador
    manejarActividad();

    // Escuchar eventos de actividad
    window.addEventListener("mousemove", manejarActividad);
    window.addEventListener("keydown", manejarActividad);
    window.addEventListener("click", manejarActividad);
    window.addEventListener("scroll", manejarActividad);

    // Limpiar eventos al desmontar
    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("mousemove", manejarActividad);
      window.removeEventListener("keydown", manejarActividad);
      window.removeEventListener("click", manejarActividad);
      window.removeEventListener("scroll", manejarActividad);
    };
  }, []);

  useEffect(() => {
    cargarEstadisticasBasicas();
  }, []);

  const cargarEstadisticasBasicas = async () => {
    try {
      // Cargar datos básicos del backend
      const [clientesResponse, cotizacionesResponse] = await Promise.all([
        apiService.obtenerClientes(),
        apiService.obtenerCotizaciones(),
      ]);

      if (clientesResponse.success && cotizacionesResponse.success) {
        const clientes: ICliente[] = clientesResponse.data || [];
        const cotizaciones: ICotizacion[] = cotizacionesResponse.data || [];

        console.log("Datos cargados del backend:", {
          totalClientes: clientes.length,
          totalCotizaciones: cotizaciones.length,
          clientesActivos: clientes.filter(
            (c: ICliente) => c.activo || c.esActivo
          ).length,
          cotizacionesPendientes: cotizaciones.filter(
            (c: ICotizacion) => c.estado === "pendiente"
          ).length,
        });
      }
    } catch (error) {
      console.error("Error cargando estadísticas básicas:", error);
    }
  };

  // Renderizar el componente activo seleccionado
  const renderizarComponenteActivo = () => {
    switch (componenteActivo) {
      case "gestion-empresas":
        return <GestionEmpresas />;
      case "estadisticas-globales":
        return <EstadisticasGlobales />;
      case "notificaciones":
        return <Notificaciones />;
      case "mensajeria":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Centro de Mensajes</h2>
            <Mensajeria />
          </div>
        );
      case "configuracion":
        return <Configuracion />;
      case "registros-actividad":
        return <RegistrosActividad />;
      case "facturacion-global":
        return <FacturacionGlobal />;
      case "cotizaciones":
        return <CotizacionesDashboard />;
      default:
        // Vista por defecto: dashboard general
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Estadísticas principales */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <EstadisticasGlobales reducida={true} />
              <Mensajeria reducida={true} />
              <Notificaciones reducida={true} />
            </div>

            {/* Panel de Cotizaciones - Destacado */}
            <div className="w-full">
              <CotizacionesDashboard
                reducida={true}
                onVerTodas={() => setComponenteActivo("cotizaciones")}
              />
            </div>

            {/* Gestión y Facturación */}
            <div className="grid gap-4 lg:grid-cols-2">
              <FacturacionGlobal reducida={true} />
              <GestionEmpresas reducida={true} />
            </div>

            {/* Registros de Actividad */}
            <div className="w-full">
              <RegistrosActividad reducida={true} />
            </div>
          </div>
        );
    }
  };

  return (
    <SuperAdminRoute>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar - Oculto en móviles, visible en desktop */}
        <div className="hidden lg:block">
          <BarrasNavegacion onCambioComponente={setComponenteActivo} />
        </div>

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col min-w-0">
          <Encabezado
            tipoUsuario="superadmin"
            menuMovil={
              <NavegacionMovil onCambioComponente={setComponenteActivo} />
            }
            onCambioComponente={setComponenteActivo}
          />
          <main className="flex-1 overflow-auto">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Solo mostrar título y descripción en el panel principal */}
              {!componenteActivo && (
                <div className="space-y-1 md:space-y-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
                    Panel de Administración Principal
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Gestión centralizada de la plataforma Electricautomaticchile
                  </p>
                </div>
              )}

              {renderizarComponenteActivo()}
            </div>
          </main>
        </div>
      </div>
    </SuperAdminRoute>
  );
}
