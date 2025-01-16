"use client"
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/app/dashempresa/components/sidebar/sidebar"
import { Header } from "@/app/dashempresa/components/header/header"

import { SystemStatus } from "@/app/dashempresa/components/systemstatus/systemstatus"
import { RecentActivity } from "@/app/dashempresa/components/activity/activity"
import { HourlyChart } from "@/app/dashempresa/components/charthours/charthours"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('general')

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 space-y-4 overflow-y-auto p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Panel de Control</h1>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <SystemStatus />
            <RecentActivity />
          </div>
          <HourlyChart />
        </main>
      </div>
    </div>
  )
}

