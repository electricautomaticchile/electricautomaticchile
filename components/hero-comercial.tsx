import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export function HeroComercial() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600">
      <div className="container mx-auto text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Zap className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Electric Automatic Chile
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Monitoreo inteligente de consumo eléctrico en tiempo real
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/formulario">
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
              Solicitar Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
