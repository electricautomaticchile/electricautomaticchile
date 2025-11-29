"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, AlertTriangle, RefreshCw } from "lucide-react";

// Cargar LeafletMap solo en el cliente para evitar errores de SSR
const LeafletMap = dynamic(
  () => import("./components/LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface Medidor {
  id: string;
  customerName: string;
  coordinates: { lat: number; lng: number };
  address: string;
  status: "active" | "inactive" | "suspicious" | "fraud_detected";
  consumption: number;
  anomalies: number;
  serialNumber: string;
}

interface MapaInteractivoProps {
  reducida?: boolean;
}

// TODO: Obtener desde API
const medidoresData: Medidor[] = [
  {
    id: "meter_001",
    customerName: "Residencial Los Trapenses",
    coordinates: { lat: -33.3589, lng: -70.5089 },
    address: "Av. Los Trapenses 4567, Barnechea",
    status: "active",
    consumption: 245.8,
    anomalies: 0,
    serialNumber: "EAC-BRN-001",
  },
  {
    id: "meter_002",
    customerName: "Condominio La Dehesa",
    coordinates: { lat: -33.3645, lng: -70.5234 },
    address: "Camino La Dehesa 1234, Barnechea",
    status: "active",
    consumption: 312.5,
    anomalies: 0,
    serialNumber: "EAC-BRN-002",
  },
  {
    id: "meter_003",
    customerName: "Casa Particular - Sr. Silva",
    coordinates: { lat: -33.3512, lng: -70.5156 },
    address: "Av. El Rodeo 890, Barnechea",
    status: "suspicious",
    consumption: 89.2,
    anomalies: 2,
    serialNumber: "EAC-BRN-003",
  },
  {
    id: "meter_004",
    customerName: "Edificio Comercial Plaza Norte",
    coordinates: { lat: -33.3701, lng: -70.5312 },
    address: "Av. Padre Hurtado 5678, Barnechea",
    status: "fraud_detected",
    consumption: 0,
    anomalies: 5,
    serialNumber: "EAC-BRN-004",
  },
  {
    id: "meter_005",
    customerName: "Casa en Construcción Lote 45",
    coordinates: { lat: -33.3667, lng: -70.5145 },
    address: "Parcela 45, Los Dominicos, Barnechea",
    status: "inactive",
    consumption: 0,
    anomalies: 0,
    serialNumber: "EAC-BRN-005",
  },
  {
    id: "meter_006",
    customerName: "Restaurant El Arrayán",
    coordinates: { lat: -33.3623, lng: -70.5178 },
    address: "Av. Manquehue Norte 2345, Barnechea",
    status: "suspicious",
    consumption: 156.3,
    anomalies: 1,
    serialNumber: "EAC-BRN-006",
  },
  {
    id: "meter_007",
    customerName: "Oficina Desocupada - Torre B",
    coordinates: { lat: -33.3734, lng: -70.5289 },
    address: "Av. Apoquindo 8900, Barnechea",
    status: "inactive",
    consumption: 0,
    anomalies: 0,
    serialNumber: "EAC-BRN-007",
  },
  {
    id: "meter_008",
    customerName: "Clínica Veterinaria Los Andes",
    coordinates: { lat: -33.3556, lng: -70.5267 },
    address: "Camino El Alba 678, Barnechea",
    status: "suspicious",
    consumption: 198.7,
    anomalies: 1,
    serialNumber: "EAC-BRN-008",
  },
  {
    id: "meter_009",
    customerName: "Bodega Industrial San Carlos",
    coordinates: { lat: -33.3478, lng: -70.5201 },
    address: "Camino San Carlos 999, Barnechea",
    status: "fraud_detected",
    consumption: 0,
    anomalies: 3,
    serialNumber: "EAC-BRN-009",
  },
  {
    id: "meter_010",
    customerName: "Local Comercial Cerrado",
    coordinates: { lat: -33.3601, lng: -70.5334 },
    address: "Mall Plaza Los Dominicos 234, Barnechea",
    status: "inactive",
    consumption: 0,
    anomalies: 0,
    serialNumber: "EAC-BRN-010",
  },
];

export function MapaInteractivo({ reducida = false }: MapaInteractivoProps) {
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");



  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMedidores(medidoresData);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const medidoresFiltrados = medidores.filter((m) => {
    if (filtroEstado === "todos") return true;
    if (filtroEstado === "anomalias") return m.anomalies > 0;
    return m.status === filtroEstado;
  });

  const stats = {
    total: medidores.length,
    activos: medidores.filter((m) => m.status === "active").length,
    sospechosos: medidores.filter((m) => m.status === "suspicious").length,
    fraudes: medidores.filter((m) => m.status === "fraud_detected").length,
    inactivos: medidores.filter((m) => m.status === "inactive").length,
    anomaliasTotal: medidores.reduce((sum, m) => sum + m.anomalies, 0),
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Mapa Interactivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.activos}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Activos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.sospechosos}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sospechosos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {stats.fraudes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Fraudes</p>
          </div>
        </div>

        <div className="relative h-48 rounded-lg overflow-hidden border-2 border-blue-200">
          <LeafletMap
            medidores={medidores.map((m) => ({
              id: m.id,
              nombre: m.customerName,
              lat: m.coordinates.lat,
              lng: m.coordinates.lng,
              direccion: m.address,
              estado: m.status,
              consumo: m.consumption,
              anomalias: m.anomalies,
              serial: m.serialNumber,
            }))}
            filtro="todos"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
          <span className="text-sm font-medium">Zona: Barnechea, Santiago</span>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-300"
          >
            {stats.total} Medidores
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-6 w-6 text-blue-600" />
              Mapa Interactivo de Red Eléctrica
            </CardTitle>
            <CardDescription>
              Visualización geográfica de medidores en Barnechea
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "todos" ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => setFiltroEstado("todos")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "active" ? "ring-2 ring-green-500" : ""
              }`}
            onClick={() => setFiltroEstado("active")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.activos}
              </div>
              <p className="text-xs text-muted-foreground">Activos</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "suspicious" ? "ring-2 ring-yellow-500" : ""
              }`}
            onClick={() => setFiltroEstado("suspicious")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.sospechosos}
              </div>
              <p className="text-xs text-muted-foreground">Sospechosos</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "fraud_detected" ? "ring-2 ring-red-500" : ""
              }`}
            onClick={() => setFiltroEstado("fraud_detected")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.fraudes}
              </div>
              <p className="text-xs text-muted-foreground">Fraudes</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "inactive" ? "ring-2 ring-gray-500" : ""
              }`}
            onClick={() => setFiltroEstado("inactive")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.inactivos}
              </div>
              <p className="text-xs text-muted-foreground">Inactivos</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${filtroEstado === "anomalias" ? "ring-2 ring-orange-500" : ""
              }`}
            onClick={() => setFiltroEstado("anomalias")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.anomaliasTotal}
              </div>
              <p className="text-xs text-muted-foreground">Anomalías</p>
            </CardContent>
          </Card>
        </div>

        {/* Mapa */}
        <div className="relative h-[600px] rounded-lg overflow-hidden border-2 border-blue-200">
          <LeafletMap
            medidores={medidoresFiltrados.map((m) => ({
              id: m.id,
              nombre: m.customerName,
              lat: m.coordinates.lat,
              lng: m.coordinates.lng,
              direccion: m.address,
              estado: m.status,
              consumo: m.consumption,
              anomalias: m.anomalies,
              serial: m.serialNumber,
            }))}
            filtro={filtroEstado}
          />

          {/* Alerta de anomalías */}
          {stats.anomaliasTotal > 0 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-pulse z-[1000]">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-bold">
                {stats.anomaliasTotal} Anomalías Detectadas
              </span>
            </div>
          )}
        </div>

        {/* Lista de anomalías */}
        {stats.anomaliasTotal > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Medidores con Anomalías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medidoresFiltrados
                  .filter((m) => m.anomalies > 0)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200"
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          {m.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.address}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {m.anomalies} anomalías
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
