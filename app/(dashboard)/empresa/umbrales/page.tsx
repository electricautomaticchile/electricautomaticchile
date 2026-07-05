import { EmpresaRoute } from "@/components/auth/protected-route";
import { UmbralesAlerta } from "../features/umbrales";

export default function UmbralesPage() {
  return (
    <EmpresaRoute>
      <div className="min-h-screen bg-background p-6">
        <UmbralesAlerta />
      </div>
    </EmpresaRoute>
  );
}
