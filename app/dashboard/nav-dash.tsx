import { Bolt } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Map } from 'lucide-react';
import { Home } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package2 } from 'lucide-react';


const nav = () => {
    return(
        <div className="hidden border-r lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Package2 className="h-6 w-6" />
              <span className="">Dashboard</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only"></span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg  px-3 py-2 text-primary  transition-all hover:text-primary"
                prefetch={false}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <Bolt className="h-4 w-4" />
                Control de consumo
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <DollarSign className="h-4 w-4" />
                Pagos
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <Map className="h-4 w-4" />
                Sectores sin energia
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                prefetch={false}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Link>
            </nav>
          </div>
        </div>
      </div>
    )
}
export default nav