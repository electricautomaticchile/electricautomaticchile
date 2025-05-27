import Servicios from "@/components/servicios/servicios"
import HeroEstrategico from "@/components/hero-estrategico"

export default function Page() {
  return (
    <div className="space-y-12"> 
      <HeroEstrategico />
      <div className="py-8 border-y border-border">
        <Servicios />
      </div>
    </div>
  )
}
