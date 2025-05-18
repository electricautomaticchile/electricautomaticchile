import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Providers } from "./providers";
import favicon from "@/app/favicon.ico"

export const metadata: Metadata = {
  title: "Electricautomaticchile - Automatización Eléctrica Inteligente",
  description: "Soluciones de automatización en electricidad para hogares y empresas. Control de consumo, reposición automática y monitoreo en tiempo real.",
  icons: {
    icon: favicon.src,
    apple: favicon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link
          rel="apple-touch-icon"
          href={favicon.src}
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="container min-h-[calc(100vh-5rem)] mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
