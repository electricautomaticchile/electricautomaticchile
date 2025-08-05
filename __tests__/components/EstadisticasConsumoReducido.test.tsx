import React from "react";
import { render, screen } from "@testing-library/react";
import { EstadisticasConsumoReducido } from "../../app/dashboard-empresa/features/estadisticas/estadisticasConsumoReducido";
import { ESTADISTICAS_RESUMEN_DEFAULT } from "../../app/dashboard-empresa/features/estadisticas/config";

// Mock de recharts para evitar errores en tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock de lucide-react
jest.mock("lucide-react", () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
}));

// Mock del LoadingSpinner
jest.mock("@/components/ui/loading-spinner", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("EstadisticasConsumoReducido", () => {
  const mockDatos = [
    { periodo: "1/11", consumo: 150, costo: 5000, eficiencia: 85 },
    { periodo: "2/11", consumo: 160, costo: 5200, eficiencia: 87 },
    { periodo: "3/11", consumo: 140, costo: 4800, eficiencia: 83 },
  ];

  beforeEach(() => {
    // Clear console logs before each test
    jest.clearAllMocks();
    console.log = jest.fn();
    console.warn = jest.fn();
  });

  it("should show loading spinner when loading is true", () => {
    render(
      <EstadisticasConsumoReducido
        datos={[]}
        resumen={undefined}
        loading={true}
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should show no data message when resumen is undefined", () => {
    render(
      <EstadisticasConsumoReducido
        datos={[]}
        resumen={undefined}
        loading={false}
      />
    );

    expect(
      screen.getByText("No hay datos de estadísticas disponibles")
    ).toBeInTheDocument();
    expect(screen.getByText("Intenta recargar la página")).toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledWith(
      "EstadisticasConsumoReducido: resumen is undefined",
      expect.any(Object)
    );
  });

  it("should render successfully with valid resumen data", () => {
    render(
      <EstadisticasConsumoReducido
        datos={mockDatos}
        resumen={ESTADISTICAS_RESUMEN_DEFAULT}
        loading={false}
      />
    );

    // Verificar que se muestra el consumo mensual
    expect(screen.getByText("Consumo Mensual")).toBeInTheDocument();
    expect(screen.getByText("4.520 kWh")).toBeInTheDocument();

    // Verificar que se muestran las métricas adicionales
    expect(screen.getByText("Pico de consumo")).toBeInTheDocument();
    expect(screen.getByText("250,5 kWh")).toBeInTheDocument();
    expect(screen.getByText("Eficiencia")).toBeInTheDocument();
    expect(screen.getByText("87,5%")).toBeInTheDocument();

    // Verificar que se registra el log de renderizado exitoso
    expect(console.log).toHaveBeenCalledWith(
      "EstadisticasConsumoReducido: renderizando con datos válidos",
      expect.any(Object)
    );
  });

  it("should handle resumen with missing properties gracefully", () => {
    const resumenIncompleto = {
      consumoMensual: 1000,
      // Faltan otras propiedades
    } as any;

    render(
      <EstadisticasConsumoReducido
        datos={mockDatos}
        resumen={resumenIncompleto}
        loading={false}
      />
    );

    // Debería renderizar sin errores usando los fallbacks
    expect(screen.getByText("Consumo Mensual")).toBeInTheDocument();
    expect(screen.getByText("1.000 kWh")).toBeInTheDocument();

    // Los valores faltantes deberían usar fallbacks (0)
    expect(screen.getByText("0 kWh")).toBeInTheDocument(); // pico.valor fallback
    expect(screen.getByText("0%")).toBeInTheDocument(); // eficienciaEnergetica fallback
  });

  it('should show "Sin datos" when datos array is empty', () => {
    render(
      <EstadisticasConsumoReducido
        datos={[]}
        resumen={ESTADISTICAS_RESUMEN_DEFAULT}
        loading={false}
      />
    );

    expect(screen.getByText("Sin datos")).toBeInTheDocument();
  });

  it("should render chart when datos are available", () => {
    render(
      <EstadisticasConsumoReducido
        datos={mockDatos}
        resumen={ESTADISTICAS_RESUMEN_DEFAULT}
        loading={false}
      />
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("should show correct trend indicators", () => {
    const resumenConTendenciaPositiva = {
      ...ESTADISTICAS_RESUMEN_DEFAULT,
      variacionMensual: 5.2, // Positiva
    };

    render(
      <EstadisticasConsumoReducido
        datos={mockDatos}
        resumen={resumenConTendenciaPositiva}
        loading={false}
      />
    );

    expect(screen.getByTestId("trending-up")).toBeInTheDocument();
    expect(screen.getByText("+5,2% vs. mes anterior")).toBeInTheDocument();
  });

  it("should show correct trend indicators for negative variation", () => {
    const resumenConTendenciaNegativa = {
      ...ESTADISTICAS_RESUMEN_DEFAULT,
      variacionMensual: -3.1, // Negativa
    };

    render(
      <EstadisticasConsumoReducido
        datos={mockDatos}
        resumen={resumenConTendenciaNegativa}
        loading={false}
      />
    );

    expect(screen.getByTestId("trending-down")).toBeInTheDocument();
    expect(screen.getByText("-3,1% vs. mes anterior")).toBeInTheDocument();
  });
});
