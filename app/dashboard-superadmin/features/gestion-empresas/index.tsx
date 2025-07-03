"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, TrendingUp } from "lucide-react";
import { TablaEmpresas } from "./TablaEmpresas";
import { CrearEmpresaModal } from "./CrearEmpresaModal";
import { DetalleEmpresaModal } from "./DetalleEmpresaModal";
import { CredencialesModal } from "./CredencialesModal";
import { useEmpresas } from "./hooks/useEmpresas";
import { useEmpresaModals } from "./hooks/useEmpresaModals";
import { GestionEmpresasProps } from "./types";

export default function GestionEmpresas({
  reducida = false,
}: GestionEmpresasProps) {
  // Hooks de datos y lógica
  const {
    empresas,
    estadisticas,
    cargando,
    cargandoCreacion,
    showCredenciales,
    setShowCredenciales,
    crearEmpresa,
    cambiarEstadoEmpresa,
    resetearPassword,
  } = useEmpresas(reducida);

  // Hooks de modales
  const {
    showCreateModal,
    showDetailModal,
    selectedEmpresa,
    nuevaEmpresa,
    abrirModalCrear,
    cerrarModalCrear,
    abrirModalDetalle,
    cerrarModalDetalle,
    actualizarNuevaEmpresa,
    regiones,
  } = useEmpresaModals();

  // Manejadores de eventos
  const handleCrearEmpresa = async () => {
    const resultado = await crearEmpresa(nuevaEmpresa);
    if (resultado.success) {
      cerrarModalCrear();
    }
  };

  const renderEstadisticas = () => {
    if (!estadisticas || reducida) return null;

    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.totales.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {estadisticas.totales.activas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendidas</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {estadisticas.totales.suspendidas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {estadisticas.totales.inactivas}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Empresas
          </h2>
          <p className="text-muted-foreground">
            Administra empresas clientes y sus accesos al sistema
          </p>
        </div>
        <Button
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {/* Estadísticas */}
      {renderEstadisticas()}

      {/* Tabla de empresas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reducida ? "Últimas Empresas Registradas" : "Lista de Empresas"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TablaEmpresas
            empresas={empresas}
            cargando={cargando}
            onVerDetalle={abrirModalDetalle}
            onCambiarEstado={cambiarEstadoEmpresa}
            onResetearPassword={resetearPassword}
          />
        </CardContent>
      </Card>

      {/* Modales */}
      <CrearEmpresaModal
        open={showCreateModal}
        onOpenChange={cerrarModalCrear}
        nuevaEmpresa={nuevaEmpresa}
        onActualizarEmpresa={actualizarNuevaEmpresa}
        onCrearEmpresa={handleCrearEmpresa}
        cargandoCreacion={cargandoCreacion}
        regiones={regiones}
      />

      <DetalleEmpresaModal
        open={showDetailModal}
        onOpenChange={cerrarModalDetalle}
        empresa={selectedEmpresa}
      />

      <CredencialesModal
        open={!!showCredenciales}
        onOpenChange={() => setShowCredenciales(null)}
        credenciales={showCredenciales}
      />
    </div>
  );
}
