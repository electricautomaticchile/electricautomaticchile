import { baseService } from "../utils/baseService";

export interface IImagenPerfilResponse {
  success: boolean;
  message?: string;
  data?: {
    imageUrl?: string;
    fileName?: string;
    usuario?: any;
    imagenPerfil?: string;
  };
  error?: string;
}

export interface IUpdateProfileImageRequest {
  imageUrl: string;
  tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin";
  userId: string;
}

export class ImagenPerfilService {
  private static baseURL = "/imagenes-perfil";

  static async uploadAndUpdateProfileImage(
    file: File,
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tipoUsuario", tipoUsuario);
      formData.append("userId", userId);

      const response = await baseService.post<{
        imageUrl: string;
        fileName: string;
        message: string;
      }>(`${this.baseURL}/upload`, formData);

      return {
        success: true,
        data: response.data || {},
        message: response.data?.message || "Imagen de perfil actualizada exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al procesar la imagen de perfil",
      };
    }
  }

  static async getProfileImage(
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      const response: any = await baseService.get(
        `${this.baseURL}/${tipoUsuario}/${userId}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener imagen de perfil",
      };
    }
  }

  static async deleteProfileImage(
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      const response: any = await baseService.delete(
        `${this.baseURL}/${tipoUsuario}/${userId}`
      );

      return {
        success: true,
        data: response.data,
        message: "Imagen de perfil eliminada exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al eliminar imagen de perfil",
      };
    }
  }

  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          "Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG, JPG y WebP",
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "La imagen es demasiado grande. El tamaño máximo es 5MB",
      };
    }

    return { isValid: true };
  }

  static getDefaultImageUrl(tipoUsuario: string): string {
    const colors = {
      empresa: "FF6B00",
      cliente: "0EA5E9",
      superadmin: "DC2626",
      default: "6B7280",
    };

    const bgColor =
      colors[tipoUsuario as keyof typeof colors] || colors.default;
    const initials = tipoUsuario.charAt(0).toUpperCase();

    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=ffffff&size=200&font-size=0.5&bold=true`;
  }

  static createImageUrlWithFallback(
    imageUrl: string | null | undefined,
    tipoUsuario: string
  ): string {
    if (imageUrl && imageUrl.trim() !== "") {
      return imageUrl;
    }
    return this.getDefaultImageUrl(tipoUsuario);
  }
}

export default ImagenPerfilService;
