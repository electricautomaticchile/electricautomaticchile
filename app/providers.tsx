'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AppContextProvider } from "@/lib/context/AppContext"
import { SocketProvider } from "@/lib/socket/socket-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
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
          <SocketProvider>
            {children}
          </SocketProvider>
        </AppContextProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 