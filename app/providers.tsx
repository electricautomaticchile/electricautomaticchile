"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AppContextProvider } from "@/lib/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Crear QueryClient con configuración optimizada
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo de cache: 5 minutos
            staleTime: 1000 * 60 * 5,
            // Tiempo antes de garbage collection: 10 minutos
            gcTime: 1000 * 60 * 10,
            // Retry fallido: 1 vez
            retry: 1,
            // Retry delay: 1 segundo
            retryDelay: 1000,
            // Refetch on window focus solo en producción
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Refetch interval: disabled por defecto
            refetchInterval: false,
          },
          mutations: {
            // Retry mutations fallidas: 0 veces (no retry automático)
            retry: 0,
            // Timeout para mutations: 30 segundos
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="electricautomaticchile-theme"
        forcedTheme={undefined}
        themes={["light", "dark"]}
      >
        <AppContextProvider>{children}</AppContextProvider>
      </ThemeProvider>

      {/* React Query Devtools - solo en desarrollo */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
