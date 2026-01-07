"use client";
import { useState, useRef, ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";
import { ImagenPerfilService } from "@/lib/api/services/imagenPerfilService";

interface ProfileImageUploaderProps {
  userId: string;
  tipoUsuario: "empresa" | "cliente";
  currentImageUrl?: string;
  userName: string;
  size?: "sm" | "md" | "lg" | "xl";
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export function ProfileImageUploader({
  userId,
  tipoUsuario,
  currentImageUrl,
  userName,
  size = "xl",
  onUploadSuccess,
  onUploadError,
  className,
}: ProfileImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = ImagenPerfilService.validateImageFile(file);
    if (!validation.isValid) {
      onUploadError?.(validation.error || "Archivo inválido");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const result = await ImagenPerfilService.uploadAndUpdateProfileImage(
        selectedFile,
        tipoUsuario,
        userId
      );

      if (result.success && result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
        setPreviewUrl(undefined);
        setSelectedFile(null);
        onUploadSuccess?.(result.data.imageUrl);
      } else {
        onUploadError?.(result.error || "Error al subir imagen");
      }
    } catch (error) {
      onUploadError?.("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(undefined);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;

    setUploading(true);
    try {
      const result = await ImagenPerfilService.deleteProfileImage(
        tipoUsuario,
        userId
      );

      if (result.success) {
        setImageUrl(undefined);
        onUploadSuccess?.("");
      } else {
        onUploadError?.(result.error || "Error al eliminar imagen");
      }
    } catch (error) {
      onUploadError?.("Error al eliminar imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], "border-4 border-background shadow-lg")}>
          <AvatarImage src={previewUrl || imageUrl} alt={userName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        
        {imageUrl && !previewUrl && (
          <button
            onClick={handleDelete}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={uploading}
            variant="outline"
            size="sm"
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {imageUrl ? "Cambiar imagen" : "Subir imagen"}
          </Button>
        </div>
      )}
    </div>
  );
}
