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
  private static baseURL = "/empresa";

  /**
   * Subir imagen de perfil
   */
  static async uploadImage(file: File): Promise<IImagenPerfilResponse> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await baseService.post<{
        imageUrl: string;
        fileName: string;
      }>(`${this.baseURL}/upload-image`, formData);

      return {
        success: true,
        data: response.data,
        message: "Imagen subida exitosamente",
      };
    } catch (error: any) {
      console.error("Error al subir imagen:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al subir imagen",
      };
    }
  }

  /**
   * Actualizar imagen de perfil del usuario
   */
  static async updateProfileImage(
    data: IUpdateProfileImageRequest
  ): Promise<IImagenPerfilResponse> {
    try {
      // Cast a any para evitar error de tipo
      const response: any = await baseService.post(
        `${this.baseURL}/update-profile-image`,
        data
      );

      return {
        success: true,
        data: response.data,
        message: "Imagen de perfil actualizada exitosamente",
      };
    } catch (error: any) {
      console.error("Error al actualizar imagen de perfil:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Error al actualizar imagen de perfil",
      };
    }
  }

  /**
   * Obtener imagen de perfil actual
   */
  static async getProfileImage(
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      // Cast a any para evitar error de tipo
      const response: any = await baseService.get(
        `${this.baseURL}/profile-image/${tipoUsuario}/${userId}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error al obtener imagen de perfil:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener imagen de perfil",
      };
    }
  }

  /**
   * Eliminar imagen de perfil
   */
  static async deleteProfileImage(
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      // Cast a any para evitar error de tipo
      const response: any = await baseService.delete(
        `${this.baseURL}/profile-image/${tipoUsuario}/${userId}`
      );

      return {
        success: true,
        data: response.data,
        message: "Imagen de perfil eliminada exitosamente",
      };
    } catch (error: any) {
      console.error("Error al eliminar imagen de perfil:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al eliminar imagen de perfil",
      };
    }
  }

  /**
   * Subir y actualizar imagen de perfil en un solo paso
   */
  static async uploadAndUpdateProfileImage(
    file: File,
    tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin",
    userId: string
  ): Promise<IImagenPerfilResponse> {
    try {
      // 1. Subir imagen
      const uploadResult = await this.uploadImage(file);
      if (!uploadResult.success || !uploadResult.data?.imageUrl) {
        return uploadResult;
      }

      // 2. Actualizar perfil
      const updateResult = await this.updateProfileImage({
        imageUrl: uploadResult.data.imageUrl,
        tipoUsuario,
        userId,
      });

      if (!updateResult.success) {
        return updateResult;
      }

      return {
        success: true,
        data: {
          ...updateResult.data,
          imageUrl: uploadResult.data.imageUrl,
          fileName: uploadResult.data.fileName,
        },
        message: "Imagen de perfil actualizada exitosamente",
      };
    } catch (error: any) {
      console.error("Error al subir y actualizar imagen:", error);
      return {
        success: false,
        error: "Error al procesar la imagen de perfil",
      };
    }
  }

  /**
   * Validar archivo de imagen
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          "Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG, JPG y WebP",
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "La imagen es demasiado grande. El tamaño máximo es 5MB",
      };
    }

    return { isValid: true };
  }

  /**
   * Obtener URL de imagen por defecto basada en tipo de usuario
   */
  static getDefaultImageUrl(tipoUsuario: string): string {
    // Usamos un servicio de avatares generados automáticamente
    // https://ui-avatars.com/ genera avatares con iniciales
    const colors = {
      empresa: "FF6B00", // Naranja para empresas
      cliente: "0EA5E9", // Azul para clientes
      superadmin: "DC2626", // Rojo para superadmin
      default: "6B7280", // Gris por defecto
    };

    const bgColor =
      colors[tipoUsuario as keyof typeof colors] || colors.default;
    const initials = tipoUsuario.charAt(0).toUpperCase();

    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=ffffff&size=200&font-size=0.5&bold=true`;
  }

  /**
   * Crear URL de imagen con fallback
   */
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
