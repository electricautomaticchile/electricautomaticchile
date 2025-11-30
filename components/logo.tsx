import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.svg"
        alt="ElectricAutomaticChile"
        width={showText ? 240 : 50}
        height={showText ? 60 : 50}
        className="object-contain"
        priority
      />
    </div>
  );
}
