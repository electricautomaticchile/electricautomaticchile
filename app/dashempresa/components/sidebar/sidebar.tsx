import Link from "next/link"
import { Bolt, Home, Activity, Users, LineChart, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <div className="hidden w-64 flex-col border-r  lg:flex">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <Button
            variant={activeSection === 'general' ? 'secondary' : 'ghost'}
            className="flex items-center gap-3 justify-start"
            onClick={() => setActiveSection('general')}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeSection === 'monitoring' ? 'secondary' : 'ghost'}
            className="flex items-center gap-3 justify-start"
            onClick={() => setActiveSection('monitoring')}
          >
            <Activity className="h-4 w-4" />
            Monitoreo
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-3 justify-start"
          >
            <Users className="h-4 w-4" />
            Clientes
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-3 justify-start"
          >
            <LineChart className="h-4 w-4" />
            Reportes
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-3 justify-start"
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        </nav>
      </div>
    </div>
  )
}

