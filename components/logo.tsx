import React from "react";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      width={width}
      height={height}
      alt="Electricautomaticchile Logo"
      className={`transition-transform duration-300 hover:scale-105 ${className}`}
      priority
    />
  );
}
