"use client";

import { useEffect } from "react";
import { useCotizaciones, useClientes, useAuth } from "@/lib/hooks/useApi";
import { ApiStatus } from "@/components/ui/api-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Ejemplo de componente usando las nuevas rutas de API
export function ExampleApiUsage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const {
    cotizaciones,
    loading: loadingCotizaciones,
    error: errorCotizaciones,
    obtenerCotizaciones,
  } = useCotizaciones();

  const { clientes, loading: loadingClientes, obtenerClientes } = useClientes();

  // Cargar datos al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      obtenerCotizaciones();
      obtenerClientes();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    const result = await login({
      email: "admin@electricautomaticchile.com",
      password: "password123",
    });

    if (result.success) {
      console.log("Login exitoso:", result.data);
    } else {
      console.error("Error en login:", result.error);
    }
  };

  const handleRefreshData = () => {
    obtenerCotizaciones({ page: 1, limit: 10 });
    obtenerClientes({ page: 1, limit: 10 });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Estado de la API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Estado de Conexión
            <ApiStatus showDetails />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Autenticación */}
      <Card>
        <CardHeader>
          <CardTitle>Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-2">
              <p>Usuario conectado: {user?.nombre || "N/A"}</p>
              <p>Tipo: {user?.tipoUsuario || "N/A"}</p>
              <Button onClick={logout} variant="outline">
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div>
              <p>No hay sesión activa</p>
              <Button onClick={handleLogin} className="mt-2">
                Iniciar Sesión (Demo)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cotizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Cotizaciones
            <Button onClick={handleRefreshData} size="sm">
              Actualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCotizaciones ? (
            <p>Cargando cotizaciones...</p>
          ) : errorCotizaciones ? (
            <p className="text-red-500">Error: {errorCotizaciones}</p>
          ) : cotizaciones ? (
            <div>
              <p>
                Cotizaciones encontradas:{" "}
                {Array.isArray(cotizaciones) ? cotizaciones.length : 0}
              </p>
              {Array.isArray(cotizaciones) &&
                cotizaciones.slice(0, 3).map((cot: any) => (
                  <div key={cot._id} className="border p-2 mt-2 rounded">
                    <p>
                      <strong>Nombre:</strong> {cot.nombre}
                    </p>
                    <p>
                      <strong>Email:</strong> {cot.email}
                    </p>
                    <p>
                      <strong>Estado:</strong> {cot.estado}
                    </p>
                    <p>
                      <strong>Servicio:</strong> {cot.servicio}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p>No hay cotizaciones disponibles</p>
          )}
        </CardContent>
      </Card>

      {/* Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClientes ? (
            <p>Cargando clientes...</p>
          ) : clientes ? (
            <div>
              <p>
                Clientes encontrados:{" "}
                {Array.isArray(clientes) ? clientes.length : 0}
              </p>
              {Array.isArray(clientes) &&
                clientes.slice(0, 3).map((cliente: any) => (
                  <div key={cliente._id} className="border p-2 mt-2 rounded">
                    <p>
                      <strong>Nombre:</strong> {cliente.nombre}
                    </p>
                    <p>
                      <strong>Email:</strong> {cliente.email || cliente.correo}
                    </p>
                    <p>
                      <strong>Empresa:</strong> {cliente.empresa || "N/A"}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p>No hay clientes disponibles</p>
          )}
        </CardContent>
      </Card>

      {/* Información de Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Endpoints Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <p>🔐 /api/auth - Autenticación</p>
            <p>👥 /api/usuarios - Gestión de usuarios</p>
            <p>🏢 /api/clientes - Gestión de clientes</p>
            <p>📋 /api/cotizaciones - Gestión de cotizaciones</p>
            <p>📄 /api/documentos - Gestión de documentos</p>
            <p>💬 /api/mensajes - Sistema de mensajería</p>
            <p>🔔 /api/notificaciones - Notificaciones</p>
            <p>🏭 /api/empresas - Gestión de empresas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
