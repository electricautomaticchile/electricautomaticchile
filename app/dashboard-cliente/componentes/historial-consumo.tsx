"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  BarChart,
  Download,
  FilterX,
  LineChart,
  ChevronDown,
  Calendar,
  Info,
} from "lucide-react";
import {
  Bar,
  BarChart as BarChartRecharts,
  CartesianGrid,
  Legend,
  Line,
  LineChart as LineChartRecharts,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DatoConsumo {
  fecha: string;
  consumo: number;
  costo: number;
}

// Función para generar datos históricos de consumo
const generarDatosHistoricos = (meses: number): DatoConsumo[] => {
  const datos: DatoConsumo[] = [];
  const hoy = new Date();

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = subMonths(hoy, i);
    // Simulamos variaciones estacionales (más consumo en invierno)
    const baseConsumo = 230 + Math.random() * 50;
    const factorEstacional =
      fecha.getMonth() >= 5 && fecha.getMonth() <= 8 ? 1.3 : 1;
    const consumo = baseConsumo * factorEstacional;
    const costo = consumo * 185; // 185 pesos chilenos por kWh

    datos.push({
      fecha: format(fecha, "MM/yyyy"),
      consumo: Number(consumo.toFixed(1)),
      costo: Math.round(costo),
    });
  }

  return datos;
};

// Datos para el historial anual (12 meses)
const datosAnuales = generarDatosHistoricos(12);

// Datos para el historial detallado del último mes (por día)
const generarDatosDetallados = () => {
  const datos = [];
  const diasMes = 30;
  const fechaBase = new Date();
  fechaBase.setDate(1); // Primer día del mes

  const baseConsumo = 7.5; // Consumo base diario

  for (let i = 0; i < diasMes; i++) {
    const fecha = new Date(fechaBase);
    fecha.setDate(fechaBase.getDate() + i);

    // Simulamos patrones semanales (más consumo en fin de semana)
    const diaSemana = fecha.getDay(); // 0-6 (domingo-sábado)
    const esFinSemana = diaSemana === 0 || diaSemana === 6;
    const factorDia = esFinSemana ? 1.2 : 1 + Math.random() * 0.3;

    const consumo = baseConsumo * factorDia;

    datos.push({
      fecha: format(fecha, "dd/MM"),
      consumo: Number(consumo.toFixed(1)),
      costo: Math.round(consumo * 185),
    });
  }

  return datos;
};

const datosDetallados = generarDatosDetallados();

// Función para generar datos históricos de consumo sin aleatoriedad para SSR
const generarDatosHistoricosFijos = (meses: number): DatoConsumo[] => {
  const datos: DatoConsumo[] = [];
  const hoy = new Date();

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = subMonths(hoy, i);
    // Usamos valores fijos para SSR
    const baseConsumo = 230 + 25; // Valor medio fijo en lugar de aleatorio
    const factorEstacional =
      fecha.getMonth() >= 5 && fecha.getMonth() <= 8 ? 1.3 : 1;
    const consumo = baseConsumo * factorEstacional;
    const costo = consumo * 185;

    datos.push({
      fecha: format(fecha, "MM/yyyy"),
      consumo: Number(consumo.toFixed(1)),
      costo: Math.round(costo),
    });
  }

  return datos;
};

// Datos detallados para el último mes sin aleatoriedad para SSR
const generarDatosDetalladosFijos = () => {
  const datos = [];
  const diasMes = 30;
  const fechaBase = new Date();
  fechaBase.setDate(1);

  const baseConsumo = 7.5;

  for (let i = 0; i < diasMes; i++) {
    const fecha = new Date(fechaBase);
    fecha.setDate(fechaBase.getDate() + i);

    const diaSemana = fecha.getDay();
    const esFinSemana = diaSemana === 0 || diaSemana === 6;
    // Usamos valor fijo para SSR
    const factorDia = esFinSemana ? 1.2 : 1.15; // Valor fijo en lugar de aleatorio

    const consumo = baseConsumo * factorDia;

    datos.push({
      fecha: format(fecha, "dd/MM"),
      consumo: Number(consumo.toFixed(1)),
      costo: Math.round(consumo * 185),
    });
  }

  return datos;
};

interface HistorialConsumoProps {
  reducida?: boolean;
}

