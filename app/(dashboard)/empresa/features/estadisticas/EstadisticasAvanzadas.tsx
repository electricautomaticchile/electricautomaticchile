"use client";

import { useState, useEffect } from "react";
import { ConsumoTendenciaChart } from "@/components/charts/ConsumoTendenciaChart";
import { ConsumoComparativaChart } from "@/components/charts/ConsumoComparativaChart";
import { DistribucionConsumoChart } from "@/components/charts/DistribucionConsumoChart";
import { PrediccionConsumoChart } from "@/components/charts/PrediccionConsumoChart";
import { AlertasPorTipoChart } from "@/components/charts/AlertasPorTipoChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EstadisticasAvanzadas() {
  const [datosTendencia, setDatosTendencia] = useState([
    { fecha: "Ene", consumo: 450, costo: 98500 },
    { fecha: "Feb", consumo: 520, costo: 114000 },
    { fecha: "Mar", consumo: 480, costo: 105200 },
    { fecha: "Abr", consumo: 610, costo: 133800 },
    { fecha: "May", consumo: 580, costo: 127100 },
    { fecha: "Jun", consumo: 650, costo: 142500 },
  ]);

  const [datosComparativa, setDatosComparativa] = useState([
    { periodo: "Semana 1", anterior: 120, actual: 135 },
    { periodo: "Semana 2", anterior: 145, actual: 128 },
    { periodo: "Semana 3", anterior: 130, actual: 155 },
    { periodo: "Semana 4", anterior: 125, actual: 142 },
  ]);

  const [datosDistribucion, setDatosDistribucion] = useState([
    { nombre: "Iluminación", valor: 35 },
    { nombre: "Climatización", valor: 28 },
    { nombre: "Equipos", valor: 22 },
    { nombre: "Refrigeración", valor: 10 },
    { nombre: "Otros", valor: 5 },
  ]);

  const [datosPrediccion, setDatosPrediccion] = useState([
    { fecha: "Ene", real: 450 },
    { fecha: "Feb", real: 520 },
    { fecha: "Mar", real: 480 },
    { fecha: "Abr", real: 610 },
    { fecha: "May", real: 580 },
    { fecha: "Jun", real: 650 },
    { fecha: "Jul", prediccion: 620 },
    { fecha: "Ago", prediccion: 680 },
    { fecha: "Sep", prediccion: 640 },
  ]);

  const [datosAlertas, setDatosAlertas] = useState([
    { tipo: "Consumo Alto", cantidad: 15 },
    { tipo: "Falla Dispositivo", cantidad: 8 },
    { tipo: "Desconexión", cantidad: 12 },
    { tipo: "Anomalía", cantidad: 5 },
  ]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tendencias" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="comparativas">Comparativas</TabsTrigger>
          <TabsTrigger value="distribucion">Distribución</TabsTrigger>
          <TabsTrigger value="predicciones">Predicciones</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias" className="space-y-4">
          <ConsumoTendenciaChart 
            data={datosTendencia}
            titulo="Tendencia de Consumo Mensual"
            descripcion="Evolución del consumo y costo en los últimos 6 meses"
          />
        </TabsContent>

        <TabsContent value="comparativas" className="space-y-4">
          <ConsumoComparativaChart 
            data={datosComparativa}
            titulo="Comparativa Semanal"
            descripcion="Comparación del consumo actual vs mes anterior"
          />
        </TabsContent>

        <TabsContent value="distribucion" className="space-y-4">
          <DistribucionConsumoChart 
            data={datosDistribucion}
            titulo="Distribución por Categoría"
            descripcion="Porcentaje de consumo por tipo de uso"
          />
        </TabsContent>

        <TabsContent value="predicciones" className="space-y-4">
          <PrediccionConsumoChart 
            data={datosPrediccion}
            titulo="Predicción de Consumo"
            descripcion="Proyección basada en histórico y tendencias"
          />
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <AlertasPorTipoChart 
            data={datosAlertas}
            titulo="Alertas por Tipo"
            descripcion="Distribución de alertas en el último mes"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
