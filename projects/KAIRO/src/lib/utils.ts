import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  } catch (error) {
    return '$0.00'
  }
}

export function formatPercent(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%'
  try {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  } catch (error) {
    return '0.00%'
  }
}

export function formatNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0'
  try {
    return new Intl.NumberFormat('en-US').format(value)
  } catch (error) {
    return '0'
  }
}