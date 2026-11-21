import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Two-digit counts, as the prototype shows them ("03", "01"). */
export const pad2 = (n: number) => String(n).padStart(2, '0')
