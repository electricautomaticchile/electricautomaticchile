"use client";

import { Loader2 } from "lucide-react";

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
      {message && <span>{message}</span>}
    </div>
  );
}

export function ButtonLoadingState() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
