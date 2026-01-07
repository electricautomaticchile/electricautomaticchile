import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ExportService {
  private static baseURL = `${API_URL}/export`;

  private static getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  static async exportarClientesExcel(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/clientes/excel`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar clientes a Excel');
    }
  }

  static async exportarClientesPDF(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/clientes/pdf`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clientes_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar clientes a PDF');
    }
  }

  static async exportarDispositivosExcel(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/dispositivos/excel`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dispositivos_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar dispositivos a Excel');
    }
  }

  static async exportarDispositivosPDF(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/dispositivos/pdf`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dispositivos_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar dispositivos a PDF');
    }
  }

  static async exportarAlertasExcel(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/alertas/excel`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `alertas_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar alertas a Excel');
    }
  }

  static async exportarBoletasExcel(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/boletas/excel`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boletas_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar boletas a Excel');
    }
  }

  static async exportarBoletaPDF(boletaId: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseURL}/boletas/${boletaId}/pdf`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleta_${boletaId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al exportar boleta a PDF');
    }
  }
}

export default ExportService;
