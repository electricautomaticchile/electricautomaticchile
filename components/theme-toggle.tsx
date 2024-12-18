"use client"

import * as React from "react"
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const availableThemes = ["blanco", "oscuro"]
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted && !theme) {
      setTheme("oscuro")
    }
  }, [mounted, theme, setTheme])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "oscuro" ? "blanco" : "oscuro")}>
          {theme === "oscuro" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableThemes.map(theme => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {theme === "oscuro" ? (
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
