import { DebugApi } from "@/components/debug-api";

export default function DebugApiPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Debug de API</h1>
          <p className="text-muted-foreground mt-2">
            Herramienta para diagnosticar problemas de conectividad con el
            backend
          </p>
        </div>

        <DebugApi />

        <div className="text-center text-sm text-muted-foreground max-w-2xl">
          <p>
            Esta página te ayudará a identificar problemas de CORS, conectividad
            y configuración entre el frontend y backend. Ejecuta los tests para
            obtener información detallada.
          </p>
        </div>
      </div>
    </div>
  );
}
