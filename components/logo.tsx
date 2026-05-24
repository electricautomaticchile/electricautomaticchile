import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        showText ? "h-12 w-[210px] sm:w-[240px]" : "h-10 w-10",
        className
      )}
    >
      <Image
        src="/images/brand/logo.svg"
        alt="ElectricAutomaticChile"
        fill
        sizes={showText ? "(max-width: 640px) 210px, 240px" : "40px"}
        className="object-contain"
        priority
      />
    </div>
  );
}