export function HistorialConsumo({ reducida = false }: HistorialConsumoProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("12");
  const [tipoGrafico, setTipoGrafico] = useState<"linea" | "barra">("linea");
  const [datosMostrados, setDatosMostrados] = useState<"consumo" | "costo">(
    "consumo"
  );

  // Estado para datos que se cargarán en el cliente
  const [datosHistoricos, setDatosHistoricos] = useState(
    generarDatosHistoricosFijos(12)
  );
  const [datosDetallados, setDatosDetallados] = useState(
    generarDatosDetalladosFijos()
  );
  const [cargando, setCargando] = useState(false);

  // Estas variables se calculan a partir de los datos que ahora están en el estado
  const consumoTotal = datosHistoricos.reduce(
    (total, dato) => total + dato.consumo,
    0
  );
  const consumoPromedio = consumoTotal / datosHistoricos.length;
  const consumoMaximo = Math.max(
    ...datosHistoricos.map((dato) => dato.consumo)
  );
  const costoTotal = datosHistoricos.reduce(
    (total, dato) => total + dato.costo,
    0
  );

  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(valor);
  };

  // Generar datos aleatorios solo en el cliente después del montaje
  useEffect(() => {
    // Indicar que estamos cargando
    setCargando(true);

    // Usar setTimeout para asegurar que esto ocurra después del renderizado inicial
    const timer = setTimeout(() => {
      setDatosHistoricos(generarDatosHistoricos(12));
      setDatosDetallados(generarDatosDetallados());
      setCargando(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Historial de Consumo
          </CardTitle>
          <CardDescription>Consumo de energía en el tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChartRecharts
                data={datosHistoricos.slice(-6)} // Mostramos solo los últimos 6 meses
                margin={{ top: 5, right: 10, left: 0, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={30}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} kWh`, "Consumo"]}
                  labelFormatter={(label) => `Período: ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={true}
                  activeDot={{ r: 6 }}
                />
              </LineChartRecharts>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <div>
              <span className="block text-gray-500 dark:text-gray-400">
                Consumo Promedio
              </span>
              <span className="font-medium">
                {consumoPromedio.toFixed(1)} kWh/mes
              </span>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400">
                Consumo Total
              </span>
              <span className="font-medium">{consumoTotal.toFixed(1)} kWh</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Clock className="h-8 w-8 text-orange-600" />
            Historial de Consumo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis de su consumo eléctrico a lo largo del tiempo
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={tipoGrafico === "linea" ? "default" : "outline"}
            size="sm"
            onClick={() => setTipoGrafico("linea")}
            className={
              tipoGrafico === "linea" ? "bg-orange-600 hover:bg-orange-700" : ""
            }
          >
            <LineChart className="h-4 w-4 mr-1" />
            Línea
          </Button>
          <Button
            variant={tipoGrafico === "barra" ? "default" : "outline"}
            size="sm"
            onClick={() => setTipoGrafico("barra")}
            className={
              tipoGrafico === "barra" ? "bg-orange-600 hover:bg-orange-700" : ""
            }
          >
            <BarChart className="h-4 w-4 mr-1" />
            Barras
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Consumo Histórico</CardTitle>
              <CardDescription>
                Evolución de su consumo eléctrico
              </CardDescription>
            </div>

            <div className="flex gap-3">
              <Select
                value={periodoSeleccionado}
                onValueChange={setPeriodoSeleccionado}
              >
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Último año</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={datosMostrados}
                onValueChange={(v) =>
                  setDatosMostrados(v as "consumo" | "costo")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <FilterX className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Datos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumo">Consumo (kWh)</SelectItem>
                  <SelectItem value="costo">Costo ($)</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {tipoGrafico === "linea" ? (
                <LineChartRecharts
                  data={datosHistoricos.slice(-parseInt(periodoSeleccionado))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" tickLine={false} />
                  <YAxis
                    tickLine={false}
                    tickFormatter={(value) =>
                      datosMostrados === "consumo"
                        ? `${value}`
                        : `${value / 1000}K`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      datosMostrados === "consumo"
                        ? `${value} kWh`
                        : formatoMoneda(value),
                      datosMostrados === "consumo" ? "Consumo" : "Costo",
                    ]}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={datosMostrados}
                    name={
                      datosMostrados === "consumo"
                        ? "Consumo (kWh)"
                        : "Costo ($)"
                    }
                    stroke="#f97316"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChartRecharts>
              ) : (
                <BarChartRecharts
                  data={datosHistoricos.slice(-parseInt(periodoSeleccionado))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="fecha" tickLine={false} />
                  <YAxis
                    tickLine={false}
                    tickFormatter={(value) =>
                      datosMostrados === "consumo"
                        ? `${value}`
                        : `${value / 1000}K`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      datosMostrados === "consumo"
                        ? `${value} kWh`
                        : formatoMoneda(value),
                      datosMostrados === "consumo" ? "Consumo" : "Costo",
                    ]}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey={datosMostrados}
                    name={
                      datosMostrados === "consumo"
                        ? "Consumo (kWh)"
                        : "Costo ($)"
                    }
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChartRecharts>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consumo Total
                </p>
                <h3 className="text-2xl font-bold">
                  {consumoTotal.toFixed(1)} kWh
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Último año
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consumo Promedio
                </p>
                <h3 className="text-2xl font-bold">
                  {consumoPromedio.toFixed(1)} kWh
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Por mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Costo Total
                </p>
                <h3 className="text-2xl font-bold">
                  {formatoMoneda(costoTotal)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Último año
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consumo Detallado</CardTitle>
          <CardDescription>
            Detalle de consumo diario del último mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChartRecharts
                data={datosDetallados}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="fecha" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} kWh`, "Consumo"]}
                  labelFormatter={(label) => `Día: ${label}`}
                />
                <Bar
                  dataKey="consumo"
                  name="Consumo (kWh)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChartRecharts>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">
                  Consejos para reducir su consumo
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-1">
                  <li>
                    Los días con mayor consumo son generalmente los fines de
                    semana
                  </li>
                  <li>
                    Intente usar electrodomésticos de alta eficiencia energética
                  </li>
                  <li>
                    Apague los dispositivos cuando no los utilice, evitando el
                    modo standby
                  </li>
                  <li>
                    Considere usar iluminación LED que consume hasta un 80%
                    menos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
