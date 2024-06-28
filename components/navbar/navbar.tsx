"use client"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu } from 'lucide-react';
import { Zap } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { NavigationMenu, NavigationMenuList, NavigationMenuLink, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Component() {
  return (
    //Diseño dispositos moviles//

    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu  color="#e66100" className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="flex items-center gap-2">
            <Zap color="#e66100" className="h-6 w-6" />
            <span className="text-lg font-semibold">Electricautomaticchile</span>
          </Link>
          <div className="grid gap-4 py-6">
            <Link href="/" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Inicio
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Acerca de
            </Link>
            <Collapsible className="grid gap-4">
              <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                Servicios <ChevronRight color="#e66100" className="ml-auto h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="-mx-6 grid gap-6 bg-muted p-6">
                  <Link href="#" className="group grid h-auto w-full justify-start gap-1" prefetch={false}>
                    <div className="text-sm font-medium leading-none group-hover:underline">Desarrollo web</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Creamos soluciones web a medida.
                    </div>
                  </Link>
                  <Link href="#" className="group grid h-auto w-full justify-start gap-1" prefetch={false}>
                    <div className="text-sm font-medium leading-none group-hover:underline">Diseño gráfico</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Diseñamos tu imagen de marca.
                    </div>
                  </Link>
                  <Link href="#" className="group grid h-auto w-full justify-start gap-1" prefetch={false}>
                    <div className="text-sm font-medium leading-none group-hover:underline">Estrategia digital</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Impulsamos tu presencia online.
                    </div>
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Link href="/formulario" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Contacto
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-[250px]">
        <Link href="/" className="items-center gap-2 mr-6 hidden lg:flex" prefetch={false}>
          <Zap 
          className="h-6 w-6"
          color="#e66100" />
          <span className="text-lg font-semibold">Electricautomaticchile</span>
        </Link>
      </div>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity- data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              prefetch={false}
            >
              Inicio
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              href="#"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              prefetch={false}
            >
              Acerca de
            </Link>
          </NavigationMenuLink>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] p-2">
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">Desarrollo web</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Creamos soluciones web a medida.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">Diseño gráfico</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Diseñamos tu imagen de marca.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    prefetch={false}
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">Estrategia digital</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Impulsamos tu presencia online.
                    </div>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/formulario"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              prefetch={false}
            >
              Contacto
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
     
      <div className="ml-auto flex gap-2">
        <Link href="/auth">
        <Button>Iniciar sesión</Button>
        </Link>
        <ThemeToggle/>
      </div>{" "}
    </header>
  
  )
}


