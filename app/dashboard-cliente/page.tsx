"use client";
import React, { useState, useEffect } from "react";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ProveedorWebSocket } from "@/lib/websocket/ProveedorWebSocket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsumoElectrico } from "./componentes/consumo-electrico";
import { EstadoServicio } from "./componentes/estado-servicio";
import { PagosFacturas } from "./componentes/pagos-facturas";
import { HistorialConsumo } from "./componentes/historial-consumo";
import { SoporteUsuarioNuevo as SoporteUsuario } from "./componentes/soporte-usuario";
import { PerfilUsuario } from "./componentes/perfil-usuario";
import { AlertasEnTiempoReal } from "./componentes/alertas-tiempo-real";
import { PronosticoConsumo } from "./componentes/predicciones-clima/PronosticoConsumo";
import { ConsejosAhorro } from "./componentes/predicciones-clima/ConsejosAhorro";
import { IndiceCalidadAire } from "./componentes/calidad-aire/IndiceCalidadAire";
import { MapaBasico } from "./componentes/ubicacion/MapaBasico";
import { ControlServicio } from "./componentes/control-servicio";
import { NotificacionesCliente } from "./componentes/notificaciones-cliente";
import HeaderCliente from "./components/layout/header";
import NavigationCliente from "./components/layout/navigation";

/**
 * Dashboard para Clientes Finales (Usuarios de las Empresas)
 * Permite visualizar consumo, gestionar pagos y activar/desactivar servicio
 */
import { useApi } from "@/lib/hooks/useApi";

export default function DashboardCliente() {
  const { user, isLoading: loadingCliente } = useApi();
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [estadoServicio, setEstadoServicio] = useState<
    "activo" | "desactivado" | "suspendido"
  >("activo");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);

  // Usar datos reales del usuario desde useApi
  const datosCliente = {
    _id: (user as any)?._id?.toString() || user?.id?.toString(),
    id: user?.id?.toString() || (user as any)?._id?.toString(),
    nombre: (user as any)?.nombre || user?.name || "Cliente",
    numeroCliente: (user as any)?.numeroCliente || "---",
    direccion: (user as any)?.direccion || "No especificada",
    correo: (user as any)?.correo || user?.email || "",
    email: user?.email || (user as any)?.correo || "",
    telefono: (user as any)?.telefono || "",
    ultimoPago: (user as any)?.ultimoPago || "---",
    consumoActual: (user as any)?.consumoActual || 0,
    ubicacion: (user as any)?.ubicacion || { lat: -33.4489, lng: -70.6693 },
  };

  // Control de tiempo de inactividad (30 minutos)
  useEffect(() => {
    let temporizador: NodeJS.Timeout;

    const manejarActividad = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
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
        return (
          <Tabs defaultValue="actual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="actual">Consumo Actual</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="consejos">Consejos</TabsTrigger>
            </TabsList>
            <TabsContent value="actual" className="mt-6">
              <ConsumoElectrico />
            </TabsContent>
            <TabsContent value="historial" className="mt-6">
              <HistorialConsumo />
            </TabsContent>
            <TabsContent value="consejos" className="mt-6">
              <ConsejosAhorro
                condicionesClimaticas={{
                  temperatura: 25,
                  humedad: 65,
                  descripcion: "Parcialmente nublado",
                }}
              />
            </TabsContent>
          </Tabs>
        );
      case "boletas":
        return <PagosFacturas />;
      case "servicio":
        return <ControlServicio />;
      case "perfil":
        return (
          <Tabs defaultValue="datos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="datos">Mis Datos</TabsTrigger>
              <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
            </TabsList>
            <TabsContent value="datos" className="mt-6">
              <PerfilUsuario datos={datosCliente} />
            </TabsContent>
            <TabsContent value="ubicacion" className="mt-6">
              <MapaBasico
                ubicacion={datosCliente.ubicacion}
                direccionRegistrada={datosCliente.direccion}
              />
            </TabsContent>
          </Tabs>
        );
      case "notificaciones":
        return <NotificacionesCliente />;
      case "soporte":
        return (
          <Tabs defaultValue="ayuda" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ayuda">Centro de Ayuda</TabsTrigger>
              <TabsTrigger value="alertas">Alertas</TabsTrigger>
            </TabsList>
            <TabsContent value="ayuda" className="mt-6">
              <SoporteUsuario />
            </TabsContent>
            <TabsContent value="alertas" className="mt-6">
              <AlertasEnTiempoReal />
            </TabsContent>
          </Tabs>
        );
      case "resumen":
      case null:
      default:
        // Vista por defecto: dashboard general simplificado
        return (
          <>
            {/* Cards principales - 3 cards grandes */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div
                className="p-6 bg-card border border-border rounded-lg shadow-lg hover:shadow-xl hover:border-muted transition-all cursor-pointer"
                onClick={() => setComponenteActivo("consumo")}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Estado del servicio
                </h3>
                <div className="flex items-center mb-4">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      estadoServicio === "activo"
                        ? "bg-green-500 animate-pulse"
                        : estadoServicio === "desactivado"
                          ? "bg-gray-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <p className="text-lg font-bold text-foreground">
                    {estadoServicio === "activo"
                      ? "Activo"
                      : estadoServicio === "desactivado"
                        ? "Desactivado"
                        : "Suspendido"}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Consumo actual
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {datosCliente.consumoActual} kWh
                  </p>
                </div>
              </div>

              <div
                className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer"
                onClick={() => setComponenteActivo("boletas")}
              >
                <h3 className="text-sm font-medium text-orange-100 mb-2">
                  Pagos y Facturas
                </h3>
                <p className="text-xs text-orange-100 mb-4">Último pago</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {datosCliente.ultimoPago}
                </p>
                <p className="text-xs text-orange-100">
                  Click para ver detalles
                </p>
              </div>

              <div
                className="p-6 bg-card border border-border rounded-lg shadow-lg hover:shadow-xl hover:border-muted transition-all cursor-pointer"
                onClick={() => setComponenteActivo("perfil")}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Mi Perfil
                </h3>
                <p className="text-lg font-bold text-foreground mb-1">
                  {datosCliente.nombre}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  N° {datosCliente.numeroCliente}
                </p>
                <p className="text-xs text-muted-foreground">
                  {datosCliente.direccion}
                </p>
              </div>
            </div>

            {/* Widgets informativos - Solo 2 widgets compactos */}
            <div className="grid gap-6 md:grid-cols-2">
              <div
                onClick={() => setComponenteActivo("consumo")}
                className="cursor-pointer"
              >
                <ConsumoElectrico reducida={true} />
              </div>
              <div
                onClick={() => setComponenteActivo("soporte")}
                className="cursor-pointer"
              >
                <AlertasEnTiempoReal reducida={true} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 mb-6">
              <div
                onClick={() => setComponenteActivo("boletas")}
                className="cursor-pointer"
              >
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
          </>
        );
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingCliente) {
    return (
      <ProveedorWebSocket>
        <div className="min-h-screen flex flex-col bg-background">
          <HeaderCliente />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Cargando datos del cliente...
              </p>
            </div>
          </div>
        </div>
      </ProveedorWebSocket>
    );
  }

  return (
    <ProveedorWebSocket>
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderCliente />
        <div className="flex flex-1">
          <NavigationCliente
            onNavigate={setComponenteActivo}
            activeItem={componenteActivo}
          />
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
    </ProveedorWebSocket>
  );
}
