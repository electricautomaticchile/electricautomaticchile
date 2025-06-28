"use client";
import React, { useState, useEffect } from "react";
import { SuperAdminRoute } from "@/components/auth/protected-route";
import { BarrasNavegacion } from "./componentes/barras-navegacion";
import { Encabezado } from "./componentes/encabezado";
import { GestionEmpresas } from "./componentes/gestion-empresas";
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
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <EstadisticasGlobales reducida={true} />
              <Mensajeria reducida={true} />
              <Notificaciones reducida={true} />
            </div>

            {/* Panel de Cotizaciones - Destacado */}
            <div className="grid gap-6 md:grid-cols-1 mb-6">
              <CotizacionesDashboard
                reducida={true}
                onVerTodas={() => setComponenteActivo("cotizaciones")}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <FacturacionGlobal reducida={true} />
              <GestionEmpresas reducida={true} />
            </div>
            <div className="grid gap-6 md:grid-cols-1">
              <RegistrosActividad reducida={true} />
            </div>
          </>
        );
    }
  };

  return (
    <SuperAdminRoute>
      <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        <BarrasNavegacion onCambioComponente={setComponenteActivo} />
        <div className="flex flex-col">
          <Encabezado tipoUsuario="superadmin" />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-orange-600">
                Panel de Administración Principal
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Gestión centralizada de la plataforma Electric Automatic Chile
              </p>
            </div>

            {renderizarComponenteActivo()}
          </main>
        </div>
      </div>
    </SuperAdminRoute>
  );
}
