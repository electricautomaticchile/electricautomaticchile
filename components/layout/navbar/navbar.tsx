"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, LogOut, Zap, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/acerca-de", label: "Nosotros" },
  { href: "/formulario", label: "Contacto" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [portalHref, setPortalHref] = useState("/cliente");
  const pathname = usePathname();

  const checkAuth = useCallback(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("auth_token="));
    const hasToken = !!tokenCookie && tokenCookie.split("=").slice(1).join("=").trim().length > 10;
    setIsAuthenticated(hasToken);
    if (hasToken) {
      const userCookie = cookies.find((c) => c.trim().startsWith("user_data="));
      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie.split("=").slice(1).join("=")));
          setPortalHref(userData.tipoUsuario === "empresa" ? "/empresa" : "/cliente");
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Re-verificar auth en cada cambio de ruta
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("permisos");
    localStorage.removeItem("userType");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "glass border-b border-white/10 shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-md group-hover:bg-orange-500/30 transition-all duration-300" />
            <Logo showText={true} className="relative" />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-orange-500/8 group"
            >
              {label}
              <span className="absolute bottom-1 left-4 right-4 h-px bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link href="/cliente-login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium hover:bg-orange-500/10 hover:text-orange-400 transition-all duration-200"
                >
                  Portal Clientes
                </Button>
              </Link>
              <Link href="/empresa-login">
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Portal Empresas
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={portalHref}>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all duration-200 gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Mi Portal
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-orange-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 glass border-l border-white/10">
              <div className="flex flex-col h-full pt-6">
                <Link href="/" className="mb-8">
                  <Logo showText={true} />
                </Link>
                <nav className="flex flex-col gap-1 flex-1">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-orange-500/8 transition-all duration-200 group"
                    >
                      {label}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {!isAuthenticated ? (
                    <>
                      <Link href="/cliente-login">
                        <Button variant="outline" className="w-full justify-start">
                          Portal Clientes
                        </Button>
                      </Link>
                      <Link href="/empresa-login">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2">
                          <Zap className="h-4 w-4" />
                          Portal Empresas
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href={portalHref}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2">
                          <Zap className="h-4 w-4" />
                          Mi Portal
                        </Button>
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start hover:bg-red-500/10 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

