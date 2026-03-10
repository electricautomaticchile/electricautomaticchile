"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const schemes = {
  blue:    { accent: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/40",     icon: "bg-sky-500" },
  orange:  { accent: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/40",  icon: "bg-orange-500" },
  green:   { accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", icon: "bg-emerald-600" },
  purple:  { accent: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/40",  icon: "bg-violet-600" },
  emerald: { accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", icon: "bg-emerald-500" },
  red:     { accent: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/40",     icon: "bg-red-500" },
} as const;

export type ColorScheme = keyof typeof schemes;

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorScheme: ColorScheme;
  delay?: number;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue, colorScheme, delay = 0 }: KPICardProps) {
  const s = schemes[colorScheme];

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay }}>
      <div className={cn("stat-card bg-card border", s.border, "group")}>
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
        <div className="flex items-start justify-between mb-5">
          <p className={cn("text-sm font-semibold uppercase tracking-wide", s.accent)}>{title}</p>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-md", s.icon)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold tracking-tight text-foreground">
              {typeof value === "number" ? <AnimatedCounter value={value} duration={1200} /> : value}
            </p>
            {subtitle && <span className="text-base text-muted-foreground">{subtitle}</span>}
          </div>
          {trendValue && (
            <div className="flex items-center gap-1.5">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-emerald-400" />
              ) : (
                <Activity className="h-4 w-4 text-orange-400" />
              )}
              <span className="text-sm text-muted-foreground">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
