"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  Leaf,
  DollarSign,
  Droplets,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useCoordinadorData } from "@/hooks/useCoordinadorData";
import { Button } from "@/components/ui/button";

export default function SistemaElectricoMetrics() {
  const { data, loading, error, refetch } = useCoordinadorData();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CL").format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Cargando datos del Sistema Eléctrico Nacional...</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error al cargar datos
              </h3>
              <p className="text-muted-foreground mb-4">
                No se pudieron obtener los datos del sistema eléctrico
              </p>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            Última actualización:{" "}
            {new Date(data.fecha).toLocaleDateString("es-CL")}
            {error && (
              <Badge
                variant="outline"
                className="text-orange-500 border-orange-500/20"
              >
                Datos de demostración
              </Badge>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Demanda del Sistema */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-blue-500/10 hover:border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  MW
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">
                {formatNumber(data.demanda.promedio)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Demanda Promedio
              </p>
              <div className="text-xs text-muted-foreground">
                Máximo: {formatNumber(data.demanda.maximo)} MW
              </div>
            </CardContent>
          </Card>

          {/* Generación Total */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-green-500/10 hover:border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  MW
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">
                {formatNumber(data.generacion.total)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Generación Total
              </p>
              <div className="text-xs text-muted-foreground">
                Sistema interconectado
              </div>
            </CardContent>
          </Card>

          {/* Energías Renovables */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-emerald-500/10 hover:border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-500" />
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-emerald-500/10 text-emerald-600"
                >
                  {data.generacion.porcentajeERNC}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-1">
                {formatNumber(data.generacion.ernc)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Energías Renovables
              </p>
              <div className="text-xs text-muted-foreground">
                ERNC del total
              </div>
            </CardContent>
          </Card>

          {/* Costo Marginal */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-orange-500/10 hover:border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  USD/MWh
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-1">
                {data.costoMarginal.promedio}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Costo Marginal
              </p>
              <div className="text-xs text-muted-foreground">
                Promedio del sistema
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional sobre embalses */}
        {data.embalses.cantidad > 0 && (
          <div className="mt-8 text-center">
            <Card className="inline-block border border-cyan-500/10 bg-cyan-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      {data.embalses.cantidad} embalses monitoreados
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cota promedio: {data.embalses.cotaPromedio} m.s.n.m.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botón de actualización */}
        <div className="mt-6 text-center">
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar datos
          </Button>
        </div>
      </div>
    </div>
  );
}
