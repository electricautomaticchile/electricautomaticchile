"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorEmpresa({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Empresa]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <ServerCrash className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-foreground">
            No se pudo conectar al servidor
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            El backend no está respondiendo. Verifica que el servidor Go esté corriendo en{" "}
            <code className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded text-xs">
              localhost:4000
            </code>
          </p>
          {error?.message && (
            <p className="text-xs text-muted-foreground/60 font-mono bg-muted rounded-lg px-3 py-2 mt-3 text-left break-all">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Recargar página
          </Button>
        </div>
      </div>
    </div>
  );
}
