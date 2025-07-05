"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  ArrowDownCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Datos simulados de facturas
const facturasEjemplo = [
  {
    id: "F-2023-11",
    periodo: "Noviembre 2023",
    fechaEmision: "01/11/2023",
    fechaVencimiento: "15/11/2023",
    monto: 36450,
    consumo: 245.8,
    estado: "pagada",
    fechaPago: "10/11/2023",
    medioPago: "Tarjeta de crédito",
  },
  {
    id: "F-2023-10",
    periodo: "Octubre 2023",
    fechaEmision: "01/10/2023",
    fechaVencimiento: "15/10/2023",
    monto: 37100,
    consumo: 250.2,
    estado: "pagada",
    fechaPago: "12/10/2023",
    medioPago: "Transferencia bancaria",
  },
  {
    id: "F-2023-09",
    periodo: "Septiembre 2023",
    fechaEmision: "01/09/2023",
    fechaVencimiento: "15/09/2023",
    monto: 38900,
    consumo: 262.5,
    estado: "pagada",
    fechaPago: "14/09/2023",
    medioPago: "Débito automático",
  },
  {
    id: "F-2023-08",
    periodo: "Agosto 2023",
    fechaEmision: "01/08/2023",
    fechaVencimiento: "15/08/2023",
    monto: 40100,
    consumo: 270.3,
    estado: "pagada",
    fechaPago: "10/08/2023",
    medioPago: "Tarjeta de crédito",
  },
  {
    id: "F-2023-07",
    periodo: "Julio 2023",
    fechaEmision: "01/07/2023",
    fechaVencimiento: "15/07/2023",
    monto: 39700,
    consumo: 268.1,
    estado: "pagada",
    fechaPago: "12/07/2023",
    medioPago: "Transferencia bancaria",
  },
  {
    id: "F-2023-06",
    periodo: "Junio 2023",
    fechaEmision: "01/06/2023",
    fechaVencimiento: "15/06/2023",
    monto: 37800,
    consumo: 255.2,
    estado: "pagada",
    fechaPago: "15/06/2023",
    medioPago: "Débito automático",
  },
];

// Próximo pago
const proximoPago = {
  id: "F-2023-12",
  periodo: "Diciembre 2023",
  fechaEmision: "01/12/2023",
  fechaVencimiento: "15/12/2023",
  montoEstimado: 35800,
  consumoEstimado: 240.5,
  diasRestantes: 14,
};

// Resumen de pagos
const resumenPagos = {
  ultimoPago: {
    monto: 36450,
    fecha: "10/11/2023",
  },
  promedioUltimos6Meses: 38342,
  totalAnual: 458600,
  medioPagoPreferido: "Tarjeta de crédito",
  pagosATiempo: "100%",
};

interface HistorialPagosProps {
  reducida?: boolean;
}

