import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Building, CalendarDays } from "lucide-react";
import { DatoSector } from "./types";
import {
  PieChartPrincipal,
  BarChartConsumo,
  RadialChartConsumo,
  HorizontalBarChart,
} from "./ConsumoSectorialCharts";
import { ConsumoSectorialEstadisticas } from "./ConsumoSectorialEstadisticas";

interface ConsumoSectorialTabsProps {
  datosSectores: DatoSector[];
  datosAreas: DatoSector[];
  datosFranjasHorarias: DatoSector[];
  loading: boolean;
}

export function ConsumoSectorialTabs({
  datosSectores,
  datosAreas,
  datosFranjasHorarias,
  loading,
}: ConsumoSectorialTabsProps) {
  return (
    <Tabs defaultValue="sectores">
      <TabsList className="w-full">
        <TabsTrigger value="sectores" className="flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          Por Equipamiento
        </TabsTrigger>
        <TabsTrigger value="areas" className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          Por Área
        </TabsTrigger>
        <TabsTrigger value="horarios" className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          Por Horario
        </TabsTrigger>
      </TabsList>

      {/* Tab de Equipamiento */}
      <TabsContent value="sectores" className="mt-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Equipamiento</CardTitle>
              <CardDescription>
                Porcentaje de consumo por tipo de equipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartPrincipal data={datosSectores} loading={loading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desglose Detallado</CardTitle>
              <CardDescription>Consumo y costos por sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumoSectorialEstadisticas datos={datosSectores} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Comparativo por Equipamiento</CardTitle>
              <CardDescription>
                Visualización en barras del consumo por equipamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartConsumo data={datosSectores} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab de Áreas */}
      <TabsContent value="areas" className="mt-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Área</CardTitle>
              <CardDescription>
                Consumo eléctrico por piso y zona del edificio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadialChartConsumo data={datosAreas} loading={loading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ranking de Consumo por Área</CardTitle>
              <CardDescription>
                Comparativa horizontal del consumo por área
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart data={datosAreas} loading={loading} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas por Área</CardTitle>
              <CardDescription>
                Análisis detallado del consumo por zonas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumoSectorialEstadisticas datos={datosAreas} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab de Horarios */}
      <TabsContent value="horarios" className="mt-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Franja Horaria</CardTitle>
              <CardDescription>
                Distribución del consumo a lo largo del día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartPrincipal
                data={datosFranjasHorarias}
                loading={loading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfil de Consumo Diario</CardTitle>
              <CardDescription>
                Análisis temporal del consumo eléctrico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartConsumo data={datosFranjasHorarias} loading={loading} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Temporal del Consumo</CardTitle>
              <CardDescription>
                Estadísticas detalladas por franja horaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumoSectorialEstadisticas datos={datosFranjasHorarias} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
