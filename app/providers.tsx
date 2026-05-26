"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AppContextProvider } from "@/lib/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // MED-03: 30 segundos para sistema de monitoreo en tiempo real
            gcTime: 1000 * 60 * 5,
            retry: 1,
            retryDelay: 1000,
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
            refetchOnReconnect: true,
            refetchInterval: false,
          },
          mutations: {
            retry: 0,
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
        storageKey="electricautomaticchile-theme"
        forcedTheme={undefined}
        themes={["light", "dark"]}
      >
        <AppContextProvider>{children}</AppContextProvider>
      </ThemeProvider>

      {process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_SHOW_QUERY_DEVTOOLS === "true" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
