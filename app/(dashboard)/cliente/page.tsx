"use client";
import React, { useState, useEffect } from "react";
import { CambioPasswordModal } from "@/components/ui/cambio-password-modal";
import { ConsumoElectrico } from "@/components/features/dashboard-cliente/consumo-electrico";
import { EstadoServicio } from "@/components/features/dashboard-cliente/estado-servicio";
import { PagosFacturas } from "@/components/features/dashboard-cliente/pagos-facturas";
import { SoporteUsuarioNuevo as SoporteUsuario } from "@/components/features/dashboard-cliente/soporte-usuario";
import { PerfilUsuario } from "@/components/features/dashboard-cliente/perfil-usuario";
import { MapaBasico } from "@/components/features/dashboard-cliente/ubicacion/MapaBasico";
import { ControlServicio } from "@/components/features/dashboard-cliente/control-servicio";
import { NotificacionesCliente } from "@/components/features/dashboard-cliente/notificaciones-cliente";
import NavigationCliente from "@/components/features/dashboard-cliente/layout/navigation";
import { useApi } from "@/hooks/useApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardCliente } from "@/hooks/queries/useDashboardQuery";
import { GlobalLoadingState } from "@/components/shared";
import { useCambiarPassword } from "@/hooks/queries/useAuthMutations";

export default function DashboardCliente() {
  const { user, isLoading: loadingCliente, isRealAuthenticated } = useApi();
  const { data: resumenData, isLoading: loadingResumen } = useDashboardCliente();
  const cambiarPasswordMutation = useCambiarPassword();
  const [componenteActivo, setComponenteActivo] = useState<string | null>(null);
  const [estadoServicio, setEstadoServicio] = useState<
    "activo" | "desactivado" | "suspendido"
  >("activo");
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);
  const [requiereCambioPassword, setRequiereCambioPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const requiereCambioCookie = cookies.find((c) =>
        c.trim().startsWith("requiereCambioPassword=")
      );
      if (requiereCambioCookie && requiereCambioCookie.split("=")[1] === "true") {
        setRequiereCambioPassword(true);
        setMostrarModalPassword(true);
      }
    }
  }, []);

  useEffect(() => {
    if (resumenData?.data?.cliente?.passwordTemporal) {
      setRequiereCambioPassword(true);
      setMostrarModalPassword(true);
    }
  }, [resumenData]);

  const datosCliente = {
    _id: (user as any)?._id?.toString() || user?.id?.toString(),
    id: user?.id?.toString() || (user as any)?._id?.toString(),
    nombre: resumenData?.data?.cliente?.nombre || (user as any)?.nombre || user?.name || "Cliente",
    numeroCliente: resumenData?.data?.cliente?.numeroCliente || (user as any)?.numeroCliente || "---",
    direccion: (resumenData?.data?.cliente as any)?.direccion || (user as any)?.direccion || "No especificada",
    correo: resumenData?.data?.cliente?.correo || (user as any)?.correo || user?.email || "",
    email: user?.email || (user as any)?.correo || "",
    telefono: (resumenData?.data?.cliente as any)?.telefono || (user as any)?.telefono || "",
    imagenPerfil: (resumenData?.data?.cliente as any)?.imagenPerfil || (user as any)?.imagenPerfil || "",
    ultimoPago: (user as any)?.ultimoPago || "---",
    consumoActual: resumenData?.data?.estadisticas?.consumoMensual || (user as any)?.consumoActual || 0,
    ubicacion: (user as any)?.ubicacion || { lat: -33.4489, lng: -70.6693 },
    estadisticas: resumenData?.data?.estadisticas || {
      dispositivosActivos: 0,
      dispositivosTotal: 0,
      consumoMensual: 0,
      costoMensual: 0,
      boletasPendientes: 0,
    },
  };

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
    }
  };

  // Renderizar el componente activo seleccionado
  const renderizarComponenteActivo = () => {
    switch (componenteActivo) {
      case "consumo":
        return (
          <ConsumoElectrico />
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
        return <SoporteUsuario />;
      case "resumen":
      case null:
      default:
        return (
          <>
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
                    Dispositivos activos
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {datosCliente.estadisticas.dispositivosActivos} / {datosCliente.estadisticas.dispositivosTotal}
                  </p>
                </div>
              </div>

              <div
                className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer"
                onClick={() => setComponenteActivo("boletas")}
              >
                <h3 className="text-sm font-medium text-orange-100 mb-2">
                  Consumo Mensual
                </h3>
                <p className="text-xs text-orange-100 mb-4">Este mes</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {datosCliente.estadisticas.consumoMensual.toFixed(2)} kWh
                </p>
                <p className="text-xs text-orange-100">
                  ${datosCliente.estadisticas.costoMensual.toFixed(0)} CLP
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

            <div className="grid gap-6 md:grid-cols-2">
              <div
                onClick={() => setComponenteActivo("consumo")}
                className="cursor-pointer"
              >
                <ConsumoElectrico reducida={true} />
              </div>
              <div
                onClick={() => setComponenteActivo("notificaciones")}
                className="cursor-pointer"
              >
                <NotificacionesCliente />
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

  if (loadingCliente || loadingResumen) {
    return <GlobalLoadingState message="Cargando dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
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

      <CambioPasswordModal
          open={mostrarModalPassword}
          onOpenChange={(open) => {
            if (!requiereCambioPassword) {
              setMostrarModalPassword(open);
            }
          }}
          onConfirm={async (currentPassword, newPassword) => {
            cambiarPasswordMutation.mutate(
              { currentPassword, newPassword },
              {
                onSuccess: () => {
                  handlePasswordChangeSuccess();
                  setMostrarModalPassword(false);
                },
                onError: (error) => {
                  throw error;
                },
              }
            );
          }}
          requiereActual={!requiereCambioPassword}
          esForzado={requiereCambioPassword}
        />
      </div>
    
  );
}
