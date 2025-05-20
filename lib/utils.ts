import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un número de cliente aleatorio en formato XXXXXX-X
 * @returns Número de cliente formato XXXXXX-X
 */
export function generateRandomClientNumber(): string {
  const numero = Math.floor(100000 + Math.random() * 900000);
  const verificador = Math.floor(Math.random() * 10);
  return `${numero}-${verificador}`;
}
