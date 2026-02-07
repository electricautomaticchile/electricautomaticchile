import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Electricautomaticchile - Automatización Eléctrica Inteligente",
  description:
    "Soluciones de automatización en electricidad para hogares y empresas. Control de consumo, reposición automática y monitoreo en tiempo real.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        url: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ElectricAutomaticChile",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased dark:bg-black" suppressHydrationWarning>
        <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <Providers>
            <Navbar />
            <main className="flex-grow dark:bg-black">
              {children}
            </main>
            <Footer />
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
