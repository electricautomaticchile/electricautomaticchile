"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({
  message = "Cargando...",
  fullScreen = false,
  size = "md",
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-[200px] items-center justify-center">{content}</div>;
}
