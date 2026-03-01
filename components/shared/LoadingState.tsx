"use client";

import { cn } from "@/lib/utils";
import { ElectricBolt } from "@/components/ui/electric-bolt";

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
  const sizeMap = { sm: 24, md: 40, lg: 56 };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <ElectricBolt size={sizeMap[size]} animated />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
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
