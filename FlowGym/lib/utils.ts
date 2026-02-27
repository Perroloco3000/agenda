import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVenezuelaTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Caracas" }));
}