export function HistorialPagos({ reducida = false }: HistorialPagosProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("2023");
  const [tabActiva, setTabActiva] = useState("facturas");

  // Renderizar badge del estado de la factura
  const renderizarEstadoFactura = (estado: string) => {
    if (estado === "pagada") {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Pagada
        </div>
      );
    } else if (estado === "pendiente") {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <Clock className="h-3 w-3 mr-1" />
          Vencida
        </div>
      );
    }
  };

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Pagos y Facturas
          </CardTitle>
          <CardDescription>Historial de pagos y facturación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="text-sm text-gray-500">Próximo pago</div>
                  <div className="text-xl font-bold">
                    ${proximoPago.montoEstimado.toLocaleString("es-CL")}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{proximoPago.fechaVencimiento}</span>
                </div>
              </div>
              <Progress
                value={((30 - proximoPago.diasRestantes) / 30) * 100}
                className="h-1.5 mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {proximoPago.diasRestantes} días restantes para el vencimiento
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Últimas facturas</div>
              {facturasEjemplo.slice(0, 3).map((factura, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <div className="font-medium text-sm">{factura.periodo}</div>
                    <div className="text-xs text-gray-500">
                      {factura.fechaPago}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${factura.monto.toLocaleString("es-CL")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {factura.consumo} kWh
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="link" size="sm" className="text-orange-600 mx-auto">
            Ver historial completo
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-orange-600" />
          Pagos y Facturas
        </h2>

        <div className="flex items-center gap-2">
          <Select defaultValue="2023" onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximo pago</CardTitle>
            <CardDescription>Factura de {proximoPago.periodo}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  ${proximoPago.montoEstimado.toLocaleString("es-CL")}
                </div>
                <div className="text-sm text-gray-500">
                  Consumo estimado: {proximoPago.consumoEstimado} kWh
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Vence el</div>
                <div className="text-lg font-bold">
                  {proximoPago.fechaVencimiento}
                </div>
                <div className="text-sm text-gray-500">
                  {proximoPago.diasRestantes} días restantes
                </div>
              </div>
            </div>

            <Progress
              value={((30 - proximoPago.diasRestantes) / 30) * 100}
              className="h-2 mb-4"
            />

            <div className="flex gap-4 mt-6">
              <Button className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar ahora
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Programar pago
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumen de pagos</CardTitle>
            <CardDescription>
              Información de sus pagos recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Último pago</div>
                <div className="text-xl font-bold">
                  ${resumenPagos.ultimoPago.monto.toLocaleString("es-CL")}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {resumenPagos.ultimoPago.fecha}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Promedio mensual</div>
                <div className="text-xl font-bold">
                  ${resumenPagos.promedioUltimos6Meses.toLocaleString("es-CL")}
                </div>
                <div className="text-xs text-gray-500">Últimos 6 meses</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">
                    Total anual {periodoSeleccionado}
                  </div>
                  <div className="text-xl font-bold">
                    ${resumenPagos.totalAnual.toLocaleString("es-CL")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Pagos a tiempo</div>
                  <div className="text-xl font-bold text-green-600">
                    {resumenPagos.pagosATiempo}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                Medio de pago preferido: {resumenPagos.medioPagoPreferido}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="facturas"
        className="mb-6"
        onValueChange={setTabActiva}
      >
        <TabsList>
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
          <TabsTrigger value="pagos">Pagos realizados</TabsTrigger>
        </TabsList>

        <TabsContent value="facturas" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Fecha emisión</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Consumo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturasEjemplo.map((factura, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {factura.id}
                      </TableCell>
                      <TableCell>{factura.periodo}</TableCell>
                      <TableCell>{factura.fechaEmision}</TableCell>
                      <TableCell>{factura.fechaVencimiento}</TableCell>
                      <TableCell>{factura.consumo} kWh</TableCell>
                      <TableCell>
                        ${factura.monto.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {renderizarEstadoFactura(factura.estado)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Descargar</span>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Fecha pago</TableHead>
                    <TableHead>Medio de pago</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className="text-right">Comprobante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturasEjemplo
                    .filter((f) => f.estado === "pagada")
                    .map((factura, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {factura.id}
                        </TableCell>
                        <TableCell>{factura.periodo}</TableCell>
                        <TableCell>{factura.fechaPago}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {factura.medioPago === "Tarjeta de crédito" ? (
                              <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                            ) : factura.medioPago ===
                              "Transferencia bancaria" ? (
                              <ArrowDownCircle className="h-4 w-4 mr-2 text-green-600" />
                            ) : (
                              <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                            )}
                            {factura.medioPago}
                          </div>
                        </TableCell>
                        <TableCell>
                          ${factura.monto.toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">
                              Descargar comprobante
                            </span>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">
          Medios de pago disponibles
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Tarjeta de crédito/débito</h4>
              <p className="text-sm text-gray-500">
                Pague directamente con su tarjeta bancaria.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ArrowDownCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Transferencia bancaria</h4>
              <p className="text-sm text-gray-500">
                Realice transferencias a nuestra cuenta corriente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Débito automático</h4>
              <p className="text-sm text-gray-500">
                Configure pagos automáticos mensuales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
