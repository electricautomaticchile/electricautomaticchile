"use client";
import { useState } from "react";
import Navbar from "./components-dashboard/nav-dash/nav-dash";
import Header from "./components-dashboard/header/header";
import EnergyMounth from "./components-dashboard/energy-mounth/energy-mounth";
import AutomaticEnergy from "./components-dashboard/automatic-replenishment/page";
import EnergyConsumed from "./components-dashboard/energy-consumed/page";
import EnergyMounth3 from "./components-dashboard/energy-total-mounth/energy-total-mounth";
import Payments from "./components-dashboard/payments/page";
import ConsumedFourHour from "./components-dashboard/consumed-for-hour/consumedforhour";
import SectorEnergy from "./components-dashboard/sector-energy/page";
import Settings from "./components-dashboard/settings/page";
export default function Component() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "EnergyMounth":
        return <EnergyMounth />;
      case "AutomaticEnergy":
        return <AutomaticEnergy />;
      case "EnergyConsumed":
        return <EnergyConsumed />;
      case "EnergyMounth3":
        return <EnergyMounth3 />;
      case "Payments":
        return <Payments />;
      case "ConsumedFourHour":
        return <ConsumedFourHour />;
      case "SectorEnergy":
        return <SectorEnergy />;
      case "Settings":
        return <Settings />;
      default:
        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <EnergyMounth />
              <AutomaticEnergy />
              <EnergyConsumed />
              <EnergyMounth3 />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Payments />
              <ConsumedFourHour />
              <SectorEnergy />
            </div>
          </>
        );
    }
  };

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <Navbar onComponentClick={setActiveComponent} />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}
