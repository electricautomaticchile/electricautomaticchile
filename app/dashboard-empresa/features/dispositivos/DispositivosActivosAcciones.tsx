import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  RefreshCw,
  Filter,
  Settings,
  Wifi,
  WifiOff,
  List,
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { DispositivosAccionesProps } from "./types";
import { TABS_DISPOSITIVOS } from "./config";

export function DispositivosActivosAcciones({
  busqueda,
  onBusquedaChange,
  tabActiva,
  onTabChange,
  loading,
  onRefresh,
  totalDispositivos,
  isWebSocketConnected,
}: DispositivosAccionesProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getIconForTab = (icon: string) => {
    switch (icon) {
      case "list":
        return <List className="h-4 w-4" />;
      case "check-circle":
        return <CheckCircle2 className="h-4 w-4" />;
      case "x-circle":
        return <XCircle className="h-4 w-4" />;
      case "rotate-cw":
        return <RotateCw className="h-4 w-4" />;
      case "alert-triangle":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con título y acciones principales */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Dispositivos Activos</h2>
          <Badge variant="outline" className="text-sm">
            {totalDispositivos} dispositivos
          </Badge>
          {isWebSocketConnected ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Wifi className="h-3 w-3 mr-1" />
              En línea
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-gray-50 text-gray-600 border-gray-200"
            >
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Actualizando..." : "Refrescar"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID, nombre o ubicación..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros avanzados
          </Button>
        </div>
      </div>

      {/* Tabs de filtrado por estado */}
      <Tabs value={tabActiva} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {TABS_DISPOSITIVOS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1 text-xs"
            >
              {getIconForTab(tab.icon)}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Indicadores de estado */}
      {busqueda && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Search className="h-4 w-4" />
          <span>Búsqueda activa: &quot;{busqueda}&quot;</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBusquedaChange("")}
            className="h-auto p-1 text-xs"
          >
            Limpiar
          </Button>
        </div>
      )}

      {/* Información del estado de conexión */}
      {isWebSocketConnected && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
            <Wifi className="h-4 w-4" />
            <span className="font-medium">Conexión en tiempo real activa</span>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">
                Los datos se actualizan automáticamente
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Cargando dispositivos...</span>
          </div>
        </div>
      )}
    </div>
  );
}
