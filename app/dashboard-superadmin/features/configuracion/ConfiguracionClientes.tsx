"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, RefreshCw, Edit, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService, ICliente } from "@/lib/api/apiService";

export function ConfiguracionClientes() {
  // Estados para gestión de perfiles de clientes
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ICliente | null>(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [actualizandoCliente, setActualizandoCliente] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Función para cargar clientes
  const cargarClientes = async () => {
    try {
      setCargandoClientes(true);
      console.log("🔄 Cargando clientes...");

      const response = await apiService.obtenerClientes();

      if (response.success && response.data) {
        // Asegurar que response.data sea un array
        const clientesArray = Array.isArray(response.data)
          ? response.data
          : (response.data as any).clientes || [];

        console.log("✅ Clientes cargados:", clientesArray.length);
        setClientes(clientesArray);
      } else {
        console.error("❌ Error al cargar clientes:", response.error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error al cargar clientes:", error);
      toast({
        title: "Error",
        description: "Error al conectar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setCargandoClientes(false);
    }
  };

  // Función para abrir modal de edición de cliente
  const abrirModalCliente = (cliente: ICliente) => {
    setClienteSeleccionado({ ...cliente });
    setModalClienteAbierto(true);
  };

  // Función para cerrar modal
  const cerrarModalCliente = () => {
    setModalClienteAbierto(false);
    setClienteSeleccionado(null);
  };

  // Función para actualizar cliente
  const actualizarClientePerfil = async () => {
    if (!clienteSeleccionado) return;

    setActualizandoCliente(true);

    try {
      const response = await apiService.actualizarCliente(
        clienteSeleccionado._id,
        {
          nombre: clienteSeleccionado.nombre,
          correo: clienteSeleccionado.correo,
          telefono: clienteSeleccionado.telefono,
          empresa: clienteSeleccionado.empresa,
        }
      );

      if (response.success) {
        toast({
          title: "Éxito",
          description: "Perfil del cliente actualizado correctamente.",
        });

        // Actualizar la lista de clientes
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente._id === clienteSeleccionado._id
              ? { ...cliente, ...clienteSeleccionado }
              : cliente
          )
        );

        cerrarModalCliente();
      } else {
        throw new Error(response.error || "Error al actualizar el cliente");
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil del cliente.",
        variant: "destructive",
      });
    } finally {
      setActualizandoCliente(false);
    }
  };

  // Función para manejar cambios en los campos del cliente
  const manejarCambioCliente = (campo: keyof ICliente, valor: string) => {
    if (clienteSeleccionado) {
      setClienteSeleccionado({
        ...clienteSeleccionado,
        [campo]: valor,
      });
    }
  };

  // Filtrar clientes basado en búsqueda y estado
  const clientesFiltrados = useMemo(() => {
    // Asegurar que clientes sea un array antes de filtrar
    if (!Array.isArray(clientes)) {
      console.warn("⚠️ clientes no es un array:", clientes);
      return [];
    }

    return clientes.filter((cliente) => {
      const coincideBusqueda =
        !busquedaCliente ||
        cliente.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.correo?.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.numeroCliente
          ?.toLowerCase()
          .includes(busquedaCliente.toLowerCase());

      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activo" && (cliente.activo || cliente.esActivo)) ||
        (filtroEstado === "inactivo" && !cliente.activo && !cliente.esActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [clientes, busquedaCliente, filtroEstado]);

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Perfiles de Clientes</CardTitle>
          <CardDescription>
            Administre la información de perfil de los clientes registrados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nombre, correo o número de cliente..."
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={cargarClientes}
              disabled={cargandoClientes}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${cargandoClientes ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>

          {/* Tabla de clientes */}
          {cargandoClientes ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-500">Cargando clientes...</span>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Número Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cliente.nombre}</div>
                            {cliente.empresa && (
                              <div className="text-sm text-gray-500">
                                {cliente.empresa}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{cliente.correo || "N/A"}</TableCell>
                        <TableCell>{cliente.telefono || "N/A"}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {cliente.numeroCliente || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              cliente.activo || cliente.esActivo
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {cliente.activo || cliente.esActivo
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirModalCliente(cliente)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        {busquedaCliente || filtroEstado !== "todos"
                          ? "No se encontraron clientes que coincidan con los filtros"
                          : "No hay clientes registrados"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {clientes.length}
              </div>
              <div className="text-sm text-gray-500">Total Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {clientes.filter((c) => c.activo || c.esActivo).length}
              </div>
              <div className="text-sm text-gray-500">Clientes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {clientes.filter((c) => !c.activo && !c.esActivo).length}
              </div>
              <div className="text-sm text-gray-500">Clientes Inactivos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar cliente */}
      <Dialog open={modalClienteAbierto} onOpenChange={setModalClienteAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil de Cliente</DialogTitle>
            <DialogDescription>
              Modifique la información del perfil del cliente. Los campos
              bloqueados no se pueden editar.
            </DialogDescription>
          </DialogHeader>

          {clienteSeleccionado && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input
                  id="edit-nombre"
                  value={clienteSeleccionado.nombre}
                  onChange={(e) =>
                    manejarCambioCliente("nombre", e.target.value)
                  }
                  placeholder="Nombre completo del cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo Electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={clienteSeleccionado.correo || ""}
                  onChange={(e) =>
                    manejarCambioCliente("correo", e.target.value)
                  }
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  value={clienteSeleccionado.telefono || ""}
                  onChange={(e) =>
                    manejarCambioCliente("telefono", e.target.value)
                  }
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-empresa">Empresa</Label>
                <Input
                  id="edit-empresa"
                  value={clienteSeleccionado.empresa || ""}
                  onChange={(e) =>
                    manejarCambioCliente("empresa", e.target.value)
                  }
                  placeholder="Nombre de la empresa"
                />
              </div>

              <Separator className="my-4" />

              {/* Campos bloqueados */}
              <div className="space-y-2">
                <Label htmlFor="edit-numero-cliente" className="text-gray-500">
                  Número de Cliente (No editable)
                </Label>
                <Input
                  id="edit-numero-cliente"
                  value={clienteSeleccionado.numeroCliente || "No asignado"}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-gray-500">
                  Rol (No editable)
                </Label>
                <Input
                  id="edit-role"
                  value={clienteSeleccionado.role || "cliente"}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500"
                />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Nota:</strong> El número de cliente y el rol son
                  campos del sistema que no se pueden modificar desde esta
                  interfaz.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={cerrarModalCliente}>
              Cancelar
            </Button>
            <Button
              onClick={actualizarClientePerfil}
              disabled={actualizandoCliente}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {actualizandoCliente ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
