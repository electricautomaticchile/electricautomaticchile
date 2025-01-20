import Link from "next/link"
import { Power, Home, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* Error Icon with Glow Effect */}
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-4 bg-[#FF6B00]/20 blur-xl rounded-full"></div>
            <AlertCircle className="h-24 w-24 text-[#FF6B00] relative" />
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold sm:text-5xl">Página no encontrada</h1>
            <p className="text-gray-400 text-lg">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
          </div>

          {/* Error Code */}
          <div className="text-[#FF6B00] font-mono text-7xl font-bold opacity-50">
            404
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Volver al inicio
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
            >
              <Link href="/contacto">
                Contactar soporte
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>© 2024 ElectricAutomaticChile. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

