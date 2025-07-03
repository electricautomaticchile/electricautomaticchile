import {
  CrearClienteRequest,
  EnviarConfirmacionRequest,
  ApiResponse,
  Cliente,
} from "../types";
import { API_ENDPOINTS } from "../config";

// Crear un nuevo cliente
export const crearCliente = async (
  clienteData: CrearClienteRequest
): Promise<ApiResponse<Cliente>> => {
  try {
    const response = await fetch(API_ENDPOINTS.crearCliente, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clienteData),
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Error al crear cliente");
    }

    return {
      success: true,
      data: resultado.cliente || resultado,
      message: resultado.message || "Cliente creado exitosamente",
    };
  } catch (error) {
    console.error("Error en crearCliente:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al crear cliente",
    };
  }
};

// Enviar correo de confirmación
export const enviarConfirmacion = async (
  datos: EnviarConfirmacionRequest
): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.enviarConfirmacion, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Error al enviar confirmación");
    }

    return {
      success: true,
      message: resultado.message || "Correo enviado exitosamente",
    };
  } catch (error) {
    console.error("Error en enviarConfirmacion:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al enviar correo",
    };
  }
};

// Obtener lista de clientes
export const obtenerClientes = async (): Promise<ApiResponse<Cliente[]>> => {
  try {
    const response = await fetch(API_ENDPOINTS.obtenerClientes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Error al obtener clientes");
    }

    return {
      success: true,
      data: resultado.clientes || resultado,
      message: "Clientes obtenidos exitosamente",
    };
  } catch (error) {
    console.error("Error en obtenerClientes:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener clientes",
    };
  }
};

// Actualizar cliente existente
export const actualizarCliente = async (
  cliente: Cliente
): Promise<ApiResponse<Cliente>> => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.actualizarCliente}/${cliente.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      }
    );

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Error al actualizar cliente");
    }

    return {
      success: true,
      data: resultado.cliente || resultado,
      message: "Cliente actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error en actualizarCliente:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al actualizar cliente",
    };
  }
};

// Eliminar cliente
export const eliminarCliente = async (
  clienteId: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.eliminarCliente}/${clienteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Error al eliminar cliente");
    }

    return {
      success: true,
      message: "Cliente eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error en eliminarCliente:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al eliminar cliente",
    };
  }
};
