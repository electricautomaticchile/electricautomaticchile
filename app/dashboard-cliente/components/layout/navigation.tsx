import React from "react";
import Link from "next/link";
import { Home, BarChart2, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard-cliente", label: "Resumen", icon: Home },
  { href: "/dashboard-cliente/consumo", label: "Consumo", icon: BarChart2 },
  {
    href: "/dashboard-cliente/documentos",
    label: "Documentos",
    icon: FileText,
  },
];

const NavigationCliente: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r bg-white shadow-sm md:flex">
      <nav className="flex flex-col gap-1 p-4 text-sm font-medium text-slate-700">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded px-3 py-2 hover:bg-orange-50 hover:text-orange-600 ${
              pathname === href ? "bg-orange-100 text-orange-600" : ""
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default NavigationCliente;
