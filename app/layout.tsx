import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { ThemeProvider } from "@/components/theme-provider";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electricautomaticchile",
  description: "Automatización en electricidad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
    
          <ThemeProvider
            attribute="class"
            defaultTheme="blanco"
            disableTransitionOnChange
          >
            <Navbar />
            <main className="container min-h-min mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
 
      </body>
    </html>
  );
}
