import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    activos: number;
    sospechosos: number;
    fraudes: number;
    consumoTotal: number;
    anomaliasTotal: number;
  };
  filtroEstado: string;
  onFiltroChange: (filtro: string) => void;
  medidoresInactivos: number;
}

export function StatsCards({
  stats,
  filtroEstado,
  onFiltroChange,
  medidoresInactivos,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "todos" ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() => onFiltroChange("todos")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Total Medidores</p>
        </CardContent>
      </Card>

      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "active" ? "ring-2 ring-green-500" : ""
        }`}
        onClick={() => onFiltroChange("active")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.activos}
          </div>
          <p className="text-xs text-muted-foreground">Activos</p>
        </CardContent>
      </Card>

      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "suspicious" ? "ring-2 ring-yellow-500" : ""
        }`}
        onClick={() => onFiltroChange("suspicious")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.sospechosos}
          </div>
          <p className="text-xs text-muted-foreground">Sospechosos</p>
        </CardContent>
      </Card>

      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "fraud_detected" ? "ring-2 ring-red-500" : ""
        }`}
        onClick={() => onFiltroChange("fraud_detected")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.fraudes}</div>
          <p className="text-xs text-muted-foreground">Fraudes</p>
        </CardContent>
      </Card>

      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "inactive" ? "ring-2 ring-gray-500" : ""
        }`}
        onClick={() => onFiltroChange("inactive")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {medidoresInactivos}
          </div>
          <p className="text-xs text-muted-foreground">Inactivos</p>
        </CardContent>
      </Card>

      <Card
        className={`border-muted cursor-pointer transition-all hover:shadow-lg ${
          filtroEstado === "anomalias" ? "ring-2 ring-orange-500" : ""
        }`}
        onClick={() => onFiltroChange("anomalias")}
      >
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.anomaliasTotal}
          </div>
          <p className="text-xs text-muted-foreground">Anomalías</p>
        </CardContent>
      </Card>
    </div>
  );
}
