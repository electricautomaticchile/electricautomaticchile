"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ImagenPerfilService } from "@/lib/api/services/imagenPerfilService";

interface ProfileImageManagerProps {
  userId: string;
  tipoUsuario: string;
  userName: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProfileImageManager({
  userId,
  tipoUsuario,
  userName,
  imageUrl,
  size = "md",
  className,
}: ProfileImageManagerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayUrl = ImagenPerfilService.createImageUrlWithFallback(
    imageUrl,
    tipoUsuario
  );

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={displayUrl} alt={userName} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
