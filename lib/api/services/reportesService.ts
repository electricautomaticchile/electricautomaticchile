import { apiClient } from "@/lib/api/client";

const BASE = "/api/reportes";

async function descargar(url: string, filename: string): Promise<void> {
  const response = await apiClient.get(url, { responseType: "blob" });
  const blob = new Blob([response.data], { type: response.headers["content-type"] });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

const fecha = () => new Date().toISOString().split("T")[0];

export const ReportesService = {
  clientesExcel: () => descargar(`${BASE}/clientes?formato=excel`, `clientes_${fecha()}.xlsx`),
  clientesPDF:   () => descargar(`${BASE}/clientes?formato=pdf`,   `clientes_${fecha()}.pdf`),

  dispositivosExcel: () => descargar(`${BASE}/dispositivos?formato=excel`, `dispositivos_${fecha()}.xlsx`),
  dispositivosPDF:   () => descargar(`${BASE}/dispositivos?formato=pdf`,   `dispositivos_${fecha()}.pdf`),

  alertasExcel: () => descargar(`${BASE}/alertas?formato=excel`, `alertas_${fecha()}.xlsx`),
  alertasPDF:   () => descargar(`${BASE}/alertas?formato=pdf`,   `alertas_${fecha()}.pdf`),

  boletasExcel: () => descargar(`${BASE}/boletas?formato=excel`, `boletas_${fecha()}.xlsx`),
  boletasPDF:   () => descargar(`${BASE}/boletas?formato=pdf`,   `boletas_${fecha()}.pdf`),

  consumoExcel: (fechaInicio?: string, fechaFin?: string) => {
    const params = new URLSearchParams({ formato: "excel" });
    if (fechaInicio) params.set("fechaInicio", fechaInicio);
    if (fechaFin) params.set("fechaFin", fechaFin);
    return descargar(`${BASE}/consumo?${params}`, `consumo_${fecha()}.xlsx`);
  },
  consumoPDF: (fechaInicio?: string, fechaFin?: string) => {
    const params = new URLSearchParams({ formato: "pdf" });
    if (fechaInicio) params.set("fechaInicio", fechaInicio);
    if (fechaFin) params.set("fechaFin", fechaFin);
    return descargar(`${BASE}/consumo?${params}`, `consumo_${fecha()}.pdf`);
  },
};

export default ReportesService;
