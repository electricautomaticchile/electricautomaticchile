"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  connected: boolean;
  className?: string;
}

export function LiveBadge({ connected, className }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        connected
          ? "bg-orange-500/20 text-orange-400 dark:bg-orange-500/20 dark:text-orange-400"
          : "bg-white/10 text-white/40 dark:bg-white/10 dark:text-white/40",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "bg-orange-500 animate-pulse" : "bg-white/30"
        )}
      />
      {connected ? "En vivo" : "Desconectado"}
    </div>
  );
}
