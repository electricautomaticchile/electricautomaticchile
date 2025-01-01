import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Providers } from "./providers";
import favicon from "@/app/favicon.ico"

export const metadata: Metadata = {
  title: "Electricautomaticchile",
  description: "Automatización en electricidad",
  icons: {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <link
        rel="apple-touch-icon"
        href={favicon.src}
        type="image/png"
        sizes="32x32"
      />
      <body>
        <Providers>
          <Navbar />
          <main className="container min-h-min mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
