"use client";
import { Card, CardContent } from "@/components/ui/card"
import { BoltIcon, GaugeIcon, BellIcon } from 'lucide-react'
import test from "@/public/test.jpg"
import Image from "next/image";

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p >{description}</p>
    </div>
  )
}


export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 md:py-16 lg:py-20">
    <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Con tu medidor bajo control tu consumo eléctrico
            <span className="text-orange-500"> disminuye</span>
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Automatiza la reposición del servicio y gestiona el consumo eléctrico con tecnología de punta
          </p>
        </div>
        <div className="flex-1">
          <Image
            src={test.src}
            alt="Dashboard de control eléctrico"
            className="rounded-lg shadow-2xl"
            width={500}
            height={300}
          />
        </div>
      </section>
      <section className=" py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            No necesitas esperas, <span className="text-orange-500">necesitas automatización</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <InfoCard
              icon={<BoltIcon className="w-12 h-12 text-orange-500" />}
              title="Reposición Automática"
              description="Restauración inmediata del servicio tras la regularización del pago"
            />
            <InfoCard
              icon={<GaugeIcon className="w-12 h-12 text-orange-500" />}
              title="Lectura en Tiempo Real"
              description="Monitoreo automático del consumo energético"
            />
            <InfoCard
              icon={<BellIcon className="w-12 h-12 text-orange-500" />}
              title="Notificaciones Instantáneas"
              description="Alertas inmediatas sobre consumo y estado del servicio"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
