"use client";

import { CotizacionesDashboard } from "../componentes/cotizaciones-dashboard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Home, FileText } from "lucide-react";

export default function CotizacionesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard-superadmin">
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard-superadmin/cotizaciones" isCurrentPage>
              <FileText className="h-4 w-4 mr-1" />
              Cotizaciones
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cotizaciones</h1>
        <p className="text-gray-500">Administre todas las solicitudes de cotización de sus clientes</p>
      </div>
      
      <CotizacionesDashboard />
    </div>
  );
} 