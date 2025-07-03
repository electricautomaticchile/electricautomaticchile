"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SubidaImagenPerfilProps {
  profileImage: string | null;
  nombreUsuario: string;
  onImageChange: (imageUrl: string | null) => void;
}

export function SubidaImagenPerfil({
  profileImage,
  nombreUsuario,
  onImageChange,
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
    <div className="space-y-4">
      <Label>Foto de Perfil</Label>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src={profileImage || "/avatars/admin.jpg"} />
            <AvatarFallback className="text-xl">
              {nombreUsuario?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>

          {profileImage && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={removeProfileImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sube una foto de perfil. Se recomienda una imagen cuadrada de al
            menos 250x250 píxeles.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={triggerFileInput}
              disabled={uploadingImage}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploadingImage ? "Subiendo..." : "Cambiar Foto"}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
