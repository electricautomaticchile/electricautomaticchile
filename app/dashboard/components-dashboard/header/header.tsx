import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const header = () => {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b  px-6">
      <Link href="#" className="lg:hidden" prefetch={false}>
        <span className="sr-only">Inicio</span>
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border w-8 h-8"
          >
            <Image
              src="/placeholder.svg"
              width="32"
              height="32"
              className="rounded-full"
              alt="Avatar"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href="dashboard/components-dashboard/settings">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          </Link>
          <DropdownMenuSeparator />
          <Link href="dashboard/components-dashboard/suport">
            <DropdownMenuItem>Soporte</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar Sesion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default header;
