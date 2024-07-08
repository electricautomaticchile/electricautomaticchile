import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electricautomaticchile",
  description: "Automatización en electricidad",
  icons:{
    icon:['/favicon.ico?v=4'],
    apple:['/apple-touch-icon.png?v=4'],
    shortcut:['/apple-touch-icon.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
      <Providers>
      <ThemeProvider
            attribute="class"
            defaultTheme="blanco"
            enableSystem
            themes={["blanco","oscuro"]}
            disableTransitionOnChange
          >
        <Navbar/>
        {children}
        <Footer/>
        </ThemeProvider>
        </Providers>
        </body>
    </html>
  );
}
