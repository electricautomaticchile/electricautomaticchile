import React from "react";
import { Home, Zap, FileText, Clock, AlertCircle, User, HelpCircle } from "lucide-react";

interface NavigationClienteProps {
  onNavigate?: (item: string | null) => void;
  activeItem?: string | null;
}

const navItems = [
  { id: "resumen", label: "Resumen", icon: Home },
  { id: "consumo", label: "Consumo", icon: Zap },
  { id: "boletas", label: "Boletas", icon: FileText },
  { id: "historial", label: "Historial", icon: Clock },
  { id: "alertas", label: "Alertas", icon: AlertCircle },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "soporte", label: "Soporte", icon: HelpCircle },
];

const NavigationCliente: React.FC<NavigationClienteProps> = ({ onNavigate, activeItem }) => {
  const handleClick = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId === "resumen" ? null : itemId);
    }
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card shadow-sm md:flex sticky top-0 h-screen">
      <nav className="flex flex-col gap-1 p-4 text-sm font-medium overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeItem === id || (activeItem === null && id === "resumen");
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-orange-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default NavigationCliente;
