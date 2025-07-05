"use client";
import React, { useState, useEffect } from "react";
import { ClienteRoute } from "@/components/auth/protected-route";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { BarraNavegacionLateral } from "./componentes/barras-navegacion";
import Encabezado from "./componentes/encabezado";
import { ConsumoElectrico } from "./componentes/consumo-electrico";
import { EstadoServicio } from "./componentes/estado-servicio";
import { PagosFacturas } from "./componentes/pagos-facturas";
import { HistorialConsumo } from "./componentes/historial-consumo";
import { SoporteUsuario } from "./componentes/soporte-usuario";
import { PerfilUsuario } from "./componentes/perfil-usuario";
import HeaderCliente from "./components/layout/header";
import NavigationCliente from "./components/layout/navigation";

/**
 * Dashboard para Clientes Finales (Usuarios de las Empresas)
 * Permite visualizar consumo, gestionar pagos y activar/desactivar servicio
 */
export default function DashboardCliente() {
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [sesionActiva, setSesionActiva] = useState(true);
  const [estadoServicio, setEstadoServicio] = useState<
    "activo" | "desactivado" | "suspendido"
  >("activo");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);
  const [datosCliente, setDatosCliente] = useState({
    nombre: "Juan Pérez",
    numeroCliente: "123456-7",
    direccion: "Av. Principal 123, Santiago",
    ultimoPago: "15/04/2023",
    consumoActual: 245.8, // kWh
  });

  // Control de tiempo de inactividad (30 minutos)
  useEffect(() => {
    let temporizador: NodeJS.Timeout;

    const manejarActividad = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        setSesionActiva(false);
        window.location.href = "/auth/login";
      }, 1800000); // 30 minutos
    };

    // Este código solo se ejecutará en el cliente
    if (typeof window !== "undefined") {
      // Iniciar el temporizador
      manejarActividad();

      // Escuchar eventos de actividad
      window.addEventListener("mousemove", manejarActividad);
      window.addEventListener("keydown", manejarActividad);
      window.addEventListener("click", manejarActividad);
      window.addEventListener("scroll", manejarActividad);
    }

    // Limpiar eventos al desmontar
    return () => {
      if (typeof window !== "undefined") {
        clearTimeout(temporizador);
        window.removeEventListener("mousemove", manejarActividad);
        window.removeEventListener("keydown", manejarActividad);
        window.removeEventListener("click", manejarActividad);
        window.removeEventListener("scroll", manejarActividad);
      }
    };
  }, []);

  // Verificar si requiere cambio de contraseña al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const requiereCambio = localStorage.getItem("requiereCambioPassword");
      if (requiereCambio === "true") {
        setRequiereCambioPassword(true);
        setMostrarModalPassword(true);
      }
    }
  }, []);

  const handlePasswordChangeSuccess = () => {
    setRequiereCambioPassword(false);
    // Nota: localStorage se limpia automáticamente en el modal
  };

  // Cargar datos del cliente
  useEffect(() => {
    // Aquí se cargarían los datos del cliente desde la API
    // Por ahora, usamos datos de ejemplo
    const cargarDatosCliente = async () => {
      try {
        // Simulamos una llamada a la API
        // const respuesta = await fetch('/api/cliente/datos');
        // const datos = await respuesta.json();
        // setDatosCliente(datos);
        // setEstadoServicio(datos.estadoServicio);
      } catch (error) {
        console.error("Error al cargar datos del cliente:", error);
      }
    };

    cargarDatosCliente();
  }, []);

  // Manejar cambio de estado del servicio
  const manejarCambioEstado = async (nuevoEstado: "activo" | "desactivado") => {
    try {
      // Aquí se enviaría la solicitud a la API
      // await fetch('/api/cliente/estado-servicio', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ estado: nuevoEstado })
      // });

      // Por ahora, simulamos la respuesta
      setEstadoServicio(nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar estado del servicio:", error);
    }
  };

  // Renderizar el componente activo seleccionado
  const renderizarComponenteActivo = () => {
    switch (componenteActivo) {
      case "consumo-electrico":
        return <ConsumoElectrico />;
      case "estado-servicio":
        return (
          <EstadoServicio
            estadoActual={estadoServicio}
            onCambioEstado={manejarCambioEstado}
          />
        );
      case "pagos-facturas":
        return <PagosFacturas />;
      case "historial-consumo":
        return <HistorialConsumo />;
      case "soporte-usuario":
        return <SoporteUsuario />;
      case "perfil-usuario":
        return <PerfilUsuario datos={datosCliente} />;
      default:
        // Vista por defecto: dashboard general
        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estado del servicio
                </h3>
                <div className="flex items-center mt-1">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      estadoServicio === "activo"
                        ? "bg-green-500"
                        : estadoServicio === "desactivado"
                          ? "bg-gray-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <p className="text-lg font-semibold">
                    {estadoServicio === "activo"
                      ? "Activo"
                      : estadoServicio === "desactivado"
                        ? "Desactivado"
                        : "Suspendido"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Consumo actual
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {datosCliente.consumoActual} kWh
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Último pago
                </h3>
                <p className="text-lg font-semibold">
                  {datosCliente.ultimoPago}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <ConsumoElectrico reducida={true} />
              <HistorialConsumo reducida={true} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <EstadoServicio
                reducida={true}
                estadoActual={estadoServicio}
                onCambioEstado={manejarCambioEstado}
              />
              <PagosFacturas reducida={true} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <HeaderCliente />
      <div className="flex flex-1 overflow-hidden">
        <NavigationCliente />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <h2 className="mb-4 text-xl font-semibold text-slate-700">
            Bienvenido al panel de cliente
          </h2>
          {renderizarComponenteActivo()}
        </main>
      </div>

      {/* Modal de cambio de contraseña */}
      <CambioPasswordModal
        isOpen={mostrarModalPassword}
        onClose={() => setMostrarModalPassword(false)}
        onSuccess={handlePasswordChangeSuccess}
        mostrarAdvertencia={requiereCambioPassword}
      />
    </div>
  );
}
