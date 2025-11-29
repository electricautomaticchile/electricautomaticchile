"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileImageManagerProps {
  userId: string;
  tipoUsuario: string;
  userName: string;
  size?: "sm" | "md" | "lg";
  showEditButton?: boolean;
  className?: string;
}

export function ProfileImageManager({
  userId,
  tipoUsuario,
  userName,
  size = "md",
  showEditButton = false,
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

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={`/api/users/${userId}/avatar`} alt={userName} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
