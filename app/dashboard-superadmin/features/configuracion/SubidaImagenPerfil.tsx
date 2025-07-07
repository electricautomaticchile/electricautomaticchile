"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ProfileImageManager } from "@/components/ui/profile-image-manager";

interface SubidaImagenPerfilProps {
  profileImage: string | null;
  nombreUsuario: string;
  onImageChange: (imageUrl: string | null) => void;
  userId: string;
}

export function SubidaImagenPerfil({
  profileImage,
  nombreUsuario,
  onImageChange,
  userId,
}: SubidaImagenPerfilProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Convertir la imagen a base64 para previsualización
      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
        toast({
          title: "Éxito",
          description: "Imagen de perfil actualizada correctamente.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfileImage = () => {
    onImageChange(null);
    toast({
      title: "Éxito",
      description: "Imagen de perfil eliminada correctamente.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="foto-perfil" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Foto de Perfil
      </Label>
      <ProfileImageManager
        userId={userId}
        tipoUsuario="superadmin"
        currentImageUrl={profileImage || undefined}
        userName={nombreUsuario}
        size="md"
        showEditButton={true}
        onImageUpdate={onImageChange}
      />
    </div>
  );
}
