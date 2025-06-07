'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { AppContextProvider } from "@/lib/context/AppContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="electricautomaticchile-theme"
      forcedTheme={undefined}
      themes={['light', 'dark']}
    >
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </ThemeProvider>
  )
} 