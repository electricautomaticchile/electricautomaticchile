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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApi } from "@/lib/hooks/useApi";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  size: string;
}

export function ReportesIoT() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useApi();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Simular datos de reportes
      setReports([
        {
          id: "1",
          title: "Reporte Global de Consumo - Enero 2024",
          type: "Consumo Energético",
          status: "completed",
          createdAt: new Date().toISOString(),
          size: "2.4 MB",
        },
        {
          id: "2",
          title: "Análisis de Eficiencia por Sector",
          type: "Eficiencia",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          size: "1.8 MB",
        },
        {
          id: "3",
          title: "Reporte de Mantenimiento Predictivo",
          type: "Mantenimiento",
          status: "generating",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          size: "Generando...",
        },
      ]);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      setLoading(true);
      // Simular generación de reporte
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadReports();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case "generating":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Generando
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Generados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Automáticos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">Total este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3m</div>
            <p className="text-xs text-muted-foreground">
              Generación de reportes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generación rápida de reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Generación Rápida de Reportes</CardTitle>
          <CardDescription>
            Genera reportes instantáneos del sistema IoT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => generateReport("consumo")}
              disabled={loading}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Consumo Global</span>
            </Button>

            <Button
              onClick={() => generateReport("eficiencia")}
              disabled={loading}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Eficiencia</span>
            </Button>

            <Button
              onClick={() => generateReport("alertas")}
              disabled={loading}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Alertas</span>
            </Button>

            <Button
              onClick={() => generateReport("mantenimiento")}
              disabled={loading}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Mantenimiento</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de reportes recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Recientes</CardTitle>
          <CardDescription>
            Historial de reportes generados recientemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {report.type}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(report.status)}
                  {report.status === "completed" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de reportes automáticos */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Automáticos</CardTitle>
          <CardDescription>
            Configuración de reportes programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Reporte Semanal de Consumo:</strong> Se genera
                automáticamente todos los lunes a las 8:00 AM con datos de la
                semana anterior.
              </AlertDescription>
            </Alert>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Reporte Mensual de Eficiencia:</strong> Se genera el
                primer día de cada mes con análisis completo del mes anterior.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reporte de Alertas Críticas:</strong> Se genera
                inmediatamente cuando se detectan 5 o más alertas críticas en 24
                horas.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Calendar className="h-4 w-4 mr-2" />
              Configurar Nuevo Reporte Automático
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
