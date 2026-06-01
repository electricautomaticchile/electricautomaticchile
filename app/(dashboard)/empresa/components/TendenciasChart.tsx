"use client";

import { motion } from "framer-motion";

interface TendenciaItem {
  label: string;
  value: string;
  percentage: number;
}

export function TendenciasChart({ data }: { data: TendenciaItem[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground">
        Sin lecturas historicas para graficar
      </div>
    );
  }

  return (
    <div className="h-64 w-full flex items-end gap-2 px-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
          <motion.div
            className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg relative group cursor-default"
            style={{ height: `${item.percentage}%` }}
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: idx * 0.08 + 0.2, duration: 0.5, type: "spring" }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
          </motion.div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
