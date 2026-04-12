"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CreditCard, Download, FileText, CircleDollarSign, AlertCircle, Loader2, PowerOff, TriangleAlert } from 'lucide-react';
import { format } from 'date-fns';
import { useApi } from '@/hooks/useApi';
import { useToast } from "@/components/ui/use-toast";
import { LoadingState, EmptyState } from "@/components/shared";
import { useBoletasCliente, useResumenDeuda, usePagarBoleta, useDescargarBoletaPDF } from '@/hooks/queries';
import type { Boleta } from '@/hooks/queries/useBoletasQuery';

interface PagosFacturasProps {
  reducida?: boolean;
}

export function PagosFacturas({ reducida = false }: PagosFacturasProps) {
  const { user, isRealAuthenticated } = useApi();
  const { toast } = useToast();
  const [tabActiva, setTabActiva] = useState('facturas');

  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();

  const { data: boletas = [], isLoading: cargando } = useBoletasCliente(
    isRealAuthenticated ? clienteId : null
  );
  const { data: resumenDeuda } = useResumenDeuda(
    isRealAuthenticated ? clienteId : null
  );
  const pagarBoletaMutation = usePagarBoleta();
  const descargarPDFMutation = useDescargarBoletaPDF();

  const pagarBoleta = (boletaId: string) => {
    pagarBoletaMutation.mutate(boletaId, {
      onSuccess: (data) => {
        if (data.success) {
          toast({ title: "✅ Pago confirmado", description: data.message || "Boleta marcada como pagada" });
          if (data.servicioRestablecido) {
            toast({
              title: "🟢 Servicio restablecido",
              description: "Tu suministro eléctrico fue restablecido automáticamente.",
              duration: 5000,
            });
          }
        } else {
          toast({ title: "Error", description: data.message || "No se pudo procesar el pago", variant: "destructive" });
        }
      },
      onError: () => toast({ title: "Error", description: "No se pudo procesar el pago", variant: "destructive" }),
    });
  };

  const descargarPDF = (boleta: Boleta) => {
    descargarPDFMutation.mutate(
      { boletaId: boleta._id ?? boleta.id, numeroBoleta: boleta.numeroBoleta ?? boleta.id },
      { onError: () => toast({ title: "Error", description: "No se pudo descargar el PDF", variant: "destructive" }) }
    );
  };

  const formatoMoneda = (monto: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(monto);

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':  return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300';
      case 'por_vencer': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300';
      case 'pagado':     return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300';
      case 'vencido':    return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300';
      default:           return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const etiquetaEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':  return 'Pendiente';
      case 'por_vencer': return 'Por vencer';
      case 'pagado':     return 'Pagada';
      case 'vencido':    return 'Vencida';
      default:           return estado;
    }
  };

  const boletasVencidas   = boletas.filter(b => b.estado === 'vencido');
  const boletasPagadas    = boletas.filter(b => b.estado === 'pagado');
  const boletasPendientes = boletas.filter(b => b.estado === 'pendiente' || b.estado === 'por_vencer');
  const totalDeuda = resumenDeuda?.montoTotal ?? boletasVencidas.reduce((s, b) => s + b.monto, 0);

  const renderAlertBanner = () => {
    if (!resumenDeuda || resumenDeuda.nivelAlerta === 'normal') return null;
    const isCorte   = resumenDeuda.nivelAlerta === 'corte';
    const isCritico = resumenDeuda.nivelAlerta === 'critico';
    const color     = isCorte ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : isCritico ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
    const textColor = isCorte ? 'text-red-700 dark:text-red-300' : isCritico ? 'text-orange-700 dark:text-orange-300' : 'text-amber-700 dark:text-amber-300';
    const Icon      = isCorte ? PowerOff : TriangleAlert;
    const titulo    = isCorte ? 'Servicio suspendido' : isCritico ? 'Riesgo de suspensión' : 'Boletas vencidas';
    const mensaje   = isCorte
      ? `Tu suministro fue suspendido por ${resumenDeuda.boletasVencidas} boletas impagas (${formatoMoneda(resumenDeuda.montoVencido)}). Paga para restablecer.`
      : isCritico
        ? `Tienes ${resumenDeuda.boletasVencidas} boletas vencidas. Al tercer impago se suspenderá tu suministro.`
        : `Tienes ${resumenDeuda.boletasVencidas} boleta(s) vencida(s). Paga para evitar la suspensión del servicio.`;

    return (
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${color} mb-6`}>
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${textColor}`} />
        <div>
          <p className={`font-semibold ${textColor}`}>{titulo}</p>
          <p className={`text-sm mt-0.5 ${textColor} opacity-90`}>{mensaje}</p>
        </div>
      </div>
    );
  };

  // ── Versión reducida (widget del dashboard) ──────────────────────────────
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Boletas
          </CardTitle>
          <CardDescription>Boletas pendientes y últimos pagos</CardDescription>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-600" /></div>
          ) : boletasVencidas.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">{boletasVencidas.length} boleta(s) vencida(s)</h3>
              </div>
              <div className="space-y-3">
                {boletasVencidas.slice(0, 2).map(boleta => (
                  <div key={boleta.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{boleta.periodo}</div>
                      <div className="font-bold text-red-600">{formatoMoneda(boleta.monto)}</div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                      <div>{boleta.fechaVencimiento ? `Vence: ${format(new Date(boleta.fechaVencimiento), 'dd/MM/yyyy')}` : ''}</div>
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
              <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">Últimos pagos</h3>
              <div className="space-y-2">
                {boletasPagadas.slice(0, 2).map(boleta => (
                  <div key={boleta.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-green-600" />
                      <span>{boleta.periodo}</span>
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

  // ── Vista completa ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <CreditCard className="h-8 w-8 text-orange-600" />
            Mis Boletas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Historial y estado de tus boletas eléctricas</p>
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
        <LoadingState message="Cargando boletas..." />
      ) : (
        <>
          {renderAlertBanner()}

          <Tabs defaultValue="facturas" value={tabActiva} onValueChange={setTabActiva}>
            <TabsList className="mb-4 grid grid-cols-2 gap-4">
              <TabsTrigger value="facturas" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /><span>Mis Boletas</span>
              </TabsTrigger>
              <TabsTrigger value="pagar" className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" /><span>Pagar</span>
              </TabsTrigger>
            </TabsList>

            {/* ── Tab: Mis Boletas ── */}
            <TabsContent value="facturas" className="space-y-4">
              {boletasVencidas.length > 0 && (
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader>
                    <CardTitle className="text-red-600">Boletas Vencidas</CardTitle>
                    <CardDescription>
                      {boletasVencidas.length} boleta(s) — Total: {formatoMoneda(boletasVencidas.reduce((s, b) => s + b.monto, 0))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {boletasVencidas.map(boleta => (
                      <div key={boleta.id} className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-red-600" />
                              <span className="font-medium">{boleta.periodo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Vencimiento</p>
                                <p className="font-medium text-red-600">
                                  {boleta.fechaVencimiento ? format(new Date(boleta.fechaVencimiento), 'dd/MM/yyyy') : '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Consumo</p>
                                <p className="font-medium">{boleta.consumoKwh} kWh</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-sm text-gray-500">Monto</p>
                            <p className="text-3xl font-bold text-red-600 mb-2">{formatoMoneda(boleta.monto)}</p>
                            <div className="flex flex-col gap-2">
                              <Button onClick={() => pagarBoleta(boleta._id ?? boleta.id)} disabled={pagarBoletaMutation.isPending} className="bg-red-600 hover:bg-red-700">
                                {pagarBoletaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar pago'}
                              </Button>
                              <Button variant="outline" onClick={() => descargarPDF(boleta)}>
                                <Download className="mr-2 h-4 w-4" />PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {boletasPendientes.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Boletas Pendientes</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {boletasPendientes.map(boleta => (
                      <div key={boleta.id} className="flex justify-between items-center p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{boleta.periodo}</p>
                          <p className="text-sm text-gray-500">
                            {boleta.fechaVencimiento ? `Vence: ${format(new Date(boleta.fechaVencimiento), 'dd/MM/yyyy')}` : ''} · {boleta.consumoKwh} kWh
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatoMoneda(boleta.monto)}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${obtenerColorEstado(boleta.estado)}`}>
                            {etiquetaEstado(boleta.estado)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {boletasPagadas.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Historial de Pagos</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {boletasPagadas.map(boleta => (
                        <div key={boleta.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-slate-900">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{boleta.periodo}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${obtenerColorEstado(boleta.estado)}`}>
                                  {etiquetaEstado(boleta.estado)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 flex gap-4">
                                <span>{boleta.consumoKwh} kWh</span>
                                {boleta.fechaPago && <span>Pagada: {format(new Date(boleta.fechaPago), 'dd/MM/yyyy')}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-3 sm:mt-0">
                            <div className="text-right sm:mr-4">
                              <p className="font-bold text-lg">{formatoMoneda(boleta.monto)}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => descargarPDF(boleta)}>
                              <Download className="mr-2 h-4 w-4" />PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {boletas.length === 0 && (
                <EmptyState icon={CircleDollarSign} title="No hay boletas disponibles" description="Las boletas aparecerán aquí cuando estén disponibles" />
              )}
            </TabsContent>

            {/* ── Tab: Pagar ── */}
            <TabsContent value="pagar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Confirmar Pago</CardTitle>
                  <CardDescription>Paga tus boletas vencidas para restablecer el servicio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {boletasVencidas.length > 0 ? (
                    <>
                      <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-300">Atención</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Tienes {boletasVencidas.length} boleta(s) vencida(s).
                              {boletasVencidas.length >= 3 && ' Tu servicio está suspendido. Paga para restablecerlo.'}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Deuda total:</span>
                          <span className="font-bold text-red-600 text-xl">{formatoMoneda(totalDeuda)}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {boletasVencidas.map(boleta => (
                          <div key={boleta.id} className="flex justify-between items-center p-4 rounded-lg border">
                            <div>
                              <p className="font-medium">{boleta.periodo}</p>
                              <p className="text-sm text-gray-500">{boleta.consumoKwh} kWh</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatoMoneda(boleta.monto)}</p>
                              <Button size="sm" onClick={() => pagarBoleta(boleta._id ?? boleta.id)} disabled={pagarBoletaMutation.isPending} className="mt-2">
                                {pagarBoletaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                        onClick={() => { boletasVencidas.forEach(b => pagarBoleta(b._id ?? b.id)); }}
                        disabled={pagarBoletaMutation.isPending}
                      >
                        {pagarBoletaMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                        Pagar todas — {formatoMoneda(totalDeuda)}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <CircleDollarSign className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Sin pagos pendientes</h3>
                      <p className="text-gray-500 dark:text-gray-400">Todas tus boletas están al día.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
