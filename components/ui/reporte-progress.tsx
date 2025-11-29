"use client";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ReporteProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ReporteProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
}: ReporteProgressProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-600 dark:text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
