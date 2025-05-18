"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Definición del tipo de datos del contexto
interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userRole: 'admin' | 'empresa' | 'usuario' | null;
  setUserRole: (role: 'admin' | 'empresa' | 'usuario' | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

// Valor por defecto del contexto
const defaultContextValue: AppContextType = {
  isDarkMode: false,
  toggleDarkMode: () => {},
  userRole: null,
  setUserRole: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};

// Crear el contexto
const AppContext = createContext<AppContextType>(defaultContextValue);

// Hook personalizado para usar el contexto
export const useAppContext = () => useContext(AppContext);

// Proveedor del contexto
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<'admin' | 'empresa' | 'usuario' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determinar si está en modo oscuro basado en el tema resuelto actual
  const isDarkMode = mounted ? (resolvedTheme === 'dark') : false;

  // Función mejorada para cambiar el tema
  const toggleDarkMode = () => {
    if (mounted) {
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      console.log(`Cambiando tema de ${resolvedTheme} a ${newTheme}`);
      setTheme(newTheme);
    }
  };

  // Si no está montado, devolver los hijos para evitar parpadeo durante la hidratación
  if (!mounted) {
    return <>{children}</>;
  }

  // El valor del contexto
  const contextValue: AppContextType = {
    isDarkMode,
    toggleDarkMode,
    userRole,
    setUserRole,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 