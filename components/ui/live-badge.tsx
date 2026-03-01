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
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "bg-green-500 animate-pulse" : "bg-gray-400"
        )}
      />
      {connected ? "En vivo" : "Desconectado"}
    </div>
  );
}
