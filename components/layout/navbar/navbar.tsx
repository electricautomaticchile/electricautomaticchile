"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
      setIsAuthenticated(!!authCookie);
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("permisos");
    localStorage.removeItem("userType");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  return (
    //Diseño dispositos moviles//
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 dark:bg-black/90 backdrop-blur-md shadow-md"
          : "bg-background dark:bg-black"
      }`}
    >
      <div className="flex h-20 w-full shrink-0 items-center px-4 md:px-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu color="#e66100" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Logo
                showText={true}
                className="transition-transform duration-300 group-hover:scale-125"
              />
            </Link>
            <div className="grid gap-4 py-6">
              <Link
                href="/"
                className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500"
                prefetch={false}
              >
                Inicio
              </Link>
              <Link
                href="/acerca-de"
                className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500"
                prefetch={false}
              >
                Nosotros
              </Link>
              <Link
                href="/soluciones"
                className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500"
                prefetch={false}
              >
                Soluciones
              </Link>
              <Link
                href="/formulario"
                className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500"
                prefetch={false}
              >
                Contacto
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/cliente/login"
                    className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-blue-500"
                    prefetch={false}
                  >
                    Portal Clientes
                  </Link>
                  <Link
                    href="/empresa/login"
                    className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500"
                    prefetch={false}
                  >
                    Portal Empresas
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-red-500"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar Sesión
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-[400px]">
          <Link
            href="/"
            className="items-center gap-2 mr-6 hidden lg:flex transition-transform duration-300 hover:scale-105"
            prefetch={false}
          >
            <Logo
              showText={true}
              className="transition-transform duration-300 group-hover:scale-125"
            />
          </Link>
        </div>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-600 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Inicio
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link
                href="/soluciones"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-600 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Soluciones
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/acerca-de"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-600 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                ¿Por qué nosotros?
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/formulario"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-600 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Contacto
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex gap-2">
          {!isAuthenticated ? (
            <>
              <Link href="/cliente/login">
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500"
                >
                  Portal Clientes
                </Button>
              </Link>
              <Link href="/empresa/login">
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500"
                >
                  Portal Empresas
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
