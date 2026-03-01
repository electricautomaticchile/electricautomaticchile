"use client";

import { Loader2 } from "lucide-react";
import { ElectricBolt } from "@/components/ui/electric-bolt";

interface GlobalLoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function GlobalLoadingState({ 
  message = "Cargando...", 
  fullScreen = false 
}: GlobalLoadingStateProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <ElectricBolt size={56} animated />
          <p className="text-base font-medium text-muted-foreground animate-pulse">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <ElectricBolt size={40} animated />
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      {message && <span>{message}</span>}
    </div>
  );
}

export function ButtonLoadingState() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
