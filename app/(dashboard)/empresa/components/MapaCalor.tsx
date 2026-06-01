"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ZonaEnergia {
  nombre: string;
  consumo: number;
  color?: string;
}

const colorByConsumption = (consumo: number) => {
  if (consumo >= 80) return "bg-red-500";
  if (consumo >= 60) return "bg-orange-500";
  if (consumo >= 40) return "bg-orange-400";
  return "bg-orange-300";
};

export function MapaCalor({ zonas = [] }: { zonas?: ZonaEnergia[] }) {
  if (zonas.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground">
        Sin datos reales por zona
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {zonas.map((zona, idx) => (
        <motion.div
          key={zona.nombre}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">{zona.nombre}</span>
            <span className="text-muted-foreground font-medium">{zona.consumo}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", zona.color || colorByConsumption(zona.consumo))}
              initial={{ width: 0 }}
              animate={{ width: `${zona.consumo}%` }}
              transition={{ delay: idx * 0.08 + 0.2, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
