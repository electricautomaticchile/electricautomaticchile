"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AppContextProvider } from "@/lib/context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { fetchCSRFToken } from "@/lib/utils/csrf";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
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

  useEffect(() => {
    fetchCSRFToken();
  }, []);

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

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
