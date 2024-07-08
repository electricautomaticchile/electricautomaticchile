"use client";
import Navbar from "@/app/dashboard/nav-dash";
import Header from "@/app/dashboard/header";
import EnergyMounth from "./energy-mounth";
import AutomaticEnergy from "./automatic-replenishment";
import EnergyConsumed from "./energy-consumed";
import EnergyMounth3 from "./energy-mounth3";
import Payments from "./Payments";
import ConsumedFourHour from "./consumedforhour";
import SectorEnergy from "./sectorenergy";


export default function Component() {
 
  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <Navbar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <EnergyMounth/>
            <AutomaticEnergy/>
            <EnergyConsumed/>
            <EnergyMounth3/>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Payments/>
            <ConsumedFourHour/>
            <SectorEnergy/>
          </div>
        </main>
      </div>
    </div>
  );
}
