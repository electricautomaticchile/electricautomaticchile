"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const zonas = [
  { nombre: "Zona Norte",  consumo: 85, color: "bg-red-500" },
  { nombre: "Zona Centro", consumo: 65, color: "bg-orange-500" },
  { nombre: "Zona Sur",    consumo: 45, color: "bg-orange-400" },
  { nombre: "Zona Este",   consumo: 72, color: "bg-orange-600" },
  { nombre: "Zona Oeste",  consumo: 38, color: "bg-orange-300" },
];

export function MapaCalor() {
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
              className={cn("h-full rounded-full", zona.color)}
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
