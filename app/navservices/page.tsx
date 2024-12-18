import Consumo from "@/app/navservices/consumo/page"
import Hardware from "@/app/navservices/hardware/page"
import Reposicion from "@/app/navservices/reposicion/page"



export default function page() {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <Reposicion />
        <Hardware />
        <Consumo />
    </div>
  )
}
