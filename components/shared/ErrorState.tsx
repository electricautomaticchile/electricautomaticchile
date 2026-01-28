"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({ 
  message = "Ocurrió un error al cargar los datos", 
  onRetry,
  fullScreen = false 
}: ErrorStateProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-600" />
      <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function InlineErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="underline hover:text-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
