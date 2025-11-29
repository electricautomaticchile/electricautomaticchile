import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <Zap className="h-5 w-5 text-white" />
      </div>
      {showText && (
        <span className="font-bold text-lg">Electric Automatic</span>
      )}
    </div>
  );
}
