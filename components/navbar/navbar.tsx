"use client"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { NavigationMenu, NavigationMenuList, NavigationMenuLink, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu"
import  {ThemeToggle}  from "@/components/theme-toggle"
import Image from "next/image";
import icon from "@/public/android-chrome-512x512.png"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Component() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    //Diseño dispositos moviles//
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-background"
    }`}>
      <div className="flex h-20 w-full shrink-0 items-center px-4 md:px-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu color="#e66100"/>
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image
                src={icon}
                className="h-20 w-20 transition-transform duration-300 hover:scale-105"
                alt="Electricautomaticchile logo"
              />
              <span className="text-lg font-semibold">Electricautomaticchile</span>
            </Link>
            <div className="grid gap-4 py-6">
              <Link href="/" className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500" prefetch={false}>
                Inicio
              </Link>
              <Link href="/acercade" className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500" prefetch={false}>
                Nosotros
              </Link>
              <Link href="/navservices" className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500" prefetch={false}>
                Servicios
              </Link>
              <Link href="/formulario" className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500" prefetch={false}>
                Contacto
              </Link>
              <Link href="/auth/login" className="flex w-full items-center py-2 text-lg font-semibold transition-colors hover:text-orange-500" prefetch={false}>
                Portal Clientes
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-[400px]">
          <Link href="/" className="items-center gap-2 mr-6 hidden lg:flex transition-transform duration-300 hover:scale-105" prefetch={false}>
            <Image
              src={icon}
              className="h-14 w-14"
              alt="Electricautomaticchile logo"
            />
            <span className="text-lg font-semibold">Electricautomaticchile</span>
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
                href="/navservices"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-600 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Soluciones
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/acercade"
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
          <Link href="/auth/login">
            <Button variant="outline" className="transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500">
              Portal Clientes
            </Button>
          </Link>
          {session ? (
            <Button className="transition-all duration-200 hover:bg-orange-600" onClick={() => signOut()}>
              Cerrar sesión
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button className="transition-all duration-200 hover:bg-orange-600">Iniciar sesión</Button>
            </Link>
          )}
          <ThemeToggle/>
        </div>

      </div>
    </header>
  )
}
