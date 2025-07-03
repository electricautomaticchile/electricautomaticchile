"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, UserPlus, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { apiService, ICotizacion } from "@/lib/api/apiService";
import { RegistroClientes } from "../registro-clientes";

// Importar todos los componentes específicos
import { CotizacionesReducidas } from "../cotizaciones/CotizacionesReducidas";
import { CotizacionesEstadisticas } from "../cotizaciones/CotizacionesEstadisticas";
import { TablaCotizaciones } from "../cotizaciones/TablaCotizaciones";
import { ModalDetallesCotizacion } from "../cotizaciones/ModalDetallesCotizacion";
import { ModalConfirmacionEliminacion } from "../cotizaciones/ModalConfirmacionEliminacion";
import {
  getEstadisticas,
  formatServicio,
  ITEMS_POR_PAGINA,
} from "../cotizaciones/cotizaciones-utils";

interface CotizacionesDashboardProps {
  reducida?: boolean;
  onVerTodas?: () => void;
}

export function CotizacionesDashboard({
  reducida = false,
  onVerTodas,
}: CotizacionesDashboardProps) {
  // Estados principales
  const [cotizaciones, setCotizaciones] = useState<ICotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cotizaciones");

  // Estados para modal de detalles
  const [cotizacionSeleccionada, setCotizacionSeleccionada] =
    useState<ICotizacion | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para eliminación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cotizacionAEliminar, setCotizacionAEliminar] = useState<string | null>(
    null
  );

  // Estados para registro de cliente
  const [mostrarRegistroCliente, setMostrarRegistroCliente] = useState(false);

  // Estados para filtros y paginación
  const [filtros, setFiltros] = useState({
    estado: "todos",
    prioridad: "todas",
    servicio: "todos",
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const { toast } = useToast();

  // Cargar las cotizaciones desde la API
  const cargarCotizaciones = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: paginaActual,
        limit: ITEMS_POR_PAGINA,
      };

      if (filtros.estado && filtros.estado !== "todos") {
        params.estado = filtros.estado;
      }

      const response = await apiService.obtenerCotizaciones(params);

      if (response.success && response.data) {
        setCotizaciones(response.data);
        if (response.pagination) {
          setTotalPaginas(response.pagination.totalPages);
        }
      } else {
        setCotizaciones([]);
      }
    } catch (error) {
      console.error("Error cargando cotizaciones:", error);
      setCotizaciones([]);
    } finally {
      setIsLoading(false);
    }
  }, [filtros, paginaActual]);

  useEffect(() => {
    cargarCotizaciones();
  }, [cargarCotizaciones]);

  // Funciones de manejo
  const actualizarCotizacion = async (
    id: string,
    estado: ICotizacion["estado"],
    monto?: number,
    comentarios?: string
  ) => {
    try {
      setIsUpdating(true);
      setErrorMsg(null);

      const response = await fetch("/api/cotizaciones", {
        method: "PUT",
        body: JSON.stringify({
          id,
          estado,
          ...(monto && { monto }),
          ...(comentarios && { comentarios }),
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar la cotización");

      setCotizaciones((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                estado,
                ...(monto && { monto }),
                ...(comentarios && { comentarios }),
              }
            : c
        )
      );

      setMostrarDetalles(false);
    } catch (error) {
      setErrorMsg("Error al actualizar la cotización");
    } finally {
      setIsUpdating(false);
    }
  };

  const eliminarCotizacion = async () => {
    if (!cotizacionAEliminar) return;

    try {
      setIsUpdating(true);
      const response = await apiService.eliminarCotizacion(cotizacionAEliminar);

      if (response.success) {
        setCotizaciones((prev) =>
          prev.filter((c) => c._id !== cotizacionAEliminar)
        );
        setMostrarConfirmacion(false);
        setCotizacionAEliminar(null);
        toast({
          title: "Cotización eliminada",
          description: "La cotización ha sido eliminada correctamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cotización",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const verDetalleCotizacion = (cotizacion: ICotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarDetalles(true);
  };

  const iniciarRegistroCliente = (cotizacion: ICotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarDetalles(false);
    setMostrarRegistroCliente(true);
    setActiveTab("registro");
  };

  const confirmarEliminarCotizacion = (id: string) => {
    setCotizacionAEliminar(id);
    setMostrarConfirmacion(true);
  };

  if (reducida) {
    return (
      <CotizacionesReducidas
        cotizaciones={cotizaciones}
        isLoading={isLoading}
        onVerTodas={onVerTodas}
      />
    );
  }

  const estadisticas = getEstadisticas(cotizaciones);

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="cotizaciones"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cotizaciones" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gestión de Cotizaciones
          </TabsTrigger>
          <TabsTrigger value="registro" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Registro de Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cotizaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Gestión de Cotizaciones
              </CardTitle>
              <CardDescription>
                Administre todas las solicitudes de cotización de sus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CotizacionesEstadisticas estadisticas={estadisticas} />
              <TablaCotizaciones
                cotizaciones={cotizaciones}
                isLoading={isLoading}
                onVerDetalle={verDetalleCotizacion}
                onRegistrarCliente={iniciarRegistroCliente}
                onEliminar={confirmarEliminarCotizacion}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registro" className="mt-6">
          {cotizacionSeleccionada && mostrarRegistroCliente ? (
            <RegistroClientes
              cotizacionInicial={{
                nombre: cotizacionSeleccionada.nombre,
                correo: cotizacionSeleccionada.email,
                telefono: cotizacionSeleccionada.telefono || "",
                empresa: cotizacionSeleccionada.empresa || "",
                montoMensual: cotizacionSeleccionada.total || 0,
                planSugerido: "basico",
              }}
              onComplete={() => {
                setActiveTab("cotizaciones");
                setMostrarRegistroCliente(false);
                setCotizacionSeleccionada(null);
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Registro de Clientes
                </CardTitle>
                <CardDescription>
                  Registre nuevos clientes en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserPlus className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">
                    Registrar un nuevo cliente
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    Puede crear un cliente desde cero o seleccionar una
                    cotización aprobada
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ModalDetallesCotizacion
        cotizacion={cotizacionSeleccionada}
        isOpen={mostrarDetalles}
        isUpdating={isUpdating}
        errorMsg={errorMsg}
        onClose={() => setMostrarDetalles(false)}
        onUpdate={actualizarCotizacion}
        onRegistrarCliente={iniciarRegistroCliente}
        onEliminar={confirmarEliminarCotizacion}
      />

      <ModalConfirmacionEliminacion
        isOpen={mostrarConfirmacion}
        isLoading={isUpdating}
        onConfirm={eliminarCotizacion}
        onCancel={() => setMostrarConfirmacion(false)}
      />

      <Toaster />
    </div>
  );
}
