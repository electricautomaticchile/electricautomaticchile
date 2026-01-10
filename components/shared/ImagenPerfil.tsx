"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";

interface ImagenPerfilProps {
  imageUrl?: string;
  tipoUsuario: "cliente" | "empresa";
  userId: string;
  onImageUpdate?: (newUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ImagenPerfil({
  imageUrl,
  tipoUsuario,
  userId,
  onImageUpdate,
  size = "md",
}: ImagenPerfilProps) {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("imagen", file);

      const response = await apiClient.post(
        `/api/imagenes-perfil/${tipoUsuario}/${userId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.imageURL) {
        setCurrentImage(response.data.imageURL);
        onImageUpdate?.(response.data.imageURL);
        toast({
          title: "Éxito",
          description: "Imagen de perfil actualizada",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al subir imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    setDeleting(true);

    try {
      await apiClient.delete(
        `/api/imagenes-perfil/${tipoUsuario}/${userId}`
      );

      setCurrentImage(undefined);
      onImageUpdate?.("");
      toast({
        title: "Éxito",
        description: "Imagen de perfil eliminada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al eliminar imagen",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center`}
        >
          {currentImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImage}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-1/2 h-1/2 text-gray-400" />
          )}
        </div>

        {currentImage && !uploading && !deleting && (
          <button
            onClick={handleDelete}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            title="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {(uploading || deleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || deleting}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Camera className="w-4 h-4" />
        {currentImage ? "Cambiar foto" : "Subir foto"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        JPG, PNG o WEBP. Máximo 5MB
      </p>
    </div>
  );
}
