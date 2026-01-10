"use client";
import { ImagenPerfil } from "@/components/shared/ImagenPerfil";
import { cn } from "@/lib/utils";

interface ProfileImageManagerProps {
  userId: string;
  tipoUsuario: string;
  userName: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onImageUpdate?: (newUrl: string) => void;
}

export function ProfileImageManager({
  userId,
  tipoUsuario,
  userName,
  imageUrl,
  size = "md",
  className,
  onImageUpdate,
}: ProfileImageManagerProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <ImagenPerfil
        imageUrl={imageUrl}
        tipoUsuario={tipoUsuario as "cliente" | "empresa"}
        userId={userId}
        size={size}
        onImageUpdate={onImageUpdate}
      />
    </div>
  );
}
