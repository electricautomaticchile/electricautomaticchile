"use client";
import React, { useState, useEffect } from "react";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ConsumoElectrico } from "./componentes/consumo-electrico";
import { EstadoServicio } from "./componentes/estado-servicio";
import { PagosFacturas } from "./componentes/pagos-facturas";
import { HistorialConsumo } from "./componentes/historial-consumo";
import { SoporteUsuario } from "./componentes/soporte-usuario";
import { PerfilUsuario } from "./componentes/perfil-usuario";
import { AlertasEnTiempoReal } from "./componentes/alertas-tiempo-real";
import { PronosticoConsumo } from "./componentes/predicciones-clima/PronosticoConsumo";
import { ConsejosAhorro } from "./componentes/predicciones-clima/ConsejosAhorro";
import { IndiceCalidadAire } from "./componentes/calidad-aire/IndiceCalidadAire";
import { MapaBasico } from "./componentes/ubicacion/MapaBasico";
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
    ubicacion: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
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
      case "consumo":
        return <ConsumoElectrico />;
      case "estado-servicio":
        return (
          <EstadoServicio
            estadoActual={estadoServicio}
            onCambioEstado={manejarCambioEstado}
          />
        );
      case "boletas":
        return <PagosFacturas />;
      case "historial":
        return <HistorialConsumo />;
      case "soporte":
        return <SoporteUsuario />;
      case "perfil":
        return <PerfilUsuario datos={datosCliente} />;
      case "alertas":
        return <AlertasEnTiempoReal />;
      case "mapa-ubicacion":
        return <MapaBasico ubicacion={datosCliente.ubicacion} direccionRegistrada={datosCliente.direccion} />;
      case "pronostico-clima":
        return <PronosticoConsumo ubicacion={datosCliente.ubicacion} />;
      case "consejos-ahorro":
        return <ConsejosAhorro condicionesClimaticas={{ temperatura: 25, humedad: 65, descripcion: "Parcialmente nublado" }} />;
      case "calidad-aire":
        return <IndiceCalidadAire ubicacion={datosCliente.ubicacion} />;
      case "resumen":
      case null:
      default:
        // Vista por defecto: dashboard general
        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-lg hover:shadow-xl hover:border-muted transition-all cursor-pointer" onClick={() => setComponenteActivo("estado-servicio")}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Estado del servicio
                </h3>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${estadoServicio === "activo"
                      ? "bg-green-500 animate-pulse"
                      : estadoServicio === "desactivado"
                        ? "bg-gray-500"
                        : "bg-red-500"
                      }`}
                  ></div>
                  <p className="text-xl font-bold text-foreground">
                    {estadoServicio === "activo"
                      ? "Activo"
                      : estadoServicio === "desactivado"
                        ? "Desactivado"
                        : "Suspendido"}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer" onClick={() => setComponenteActivo("consumo")}>
                <h3 className="text-sm font-medium text-orange-100 mb-2">
                  Consumo actual
                </h3>
                <p className="text-3xl font-bold text-white">
                  {datosCliente.consumoActual} kWh
                </p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-lg hover:shadow-xl hover:border-muted transition-all cursor-pointer" onClick={() => setComponenteActivo("boletas")}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Último pago
                </h3>
                <p className="text-xl font-bold text-foreground">
                  {datosCliente.ultimoPago}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div onClick={() => setComponenteActivo("consumo")} className="cursor-pointer">
                <ConsumoElectrico reducida={true} />
              </div>
              <div onClick={() => setComponenteActivo("pronostico-clima")} className="cursor-pointer">
                <PronosticoConsumo reducida={true} ubicacion={datosCliente.ubicacion} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div onClick={() => setComponenteActivo("consejos-ahorro")} className="cursor-pointer">
                <ConsejosAhorro reducida={true} condicionesClimaticas={{ temperatura: 25, humedad: 65, descripcion: "Parcialmente nublado" }} />
              </div>
              <div onClick={() => setComponenteActivo("calidad-aire")} className="cursor-pointer">
                <IndiceCalidadAire reducida={true} ubicacion={datosCliente.ubicacion} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div onClick={() => setComponenteActivo("mapa-ubicacion")} className="cursor-pointer">
                <MapaBasico reducida={true} ubicacion={datosCliente.ubicacion} direccionRegistrada={datosCliente.direccion} />
              </div>
              <div onClick={() => setComponenteActivo("historial")} className="cursor-pointer">
                <HistorialConsumo reducida={true} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 mb-6">
              <div onClick={() => setComponenteActivo("boletas")} className="cursor-pointer">
                <PagosFacturas reducida={true} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 mb-6">
              <EstadoServicio
                reducida={true}
                estadoActual={estadoServicio}
                onCambioEstado={manejarCambioEstado}
              />
            </div>

            {/* Alertas en tiempo real */}
            <div className="mb-6">
              <AlertasEnTiempoReal reducida={true} sonidoHabilitado={true} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderCliente />
      <div className="flex flex-1">
        <NavigationCliente onNavigate={setComponenteActivo} activeItem={componenteActivo} />
        <main className="flex-1 bg-background p-6">
          {componenteActivo === null || componenteActivo === "resumen" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Bienvenido, {datosCliente.nombre}
                </h2>
                <p className="text-muted-foreground">
                  Cliente N° {datosCliente.numeroCliente}
                </p>
              </div>
              {renderizarComponenteActivo()}
            </>
          ) : (
            renderizarComponenteActivo()
          )}
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
