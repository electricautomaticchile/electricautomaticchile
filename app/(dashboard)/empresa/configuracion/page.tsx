import { EmpresaRoute } from "@/components/auth/protected-route";
import { ConfiguracionEmpresa } from "../features/configuracion";

export default function ConfiguracionPage() {
  return (
    <EmpresaRoute>
      <div className="min-h-screen bg-background p-6">
        <ConfiguracionEmpresa />
      </div>
    </EmpresaRoute>
  );
}
