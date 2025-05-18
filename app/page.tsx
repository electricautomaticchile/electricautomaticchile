import Servicios from "@/components/servicios/servicios"
import Nosotros from "@/components/nosotros/nosotros"

export default function Page() {
  return (
    <div className="space-y-12"> 
      <Nosotros />
      <div className="py-8 border-y border-border">
        <Servicios />
      </div>
    </div>
  )
}
