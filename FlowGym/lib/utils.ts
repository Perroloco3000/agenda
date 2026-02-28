import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVenezuelaTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Caracas" }));
}

export function getVenezuelaDateString() {
  const date = getVenezuelaTime();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
