"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Battery,
  BarChart2,
  ArrowDownUp,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Bell,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { useWebSocket } from "@/hooks/useWebSocket";

// Interfaces
interface AlertasSistemaProps {
  reducida?: boolean;
}

export function AlertasSistema({ reducida = false }: AlertasSistemaProps) {
  const [alertaExpandida, setAlertaExpandida] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadImportant,
  } = useNotifications();

  const { isConnected, sendMessage } = useWebSocket();
  const { toast } = useToast();

  // Estados simulados para demostración
  const estados = ["activa", "en revisión", "programada", "resuelta"];

  // Filtrar notificaciones
  const notificacionesFiltradas = notifications.filter((notificacion) => {
    const cumpleBusqueda =
      notificacion.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      notificacion.dispositivo
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      false ||
      notificacion.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      false;

    const cumpleTipo =
      filtroTipo === "todos" || notificacion.tipo === filtroTipo;
    const cumpleEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "leidas" && notificacion.leida) ||
      (filtroEstado === "no_leidas" && !notificacion.leida);

    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

  // Calcular resumen
  const resumenAlertas = {
    total: notifications.length,
    errorCritico: notifications.filter((n) => n.tipo === "error").length,
    advertencia: notifications.filter((n) => n.tipo === "advertencia").length,
    informacion: notifications.filter((n) => n.tipo === "informacion").length,
    exito: notifications.filter((n) => n.tipo === "exito").length,
    noLeidas: unreadCount,
    importantes: getUnreadImportant().length,
    resueltas: notifications.filter((n) => n.leida).length,
  };

  const toggleAlerta = (id: string) => {
    if (alertaExpandida === id) {
      setAlertaExpandida(null);
    } else {
      setAlertaExpandida(id);
      // Marcar como leída cuando se expande
      markAsRead(id);
    }
  };

  // Componente para el ícono según tipo de alerta
  const IconoAlerta = ({ tipo }: { tipo: string }) => {
    switch (tipo) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "advertencia":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "informacion":
        return <BellRing className="h-5 w-5 text-blue-600" />;
      case "exito":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-600" />;
    }
  };

  // Componente para el badge de tipo
  const BadgeTipo = ({ tipo }: { tipo: string }) => {
    switch (tipo) {
      case "error":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            Crítico
          </Badge>
        );
      case "advertencia":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
          >
            Advertencia
          </Badge>
        );
      case "informacion":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
          >
            Información
          </Badge>
        );
      case "exito":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
          >
            Éxito
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
          >
            {tipo}
          </Badge>
        );
    }
  };

  // Simular nueva alerta (para demostración)
  const simularAlerta = () => {
    const tiposAlertas = [
      "error",
      "advertencia",
      "informacion",
      "exito",
    ] as const;
    const mensajes = [
      "Dispositivo desconectado inesperadamente",
      "Nivel de batería crítico detectado",
      "Actualización de firmware completada",
      "Sistema de respaldo activado",
      "Consumo anómalo en sector norte",
      "Conexión restablecida correctamente",
      "Temperatura del dispositivo elevada",
      "Mantenimiento programado pendiente",
    ];

    const ubicaciones = [
      "Edificio Central - Piso 1",
      "Edificio Norte - Piso 2",
      "Edificio Este - Planta Baja",
      "Edificio Oeste - Piso 3",
      "Sala de Servidores",
    ];

    const tipo = tiposAlertas[Math.floor(Math.random() * tiposAlertas.length)];
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    const ubicacion =
      ubicaciones[Math.floor(Math.random() * ubicaciones.length)];

    addNotification({
      tipo,
      mensaje,
      ubicacion,
      dispositivo: `DEV${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
      importante: tipo === "error" || tipo === "advertencia",
    });

    toast({
      title: "Nueva alerta generada",
      description: mensaje,
      variant: tipo === "error" ? "destructive" : "default",
    });
  };

  // Asignar alerta a técnico
  const asignarAlerta = (alertaId: string) => {
    // Simular asignación
    toast({
      title: "Alerta asignada",
      description: "La alerta ha sido asignada al técnico disponible",
    });

    if (isConnected) {
      sendMessage("assign_alert", {
        alertId: alertaId,
        technicianId: "TECH001",
      });
    }
  };

  // Resolver alerta
  const resolverAlerta = (alertaId: string) => {
    markAsRead(alertaId);
    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });

    if (isConnected) {
      sendMessage("resolve_alert", { alertId: alertaId });
    }
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Críticas</div>
            <div className="text-xl font-bold text-red-600">
              {resumenAlertas.errorCritico}
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Advertencias</div>
            <div className="text-xl font-bold text-amber-600">
              {resumenAlertas.advertencia}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">No leídas</span>
            <span className="text-sm font-bold">{resumenAlertas.noLeidas}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bell className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-gray-600">
              {resumenAlertas.importantes} importantes
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {notifications.slice(0, 3).map((alerta, index) => (
            <div
              key={index}
              className={`p-2 border rounded-lg ${
                alerta.tipo === "error"
                  ? "border-red-100 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                  : alerta.tipo === "advertencia"
                    ? "border-amber-100 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10"
                    : alerta.tipo === "exito"
                      ? "border-green-100 bg-green-50 dark:border-green-800 dark:bg-green-900/10"
                      : "border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10"
              }`}
            >
              <div className="flex items-start gap-2">
                <IconoAlerta tipo={alerta.tipo} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {alerta.mensaje}
                  </div>
                  <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                    {alerta.dispositivo && (
                      <>
                        <Battery className="h-3 w-3" />
                        {alerta.dispositivo}
                      </>
                    )}
                    {alerta.dispositivo && alerta.fecha && " • "}
                    {alerta.fecha && (
                      <>
                        <Clock className="h-3 w-3" />
                        {alerta.fecha}
                      </>
                    )}
                  </div>
                </div>
                {!alerta.leida && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
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
            <BellRing className="h-6 w-6 text-orange-600" />
            Centro de Alertas
            {isConnected && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Tiempo real
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 mt-1">
            Sistema de notificaciones y alertas en tiempo real
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar alertas..."
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={simularAlerta}
          >
            <Bell className="h-4 w-4" />
            Simular Alerta
          </Button>

          <Button
            className="flex items-center gap-2"
            onClick={markAllAsRead}
            disabled={resumenAlertas.noLeidas === 0}
          >
            <CheckCircle2 className="h-4 w-4" />
            Marcar todo como leído
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-300">Críticas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {resumenAlertas.errorCritico}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-amber-800 dark:text-amber-300">
                Advertencias
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {resumenAlertas.advertencia}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Requieren revisión próxima
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-300">
                Información
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {resumenAlertas.informacion}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Notificaciones del sistema
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-800 dark:text-green-300">Éxito</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {resumenAlertas.exito}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Operaciones completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filtroTipo === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("todos")}
          >
            Todos
          </Button>
          <Button
            variant={filtroTipo === "error" ? "destructive" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("error")}
          >
            Críticas
          </Button>
          <Button
            variant={filtroTipo === "advertencia" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("advertencia")}
            className={
              filtroTipo === "advertencia"
                ? "bg-amber-600 hover:bg-amber-700"
                : ""
            }
          >
            Advertencias
          </Button>
          <Button
            variant={filtroTipo === "informacion" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroTipo("informacion")}
            className={
              filtroTipo === "informacion"
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }
          >
            Información
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filtroEstado === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("todos")}
          >
            Todas
          </Button>
          <Button
            variant={filtroEstado === "no_leidas" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("no_leidas")}
          >
            No leídas ({resumenAlertas.noLeidas})
          </Button>
          <Button
            variant={filtroEstado === "leidas" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("leidas")}
          >
            Leídas
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {notificacionesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <BellRing className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay alertas que mostrar
              </h3>
              <p className="text-gray-500">
                {busqueda
                  ? "No se encontraron alertas que coincidan con la búsqueda."
                  : "No hay alertas activas en este momento."}
              </p>
            </div>
          ) : (
            notificacionesFiltradas.map((alerta, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden transition-all ${
                  alerta.tipo === "error"
                    ? "border-red-200 dark:border-red-800"
                    : alerta.tipo === "advertencia"
                      ? "border-amber-200 dark:border-amber-800"
                      : alerta.tipo === "exito"
                        ? "border-green-200 dark:border-green-800"
                        : "border-blue-200 dark:border-blue-800"
                } ${!alerta.leida ? "ring-2 ring-orange-200 dark:ring-orange-800" : ""}`}
              >
                <div
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                    alerta.tipo === "error"
                      ? "bg-red-50 dark:bg-red-900/10"
                      : alerta.tipo === "advertencia"
                        ? "bg-amber-50 dark:bg-amber-900/10"
                        : alerta.tipo === "exito"
                          ? "bg-green-50 dark:bg-green-900/10"
                          : "bg-blue-50 dark:bg-blue-900/10"
                  }`}
                  onClick={() => toggleAlerta(alerta.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <IconoAlerta tipo={alerta.tipo} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          {alerta.mensaje}
                          {!alerta.leida && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          )}
                        </h3>
                        <div className="flex items-center gap-2">
                          <BadgeTipo tipo={alerta.tipo} />
                          {alerta.importante && (
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 border-orange-200"
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Importante
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        {alerta.dispositivo && (
                          <div className="flex items-center gap-1">
                            <Battery className="h-3.5 w-3.5" />
                            <span>ID: {alerta.dispositivo}</span>
                          </div>
                        )}
                        {alerta.ubicacion && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{alerta.ubicacion}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{alerta.fecha}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{alerta.hora}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-3">
                      {alertaExpandida === alerta.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {alertaExpandida === alerta.id && (
                  <div className="p-4 bg-muted/30 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">
                          Detalles de la Alerta
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Esta alerta fue generada automáticamente por el
                          sistema de monitoreo. Se recomienda revisar el
                          dispositivo asociado y verificar su estado
                          operacional.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Estado: {alerta.leida ? "Leída" : "No leída"}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {!alerta.leida && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => asignarAlerta(alerta.id)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Asignar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(alerta.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Marcar como vista
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => resolverAlerta(alerta.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Resolver
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeNotification(alerta.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-500">
          Mostrando {notificacionesFiltradas.length} de {resumenAlertas.total}{" "}
          alertas •{resumenAlertas.importantes} importantes sin leer •
          {resumenAlertas.resueltas} resueltas este mes
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpiar todo
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-1" />
            Configurar notificaciones
          </Button>
        </div>
      </div>
    </div>
  );
}
