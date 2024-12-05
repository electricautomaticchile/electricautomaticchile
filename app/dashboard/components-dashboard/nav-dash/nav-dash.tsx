import { useState } from 'react';
import { Bolt, Bell, Map, Home, DollarSign, Settings, Package2, Menu, Battery } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NavbarProps {
  onComponentClick: (componentName: string | null) => void;
}

export default function Navbar({ onComponentClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavButton = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary w-full"
      onClick={() => {
        onClick();
        setIsMenuOpen(false);
      }}
    >
      {icon}
      {text}
    </button>
  );

  return (
    <nav>
      <div className="border-r">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Package2 className="h-6 w-6 lg:hidden" onClick={toggleMenu} />
              <Package2 className="h-6 w-6 hidden lg:block" />
              <span className="">Dashboard</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only"></span>
            </Button>
          </div>
          <div className={`flex-1 overflow-auto py-2 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <nav className="grid items-start px-4 text-l font-medium">
              <NavButton icon={<Home className="h-4 w-4" />} text="Inicio" onClick={() => onComponentClick(null)} />
              <NavButton icon={<Bolt className="h-4 w-4" />} text="Control de consumo" onClick={() => onComponentClick("EnergyMounth")} />
              <NavButton icon={<Battery className="h-4 w-4" />} text="Corte y reposición" onClick={() => onComponentClick("ReposicionPage")} />
              <NavButton icon={<DollarSign className="h-4 w-4" />} text="Pagos" onClick={() => onComponentClick("Payments")} />
              <NavButton icon={<Map className="h-4 w-4" />} text="Sectores sin Energía" onClick={() => onComponentClick("SectorEnergy")} />
              <NavButton icon={<Settings className="h-4 w-4" />} text="Configuración" onClick={() => onComponentClick("Settings")} />
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
