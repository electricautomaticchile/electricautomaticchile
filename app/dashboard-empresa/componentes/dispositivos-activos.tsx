"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  ArrowUpDown,
  RotateCw,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  Bluetooth,
  Zap,
} from "lucide-react";
import { apiService } from "@/lib/api/apiService";
import { useWebSocket } from "@/hooks/useWebSocket";

// Interfaces
interface Dispositivo {
  id: string;
  nombre: string;
  ubicacion: string;
  estado: "activo" | "inactivo" | "mantenimiento" | "alerta";
  bateria: number;
  ultimaTransmision: string;
  tipoConexion: "Wifi" | "4G" | "Ethernet" | "Bluetooth";
  consumoActual: number;
  firmware: string;
  temperaturaOperacion?: number;
  senal?: number;
  ubicacionDetallada?: {
    edificio: string;
    piso: number;
    sala: string;
  };
}

interface ResumenDispositivos {
  total: number;
  activos: number;
  inactivos: number;
  mantenimiento: number;
  alerta: number;
  bateriaPromedio: number;
  senalPromedio: number;
  consumoTotal: number;
}

interface DispositivosActivosProps {
  reducida?: boolean;
}

export function DispositivosActivos({
  reducida = false,
}: DispositivosActivosProps) {
  const [tabActiva, setTabActiva] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [resumenDispositivos, setResumenDispositivos] =
    useState<ResumenDispositivos>({
      total: 0,
      activos: 0,
      inactivos: 0,
      mantenimiento: 0,
      alerta: 0,
      bateriaPromedio: 0,
      senalPromedio: 0,
      consumoTotal: 0,
    });

  const { toast } = useToast();
  const { isConnected, deviceData, sendMessage } = useWebSocket();

  // Cargar dispositivos del backend
  const cargarDispositivos = async () => {
    setLoading(true);
    try {
      // En un entorno real, estos datos vendrían del backend
      // const datos = await apiService.getDispositivos();

      // Simulación de datos reales con variación
      const dispositivosSimulados: Dispositivo[] = [
        {
          id: "DEV001",
          nombre: "Medidor Inteligente AC-750",
          ubicacion: "Edificio Central - Piso 1",
          estado: "activo",
          bateria: Math.floor(Math.random() * 15) + 85,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 3600000
          ).toLocaleString("es-CL"),
          tipoConexion: "Wifi",
          consumoActual: Math.floor(Math.random() * 20) + 20,
          firmware: "v3.2.1",
          temperaturaOperacion: Math.floor(Math.random() * 10) + 20,
          senal: Math.floor(Math.random() * 20) + 80,
          ubicacionDetallada: {
            edificio: "Central",
            piso: 1,
            sala: "Sala Eléctrica A",
          },
        },
        {
          id: "DEV002",
          nombre: "Medidor Inteligente AC-750",
          ubicacion: "Edificio Central - Piso 2",
          estado: "activo",
          bateria: Math.floor(Math.random() * 15) + 75,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 1800000
          ).toLocaleString("es-CL"),
          tipoConexion: "4G",
          consumoActual: Math.floor(Math.random() * 15) + 15,
          firmware: "v3.2.1",
          temperaturaOperacion: Math.floor(Math.random() * 8) + 22,
          senal: Math.floor(Math.random() * 15) + 85,
          ubicacionDetallada: {
            edificio: "Central",
            piso: 2,
            sala: "Cuarto Técnico B",
          },
        },
        {
          id: "DEV003",
          nombre: "Medidor Inteligente AC-500",
          ubicacion: "Edificio Norte - Piso 1",
          estado: Math.random() > 0.7 ? "inactivo" : "activo",
          bateria: Math.floor(Math.random() * 30) + 10,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 7200000
          ).toLocaleString("es-CL"),
          tipoConexion: "Wifi",
          consumoActual: Math.floor(Math.random() * 10),
          firmware: "v3.1.7",
          temperaturaOperacion: Math.floor(Math.random() * 5) + 25,
          senal: Math.floor(Math.random() * 30) + 50,
          ubicacionDetallada: {
            edificio: "Norte",
            piso: 1,
            sala: "Panel Principal",
          },
        },
        {
          id: "DEV004",
          nombre: "Medidor Inteligente AC-750",
          ubicacion: "Edificio Este - Piso 1",
          estado: Math.random() > 0.8 ? "mantenimiento" : "activo",
          bateria: Math.floor(Math.random() * 20) + 60,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 2400000
          ).toLocaleString("es-CL"),
          tipoConexion: "Ethernet",
          consumoActual: Math.floor(Math.random() * 8) + 5,
          firmware: "v3.2.0",
          temperaturaOperacion: Math.floor(Math.random() * 6) + 19,
          senal: 100, // Ethernet siempre 100%
          ubicacionDetallada: {
            edificio: "Este",
            piso: 1,
            sala: "Sala Servidores",
          },
        },
        {
          id: "DEV005",
          nombre: "Medidor Inteligente AC-900",
          ubicacion: "Edificio Central - Piso 3",
          estado: "activo",
          bateria: Math.floor(Math.random() * 15) + 70,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 900000
          ).toLocaleString("es-CL"),
          tipoConexion: "Ethernet",
          consumoActual: Math.floor(Math.random() * 25) + 25,
          firmware: "v3.2.1",
          temperaturaOperacion: Math.floor(Math.random() * 7) + 21,
          senal: 100,
          ubicacionDetallada: {
            edificio: "Central",
            piso: 3,
            sala: "Centro de Control",
          },
        },
        {
          id: "DEV006",
          nombre: "Medidor Inteligente AC-750",
          ubicacion: "Edificio Oeste - Piso 2",
          estado: Math.random() > 0.6 ? "alerta" : "activo",
          bateria: Math.floor(Math.random() * 25) + 35,
          ultimaTransmision: new Date(
            Date.now() - Math.random() * 5400000
          ).toLocaleString("es-CL"),
          tipoConexion: "Wifi",
          consumoActual: Math.floor(Math.random() * 20) + 20,
          firmware: "v3.2.1",
          temperaturaOperacion: Math.floor(Math.random() * 12) + 28,
          senal: Math.floor(Math.random() * 25) + 60,
          ubicacionDetallada: {
            edificio: "Oeste",
            piso: 2,
            sala: "Subestación C",
          },
        },
      ];

      setDispositivos(dispositivosSimulados);

      // Calcular resumen
      const total = dispositivosSimulados.length;
      const activos = dispositivosSimulados.filter(
        (d) => d.estado === "activo"
      ).length;
      const inactivos = dispositivosSimulados.filter(
        (d) => d.estado === "inactivo"
      ).length;
      const mantenimiento = dispositivosSimulados.filter(
        (d) => d.estado === "mantenimiento"
      ).length;
      const alerta = dispositivosSimulados.filter(
        (d) => d.estado === "alerta"
      ).length;
      const bateriaPromedio = Math.round(
        dispositivosSimulados.reduce((sum, d) => sum + d.bateria, 0) / total
      );
      const senalPromedio = Math.round(
        dispositivosSimulados.reduce((sum, d) => sum + (d.senal || 0), 0) /
          total
      );
      const consumoTotal = dispositivosSimulados.reduce(
        (sum, d) => sum + d.consumoActual,
        0
      );

      setResumenDispositivos({
        total,
        activos,
        inactivos,
        mantenimiento,
        alerta,
        bateriaPromedio,
        senalPromedio,
        consumoTotal,
      });
    } catch (error) {
      console.error("Error cargando dispositivos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los dispositivos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar dispositivos según búsqueda y tab activa
  const dispositivosFiltrados = dispositivos.filter((dispositivo) => {
    const cumpleBusqueda =
      dispositivo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      dispositivo.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      dispositivo.ubicacion.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleTab = tabActiva === "todos" || dispositivo.estado === tabActiva;

    return cumpleBusqueda && cumpleTab;
  });

  // Componente para el ícono de batería según nivel
  const BateriaIcon = ({ nivel }: { nivel: number }) => {
    if (nivel >= 80) return <BatteryFull className="h-4 w-4 text-green-600" />;
    if (nivel >= 50)
      return <BatteryCharging className="h-4 w-4 text-blue-600" />;
    if (nivel >= 20) return <BatteryLow className="h-4 w-4 text-amber-600" />;
    return <BatteryWarning className="h-4 w-4 text-red-600" />;
  };

  // Componente para el estado con ícono
  const EstadoDispositivo = ({ estado }: { estado: string }) => {
    switch (estado) {
      case "activo":
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">Activo</span>
          </div>
        );
      case "inactivo":
        return (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-500">Inactivo</span>
          </div>
        );
      case "mantenimiento":
        return (
          <div className="flex items-center gap-1.5">
            <RotateCw className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-600">Mantenimiento</span>
          </div>
        );
      case "alerta":
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-600">Alerta</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Componente para el ícono de conexión
  const IconoConexion = ({ tipo, senal }: { tipo: string; senal?: number }) => {
    switch (tipo) {
      case "Wifi":
        return senal && senal > 70 ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        );
      case "Ethernet":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "4G":
        return (
          <div className="w-4 h-4 bg-purple-600 rounded text-xs text-white flex items-center justify-center font-bold">
            4G
          </div>
        );
      case "Bluetooth":
        return <Bluetooth className="h-4 w-4 text-indigo-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  // Controlar dispositivo
  const controlarDispositivo = async (id: string, accion: string) => {
    try {
      if (isConnected) {
        sendMessage("device_control", { deviceId: id, action: accion });
      }

      toast({
        title: "Comando enviado",
        description: `Acción "${accion}" enviada al dispositivo ${id}`,
      });

      // Simular actualización del estado
      setTimeout(() => {
        cargarDispositivos();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el comando al dispositivo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    cargarDispositivos();

    // Actualizar cada 30 segundos
    const interval = setInterval(cargarDispositivos, 30000);
    return () => clearInterval(interval);
  }, []);

  // Procesar datos de WebSocket
  useEffect(() => {
    if (deviceData) {
      // Actualizar dispositivo específico con datos de WebSocket
      setDispositivos((prev) =>
        prev.map((dispositivo) =>
          dispositivo.id === deviceData.dispositivoId
            ? {
                ...dispositivo,
                consumoActual:
                  deviceData.data?.consumo || dispositivo.consumoActual,
                bateria: deviceData.data?.bateria || dispositivo.bateria,
                ultimaTransmision: new Date().toLocaleString("es-CL"),
                estado: "activo",
              }
            : dispositivo
        )
      );
    }
  }, [deviceData]);

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Activos</div>
            <div className="text-xl font-bold text-green-600">
              {resumenDispositivos.activos}
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Con alerta</div>
            <div className="text-xl font-bold text-amber-600">
              {resumenDispositivos.alerta}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Batería promedio</span>
            <span className="text-sm font-bold">
              {resumenDispositivos.bateriaPromedio}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${resumenDispositivos.bateriaPromedio}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1.5">
          {dispositivos.slice(0, 3).map((dispositivo, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1.5 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2">
                <IconoConexion
                  tipo={dispositivo.tipoConexion}
                  senal={dispositivo.senal}
                />
                <span className="text-sm font-medium">{dispositivo.id}</span>
              </div>
              <div
                className={`text-xs px-1.5 py-0.5 rounded ${
                  dispositivo.estado === "activo"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : dispositivo.estado === "alerta"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                      : dispositivo.estado === "mantenimiento"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                }`}
              >
                {dispositivo.estado}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Versión completa del componente
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Battery className="h-6 w-6 text-orange-600" />
            Dispositivos Activos
            {isConnected && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Wifi className="h-3 w-3 mr-1" />
                En línea
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 mt-1">
            Monitoreo en tiempo real de todos los dispositivos IoT
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar dispositivo..."
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={cargarDispositivos}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Dispositivo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estado General</CardTitle>
            <CardDescription>Resumen del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">
                  {resumenDispositivos.total}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Activos</div>
                <div className="text-2xl font-bold text-green-600">
                  {resumenDispositivos.activos}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Alertas</div>
                <div className="text-2xl font-bold text-amber-600">
                  {resumenDispositivos.alerta}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Offline</div>
                <div className="text-2xl font-bold text-gray-500">
                  {resumenDispositivos.inactivos}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Batería Promedio</CardTitle>
            <CardDescription>Estado energético general</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {resumenDispositivos.bateriaPromedio}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${resumenDispositivos.bateriaPromedio}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Señal Promedio</CardTitle>
            <CardDescription>Calidad de conexión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {resumenDispositivos.senalPromedio}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${resumenDispositivos.senalPromedio}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Consumo Total</CardTitle>
            <CardDescription>Consumo actual agregado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {resumenDispositivos.consumoTotal.toFixed(1)}{" "}
              <span className="text-base text-gray-500">kWh</span>
            </div>
            <div className="text-sm text-gray-500">
              Promedio:{" "}
              {(
                resumenDispositivos.consumoTotal / resumenDispositivos.total
              ).toFixed(1)}{" "}
              kWh/dispositivo
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tabActiva} onValueChange={setTabActiva} className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="todos">
            Todos ({resumenDispositivos.total})
          </TabsTrigger>
          <TabsTrigger value="activo">
            Activos ({resumenDispositivos.activos})
          </TabsTrigger>
          <TabsTrigger value="inactivo">
            Inactivos ({resumenDispositivos.inactivos})
          </TabsTrigger>
          <TabsTrigger value="mantenimiento">
            Mantenimiento ({resumenDispositivos.mantenimiento})
          </TabsTrigger>
          <TabsTrigger value="alerta">
            Con alerta ({resumenDispositivos.alerta})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Vista desktop - Tabla */}
          <div className="hidden md:block relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 flex items-center gap-1 cursor-pointer"
                  >
                    ID <ArrowUpDown className="h-3 w-3" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Dispositivo
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Ubicación
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Batería
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Señal
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Consumo
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Última transmisión
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {dispositivosFiltrados.map((dispositivo, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-slate-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-4 py-3 font-medium">{dispositivo.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{dispositivo.nombre}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {dispositivo.firmware} •
                        <IconoConexion
                          tipo={dispositivo.tipoConexion}
                          senal={dispositivo.senal}
                        />
                        {dispositivo.tipoConexion}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {dispositivo.ubicacion}
                          </div>
                          {dispositivo.ubicacionDetallada && (
                            <div className="text-xs text-gray-500">
                              {dispositivo.ubicacionDetallada.sala}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <EstadoDispositivo estado={dispositivo.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <BateriaIcon nivel={dispositivo.bateria} />
                        <span>{dispositivo.bateria}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="text-sm">{dispositivo.senal}%</div>
                        <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (dispositivo.senal || 0) > 70
                                ? "bg-green-500"
                                : (dispositivo.senal || 0) > 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${dispositivo.senal}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {dispositivo.consumoActual > 0 ? (
                        `${dispositivo.consumoActual} kWh`
                      ) : (
                        <span className="text-gray-500">Sin datos</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {dispositivo.ultimaTransmision}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            controlarDispositivo(dispositivo.id, "ver_detalles")
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            controlarDispositivo(dispositivo.id, "configurar")
                          }
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil - Cards */}
          <div className="md:hidden space-y-4">
            {dispositivosFiltrados.map((dispositivo, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold">{dispositivo.id}</div>
                      <div className="text-sm text-gray-500">
                        {dispositivo.nombre}
                      </div>
                    </div>
                    <EstadoDispositivo estado={dispositivo.estado} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <BateriaIcon nivel={dispositivo.bateria} />
                      <span className="text-sm">{dispositivo.bateria}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconoConexion
                        tipo={dispositivo.tipoConexion}
                        senal={dispositivo.senal}
                      />
                      <span className="text-sm">{dispositivo.senal}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {dispositivo.ubicacion}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-500">Consumo: </span>
                      <span className="font-medium">
                        {dispositivo.consumoActual} kWh
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          controlarDispositivo(dispositivo.id, "ver_detalles")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          controlarDispositivo(dispositivo.id, "configurar")
                        }
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {dispositivosFiltrados.length} de{" "}
          {resumenDispositivos.total} dispositivos
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
