"use client";

import { useState } from "react";
import { useNotificacionesCliente } from "@/hooks/useNotificacionesCliente";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  BellOff, 
  Trash2, 
  CheckCheck,
  AlertTriangle,
  Zap,
  CreditCard,
  WifiOff,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export function NotificacionesCliente() {
  const {
    notificaciones,
    loading,
    resumen,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
  } = useNotificacionesCliente();

  const [expandida, setExpandida] = useState<string | null>(null);

  // Iconos por categoría
  const iconosPorCategoria = {
    dispositivo: WifiOff,
    facturacion: CreditCard,
    consumo: TrendingUp,
    mantenimiento: AlertTriangle,
    sistema: Zap,
  };

  // Colores por tipo
  const coloresPorTipo = {
    error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  };

  const badgePorTipo = {
    error: "destructive",
    warning: "warning",
    info: "default",
    success: "success",
  } as const;

  const badgePorPrioridad = {
    urgente: "🚨 Urgente",
    alta: "⚠️ Alta",
    media: "📌 Media",
    baja: "📋 Baja",
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Mis Notificaciones</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {resumen.noLeidas > 0 
                    ? `Tienes ${resumen.noLeidas} notificación${resumen.noLeidas > 1 ? 'es' : ''} sin leer`
                    : "No tienes notificaciones sin leer"
                  }
                </p>
              </div>
            </div>
            {resumen.noLeidas > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={marcarTodasComoLeidas}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Dispositivo</p>
                <p className="text-2xl font-bold">{resumen.porCategoria.dispositivo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Facturación</p>
                <p className="text-2xl font-bold">{resumen.porCategoria.facturacion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Consumo</p>
                <p className="text-2xl font-bold">{resumen.porCategoria.consumo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold">{resumen.urgentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-3">
        {notificaciones.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No tienes notificaciones
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Te notificaremos sobre tu consumo, boletas y estado del dispositivo
              </p>
            </CardContent>
          </Card>
        ) : (
          notificaciones.map((notif) => {
            const Icono = iconosPorCategoria[notif.categoria];
            const esExpandida = expandida === notif._id;
            
            return (
              <Card
                key={notif._id}
                className={`${coloresPorTipo[notif.tipo]} ${!notif.leida ? 'border-l-4' : ''} transition-all hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icono */}
                    <div className={`p-2 rounded-lg ${
                      notif.tipo === 'error' ? 'bg-red-100 dark:bg-red-900' :
                      notif.tipo === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      notif.tipo === 'info' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-green-100 dark:bg-green-900'
                    }`}>
                      <Icono className="h-5 w-5" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">
                              {notif.titulo}
                            </h3>
                            {!notif.leida && (
                              <Badge variant="default" className="text-xs">
                                Nuevo
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {badgePorPrioridad[notif.prioridad]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notif.mensaje}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notif.createdAt).toLocaleString('es-CL')}
                          </p>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1">
                          {!notif.leida && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => marcarComoLeida(notif._id)}
                              title="Marcar como leída"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => eliminarNotificacion(notif._id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {notif.metadata && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setExpandida(esExpandida ? null : notif._id)}
                              title={esExpandida ? "Ocultar detalles" : "Ver detalles"}
                            >
                              {esExpandida ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Detalles expandidos */}
                      {esExpandida && notif.metadata && (
                        <div className="mt-4 p-3 bg-background/50 rounded-lg border">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Detalles:
                          </p>
                          <div className="space-y-1 text-sm">
                            {Object.entries(notif.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="font-medium">
                                  {typeof value === 'number' && key.includes('monto') 
                                    ? `$${value.toLocaleString('es-CL')}`
                                    : String(value)
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Acción */}
                      {notif.accion && (
                        <div className="mt-3">
                          <Button
                            variant={notif.accion.tipo === 'button' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              if (notif.accion?.url) {
                                window.location.href = notif.accion.url;
                              }
                            }}
                          >
                            {notif.accion.texto}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
