"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Activity,
  Copy,
} from "lucide-react";
import {
  apiService,
  IEmpresa,
  ICrearEmpresa,
  CrearEmpresaResponse,
  ResetearPasswordEmpresaResponse,
} from "@/lib/api/apiService";

interface EstadisticasEmpresas {
  totales: {
    total: number;
    activas: number;
    suspendidas: number;
    inactivas: number;
  };
  ultimas: IEmpresa[];
  porRegion: { _id: string; count: number }[];
}

interface GestionEmpresasProps {
  reducida?: boolean;
}

interface Credenciales {
  numeroCliente: string;
  correo: string;
  password: string;
  passwordTemporal: boolean;
  mensaje: string;
}

export default function GestionEmpresas({
  reducida = false,
}: GestionEmpresasProps) {
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEmpresas | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroRegion, setFiltroRegion] = useState<string>("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<IEmpresa | null>(null);
  const [showCredenciales, setShowCredenciales] = useState<Credenciales | null>(
    null
  );
  const { toast } = useToast();

  // Estado para crear nueva empresa
  const [nuevaEmpresa, setNuevaEmpresa] = useState<ICrearEmpresa>({
    nombreEmpresa: "",
    razonSocial: "",
    rut: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    contactoPrincipal: {
      nombre: "",
      cargo: "",
      telefono: "",
      correo: "",
    },
  });

  const regiones = [
    "Región de Arica y Parinacota",
    "Región de Tarapacá",
    "Región de Antofagasta",
    "Región de Atacama",
    "Región de Coquimbo",
    "Región de Valparaíso",
    "Región Metropolitana",
    "Región del Libertador General Bernardo O'Higgins",
    "Región del Maule",
    "Región de Ñuble",
    "Región del Biobío",
    "Región de La Araucanía",
    "Región de Los Ríos",
    "Región de Los Lagos",
    "Región Aysén del General Carlos Ibáñez del Campo",
    "Región de Magallanes y de la Antártica Chilena",
  ];

  useEffect(() => {
    cargarEmpresas();
    cargarEstadisticas();
  }, [currentPage, filtroEstado, filtroRegion, searchTerm]);

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (filtroEstado !== "todos") params.estado = filtroEstado;
      if (filtroRegion !== "todas") params.region = filtroRegion;
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.obtenerEmpresas(params);

      if (response.success && response.data) {
        setEmpresas(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al cargar empresas",
        });
      }
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar empresas",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await apiService.obtenerEstadisticasEmpresas();
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const crearEmpresa = async () => {
    try {
      // Validaciones básicas
      if (
        !nuevaEmpresa.nombreEmpresa ||
        !nuevaEmpresa.razonSocial ||
        !nuevaEmpresa.rut ||
        !nuevaEmpresa.correo
      ) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Nombre, razón social, RUT y correo son requeridos",
        });
        return;
      }

      if (
        !nuevaEmpresa.contactoPrincipal.nombre ||
        !nuevaEmpresa.contactoPrincipal.correo
      ) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Datos del contacto principal son requeridos",
        });
        return;
      }

      const response: CrearEmpresaResponse =
        await apiService.crearEmpresa(nuevaEmpresa);

      if (response.success && response.data) {
        toast({
          variant: "default",
          title: "Empresa creada exitosamente",
          description: `Se ha creado la empresa ${response.data.nombreEmpresa}`,
        });

        // Mostrar credenciales - están en el nivel raíz de la respuesta
        setShowCredenciales({
          numeroCliente: response.credenciales.numeroCliente,
          correo: response.credenciales.correo,
          password: response.credenciales.password,
          passwordTemporal: response.credenciales.passwordTemporal,
          mensaje: response.credenciales.mensaje,
        });

        // Limpiar formulario y cerrar modal
        setNuevaEmpresa({
          nombreEmpresa: "",
          razonSocial: "",
          rut: "",
          correo: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          region: "",
          contactoPrincipal: {
            nombre: "",
            cargo: "",
            telefono: "",
            correo: "",
          },
        });
        setShowCreateModal(false);

        // Recargar lista
        cargarEmpresas();
        cargarEstadisticas();
      } else {
        toast({
          variant: "destructive",
          title: "Error al crear empresa",
          description: response.error || "Error desconocido",
        });
      }
    } catch (error) {
      console.error("Error al crear empresa:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear empresa",
      });
    }
  };

  const cambiarEstadoEmpresa = async (
    id: string,
    nuevoEstado: "activo" | "suspendido" | "inactivo",
    motivo?: string
  ) => {
    try {
      const response = await apiService.cambiarEstadoEmpresa(
        id,
        nuevoEstado,
        motivo
      );

      if (response.success) {
        toast({
          variant: "default",
          title: "Estado actualizado",
          description: `La empresa ha sido marcada como ${nuevoEstado}`,
        });
        cargarEmpresas();
        cargarEstadisticas();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al cambiar estado",
        });
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cambiar estado",
      });
    }
  };

  const resetearPassword = async (id: string) => {
    try {
      const response: ResetearPasswordEmpresaResponse =
        await apiService.resetearPasswordEmpresa(id);

      if (response.success && response.data) {
        toast({
          variant: "default",
          title: "Contraseña reseteada",
          description: "Se ha generado una nueva contraseña temporal",
        });

        // Mostrar nueva contraseña
        setShowCredenciales({
          numeroCliente: response.data.numeroCliente,
          correo: response.data.correo,
          password: response.nuevaPassword,
          passwordTemporal: true,
          mensaje: "Nueva contraseña temporal generada",
        });

        cargarEmpresas();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Error al resetear contraseña",
        });
      }
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al resetear contraseña",
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        );
      case "suspendido":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Suspendido
          </Badge>
        );
      case "inactivo":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Inactivo
          </Badge>
        );
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  // Vista reducida para el dashboard principal
  if (reducida) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Empresas Cliente
          </CardTitle>
          <CardDescription>Resumen de empresas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : estadisticas ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {estadisticas.totales.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {estadisticas.totales.activas}
                  </div>
                  <div className="text-sm text-muted-foreground">Activas</div>
                </div>
              </div>

              {estadisticas.ultimas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Últimas empresas:</h4>
                  {estadisticas.ultimas.slice(0, 3).map((empresa) => (
                    <div
                      key={empresa._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{empresa.nombreEmpresa}</span>
                      {getEstadoBadge(empresa.estado)}
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (window.location.href = "/dashboard-superadmin")}
              >
                Ver todas las empresas
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

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
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <CheckCircle className="h-4 w-4 text-green-600" />
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
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
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
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {estadisticas.totales.inactivas}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroRegion} onValueChange={setFiltroRegion}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las regiones</SelectItem>
                {regiones.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Registradas</CardTitle>
          <CardDescription>
            Lista de todas las empresas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>N° Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {empresa.nombreEmpresa}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {empresa.razonSocial}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{empresa.rut}</TableCell>
                    <TableCell className="font-mono">
                      {empresa.numeroCliente}
                    </TableCell>
                    <TableCell>{getEstadoBadge(empresa.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {empresa.region}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {empresa.contactoPrincipal.nombre}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {empresa.contactoPrincipal.correo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {empresa.ultimoAcceso ? (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(empresa.ultimoAcceso).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmpresa(empresa);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          onValueChange={(value) => {
                            if (value === "resetear") {
                              resetearPassword(empresa._id);
                            } else {
                              cambiarEstadoEmpresa(empresa._id, value as any);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Acciones" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activo">Activar</SelectItem>
                            <SelectItem value="suspendido">
                              Suspender
                            </SelectItem>
                            <SelectItem value="inactivo">Desactivar</SelectItem>
                            <SelectItem value="resetear">
                              Resetear Password
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear Empresa */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Empresa</DialogTitle>
            <DialogDescription>
              Complete los datos para registrar una nueva empresa en el sistema
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="empresa" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="empresa">Datos de la Empresa</TabsTrigger>
              <TabsTrigger value="contacto">Contacto Principal</TabsTrigger>
            </TabsList>

            <TabsContent value="empresa" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                  <Input
                    id="nombreEmpresa"
                    value={nuevaEmpresa.nombreEmpresa}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        nombreEmpresa: e.target.value,
                      })
                    }
                    placeholder="Empresa Eléctrica S.A."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    value={nuevaEmpresa.razonSocial}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        razonSocial: e.target.value,
                      })
                    }
                    placeholder="Empresa Eléctrica Sociedad Anónima"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    value={nuevaEmpresa.rut}
                    onChange={(e) =>
                      setNuevaEmpresa({ ...nuevaEmpresa, rut: e.target.value })
                    }
                    placeholder="76.123.456-7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Corporativo</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={nuevaEmpresa.correo}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        correo: e.target.value,
                      })
                    }
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={nuevaEmpresa.telefono}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        telefono: e.target.value,
                      })
                    }
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Región</Label>
                  <Select
                    value={nuevaEmpresa.region}
                    onValueChange={(value) =>
                      setNuevaEmpresa({ ...nuevaEmpresa, region: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione región" />
                    </SelectTrigger>
                    <SelectContent>
                      {regiones.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={nuevaEmpresa.ciudad}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        ciudad: e.target.value,
                      })
                    }
                    placeholder="Santiago"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={nuevaEmpresa.direccion}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        direccion: e.target.value,
                      })
                    }
                    placeholder="Av. Principal 123, Santiago"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacto" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoNombre">Nombre Completo</Label>
                  <Input
                    id="contactoNombre"
                    value={nuevaEmpresa.contactoPrincipal.nombre}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        contactoPrincipal: {
                          ...nuevaEmpresa.contactoPrincipal,
                          nombre: e.target.value,
                        },
                      })
                    }
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoCargo">Cargo</Label>
                  <Input
                    id="contactoCargo"
                    value={nuevaEmpresa.contactoPrincipal.cargo}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        contactoPrincipal: {
                          ...nuevaEmpresa.contactoPrincipal,
                          cargo: e.target.value,
                        },
                      })
                    }
                    placeholder="Gerente General"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoTelefono">Teléfono</Label>
                  <Input
                    id="contactoTelefono"
                    value={nuevaEmpresa.contactoPrincipal.telefono}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        contactoPrincipal: {
                          ...nuevaEmpresa.contactoPrincipal,
                          telefono: e.target.value,
                        },
                      })
                    }
                    placeholder="+56 9 8765 4321"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoCorreo">Correo</Label>
                  <Input
                    id="contactoCorreo"
                    type="email"
                    value={nuevaEmpresa.contactoPrincipal.correo}
                    onChange={(e) =>
                      setNuevaEmpresa({
                        ...nuevaEmpresa,
                        contactoPrincipal: {
                          ...nuevaEmpresa.contactoPrincipal,
                          correo: e.target.value,
                        },
                      })
                    }
                    placeholder="juan.perez@empresa.com"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={crearEmpresa}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Crear Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalle Empresa */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Empresa</DialogTitle>
            <DialogDescription>
              Información completa de la empresa seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedEmpresa && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Nombre:</strong> {selectedEmpresa.nombreEmpresa}
                      </div>
                      <div>
                        <strong>Razón Social:</strong>{" "}
                        {selectedEmpresa.razonSocial}
                      </div>
                      <div>
                        <strong>RUT:</strong> {selectedEmpresa.rut}
                      </div>
                      <div>
                        <strong>N° Cliente:</strong>{" "}
                        {selectedEmpresa.numeroCliente}
                      </div>
                      <div>
                        <strong>Estado:</strong>{" "}
                        {getEstadoBadge(selectedEmpresa.estado)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {selectedEmpresa.correo}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {selectedEmpresa.telefono}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {selectedEmpresa.direccion}
                      </div>
                      <div>
                        <strong>Ciudad:</strong> {selectedEmpresa.ciudad}
                      </div>
                      <div>
                        <strong>Región:</strong> {selectedEmpresa.region}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contacto Principal</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nombre:</strong>{" "}
                    {selectedEmpresa.contactoPrincipal.nombre}
                  </div>
                  <div>
                    <strong>Cargo:</strong>{" "}
                    {selectedEmpresa.contactoPrincipal.cargo}
                  </div>
                  <div>
                    <strong>Teléfono:</strong>{" "}
                    {selectedEmpresa.contactoPrincipal.telefono}
                  </div>
                  <div>
                    <strong>Correo:</strong>{" "}
                    {selectedEmpresa.contactoPrincipal.correo}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Historial</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Creada:</strong>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(
                        selectedEmpresa.fechaCreacion
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedEmpresa.ultimoAcceso && (
                    <div>
                      <strong>Último Acceso:</strong>
                      <div className="flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" />
                        {new Date(
                          selectedEmpresa.ultimoAcceso
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {selectedEmpresa.fechaSuspension && (
                    <div>
                      <strong>Suspendida:</strong>
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {new Date(
                          selectedEmpresa.fechaSuspension
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {selectedEmpresa.motivoSuspension && (
                  <div className="mt-4">
                    <strong>Motivo de Suspensión:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEmpresa.motivoSuspension}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Credenciales */}
      <Dialog
        open={!!showCredenciales}
        onOpenChange={() => setShowCredenciales(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Credenciales de Acceso
            </DialogTitle>
            <DialogDescription>
              Guarde estas credenciales y compártalas con la empresa
            </DialogDescription>
          </DialogHeader>

          {showCredenciales && (
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Key className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {showCredenciales.mensaje}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Número de Cliente
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          showCredenciales.numeroCliente.toString()
                        );
                        toast({
                          title: "Copiado",
                          description:
                            "Número de cliente copiado al portapapeles",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-mono text-lg font-bold text-blue-600">
                    {showCredenciales.numeroCliente}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Correo de Acceso
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(showCredenciales.correo);
                        toast({
                          title: "Copiado",
                          description: "Correo copiado al portapapeles",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-mono text-lg">
                    {showCredenciales.correo}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Contraseña{" "}
                      {showCredenciales.passwordTemporal && (
                        <span className="text-orange-600">(Temporal)</span>
                      )}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          showCredenciales.password
                        );
                        toast({
                          title: "Copiado",
                          description: "Contraseña copiada al portapapeles",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-mono text-lg font-bold text-green-600">
                    {showCredenciales.password}
                  </div>
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Instrucciones:</strong>
                  <br />
                  • La empresa debe acceder al dashboard usando estas
                  credenciales
                  <br />• URL de acceso:{" "}
                  <code className="bg-white px-1 rounded">
                    {window.location.origin}/auth/login
                  </code>
                  {showCredenciales.passwordTemporal && (
                    <>
                      <br />• Se solicitará cambiar la contraseña en el primer
                      acceso
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                const credencialesTexto = `
CREDENCIALES DE ACCESO - ${showCredenciales?.numeroCliente}

Número de Cliente: ${showCredenciales?.numeroCliente}
Correo: ${showCredenciales?.correo}
Contraseña: ${showCredenciales?.password}

URL de Acceso: ${window.location.origin}/auth/login

${showCredenciales?.passwordTemporal ? "NOTA: Contraseña temporal - debe cambiarla en el primer acceso" : ""}
                `.trim();

                navigator.clipboard.writeText(credencialesTexto);
                toast({
                  title: "Credenciales copiadas",
                  description:
                    "Todas las credenciales han sido copiadas al portapapeles",
                });
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Todo
            </Button>
            <Button onClick={() => setShowCredenciales(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
