"use client";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CreditCard, Download, FileText, CircleDollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useApi } from "@/lib/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { baseService } from "@/lib/api/utils/baseService";

interface Boleta {
  _id: string;
  clienteId: string;
  numeroBoleta: string;
  monto: number;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'pendiente' | 'pagada' | 'vencida';
  consumoKwh: number;
  periodo: string;
  fechaPago?: Date;
}

interface PagosFacturasProps {
  reducida?: boolean;
}

export function PagosFacturas({ reducida = false }: PagosFacturasProps) {
  const { user } = useApi();
  const { toast } = useToast();
  const [tabActiva, setTabActiva] = useState('facturas');
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pagando, setPagando] = useState(false);

  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();

  const cargarBoletas = useCallback(async () => {
    try {
      setCargando(true);
      const response = await baseService.get(`/boletas/cliente/${clienteId}`);

      if (response.success) {
        setBoletas(response.data as Boleta[]);
      }
    } catch (error) {
      console.error('Error cargando boletas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las boletas",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  }, [clienteId, toast]);

  useEffect(() => {
    if (clienteId) {
      cargarBoletas();
    }
  }, [clienteId, cargarBoletas]);

  const pagarBoleta = async (boletaId: string) => {
    try {
      setPagando(true);

      // Marcar boleta como pagada
      const data = await baseService.put(`/boletas/${boletaId}/pagar`, {}) as any;

      if (data.success) {
        // Mostrar notificación de pago exitoso
        toast({
          title: "✅ Pago exitoso",
          description: "La boleta ha sido pagada correctamente",
        });

        // Recargar boletas para actualizar la vista
        await cargarBoletas();

        // Verificar si el servicio fue restablecido automáticamente
        if (data.servicioRestablecido) {
          toast({
            title: "🟢 Servicio restablecido",
            description: `Su servicio eléctrico ha sido restablecido automáticamente. Boletas vencidas restantes: ${data.boletasVencidasRestantes}`,
            duration: 5000,
          });
        } else if (data.boletasVencidasRestantes > 2) {
          toast({
            title: "⚠️ Servicio cortado",
            description: `Aún tienes ${data.boletasVencidasRestantes} boletas vencidas. Paga al menos ${data.boletasVencidasRestantes - 2} más para restablecer el servicio.`,
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "No se pudo procesar el pago",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error pagando boleta:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago",
        variant: "destructive",
      });
    } finally {
      setPagando(false);
    }
  };

  const descargarPDF = async (boleta: Boleta) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/boletas/${boleta._id}/pdf`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${boleta.numeroBoleta}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF",
        variant: "destructive",
      });
    }
  };

  const formatoMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(monto);
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300';
      case 'pagada':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300';
      case 'vencida':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const boletasVencidas = boletas.filter(b => b.estado === 'vencida');
  const boletasPagadas = boletas.filter(b => b.estado === 'pagada');
  const totalDeuda = boletasVencidas.reduce((sum, b) => sum + b.monto, 0);

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Boletas y Pagos
          </CardTitle>
          <CardDescription>
            Últimas boletas y pagos pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-600" />
            </div>
          ) : boletasVencidas.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                  {boletasVencidas.length} boleta(s) vencida(s)
                </h3>
                <Button variant="outline" size="sm" className="text-sm h-8">
                  Ver todas
                </Button>
              </div>

              <div className="space-y-3">
                {boletasVencidas.slice(0, 2).map(boleta => (
                  <div key={boleta._id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{boleta.numeroBoleta}</div>
                      <div className="font-bold text-red-600">{formatoMoneda(boleta.monto)}</div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                      <div>Vencida: {format(new Date(boleta.fechaVencimiento), 'dd/MM/yyyy')}</div>
                      <div>{boleta.consumoKwh} kWh</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">No tiene boletas pendientes</p>
            </div>
          )}

          {boletasPagadas.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                Últimos pagos
              </h3>
              <div className="space-y-2">
                {boletasPagadas.slice(0, 2).map(boleta => (
                  <div key={boleta._id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-green-600" />
                      <span>{boleta.numeroBoleta}</span>
                    </div>
                    <div className="font-medium">{formatoMoneda(boleta.monto)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <CreditCard className="h-8 w-8 text-orange-600" />
            Boletas y Pagos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administre sus boletas y realice pagos
          </p>
        </div>

        {boletasVencidas.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Deuda total</p>
            <p className="text-2xl font-bold text-red-600">{formatoMoneda(totalDeuda)}</p>
            <p className="text-sm text-red-500">{boletasVencidas.length} boleta(s) vencida(s)</p>
          </div>
        )}
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-orange-600" />
          <p className="mt-4 text-gray-500">Cargando boletas...</p>
        </div>
      ) : (
        <Tabs defaultValue="facturas" value={tabActiva} onValueChange={setTabActiva}>
          <TabsList className="mb-4 grid grid-cols-2 gap-4">
            <TabsTrigger value="facturas" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Mis Boletas</span>
            </TabsTrigger>
            <TabsTrigger value="pagar" className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              <span>Realizar Pago</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facturas" className="space-y-4">
            {boletasVencidas.length > 0 && (
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600">Boletas Vencidas</CardTitle>
                  <CardDescription>
                    Tienes {boletasVencidas.length} boleta(s) vencida(s) - Total: {formatoMoneda(totalDeuda)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {boletasVencidas.map(boleta => (
                    <div key={boleta._id} className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-red-600" />
                            <span className="font-medium">{boleta.numeroBoleta}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Periodo</p>
                              <p className="font-medium">{boleta.periodo}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Vencimiento</p>
                              <p className="font-medium text-red-600">{format(new Date(boleta.fechaVencimiento), 'dd/MM/yyyy')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Consumo</p>
                              <p className="font-medium">{boleta.consumoKwh} kWh</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                              <p className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                Vencida
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-center md:text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                          <p className="text-3xl font-bold text-red-600 mb-2">{formatoMoneda(boleta.monto)}</p>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => pagarBoleta(boleta._id)}
                              disabled={pagando}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {pagando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pagar ahora'}
                            </Button>
                            <Button variant="outline" onClick={() => descargarPDF(boleta)}>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {boletasPagadas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Boletas Pagadas</CardTitle>
                  <CardDescription>
                    Todas sus boletas pagadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {boletasPagadas.map(boleta => (
                      <div key={boleta._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-900">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{boleta.numeroBoleta}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${obtenerColorEstado(boleta.estado)}`}>
                                Pagada
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-4">
                              <span>Periodo: {boleta.periodo}</span>
                              <span>Consumo: {boleta.consumoKwh} kWh</span>
                              {boleta.fechaPago && (
                                <span>Pagada: {format(new Date(boleta.fechaPago), 'dd/MM/yyyy')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                          <div className="text-right sm:mr-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                            <p className="font-bold text-lg">{formatoMoneda(boleta.monto)}</p>
                          </div>
                          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => descargarPDF(boleta)}>
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {boletas.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CircleDollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay boletas disponibles</h3>
                  <p className="text-gray-500">Las boletas aparecerán aquí cuando estén disponibles</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pagar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Realizar Pago</CardTitle>
                <CardDescription>
                  Pague sus boletas vencidas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {boletasVencidas.length > 0 ? (
                  <>
                    <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
                      <div className="flex items-start gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-300">Atención</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tienes {boletasVencidas.length} boleta(s) vencida(s).
                            {boletasVencidas.length >= 3 && ' Tu servicio está cortado. Paga para restablecerlo.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Deuda total:</span>
                        <span className="font-bold text-red-600 text-xl">
                          {formatoMoneda(totalDeuda)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Boletas a pagar:</h3>
                      {boletasVencidas.map(boleta => (
                        <div key={boleta._id} className="flex justify-between items-center p-4 rounded-lg border">
                          <div>
                            <p className="font-medium">{boleta.numeroBoleta}</p>
                            <p className="text-sm text-gray-500">{boleta.periodo} - {boleta.consumoKwh} kWh</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatoMoneda(boleta.monto)}</p>
                            <Button
                              size="sm"
                              onClick={() => pagarBoleta(boleta._id)}
                              disabled={pagando}
                              className="mt-2"
                            >
                              {pagando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pagar'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                        onClick={async () => {
                          // Pagar todas las boletas
                          for (const boleta of boletasVencidas) {
                            await pagarBoleta(boleta._id);
                          }
                        }}
                        disabled={pagando}
                      >
                        {pagando ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Pagar todas las boletas - {formatoMoneda(totalDeuda)}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                      <CircleDollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tienes pagos pendientes</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Todas tus boletas han sido pagadas. La próxima boleta estará disponible pronto.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
