"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useAppContext } from "@/lib/context/AppContext"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useAppContext()
  
  // Función de manejo de clic con prevención de doble clic
  const handleToggle = React.useCallback(() => {
    toggleDarkMode();
  }, [isDarkMode, toggleDarkMode]);

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleToggle}
      title={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
      className="transition-all duration-200 relative"
      aria-label="Toggle theme"
    >
      <Sun 
        className={`h-[1.2rem] w-[1.2rem] text-orange-300 absolute transition-all duration-300 ${
          isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`} 
      />
      <Moon 
        className={`h-[1.2rem] w-[1.2rem]  absolute transition-all duration-300 ${
          isDarkMode ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`} 
      />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
