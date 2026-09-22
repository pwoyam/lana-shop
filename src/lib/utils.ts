import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان'
}

export function toPersianNumber(num: number | string): string {
  return new Intl.NumberFormat('fa-IR').format(Number(num))
}

export function toEnglishDigits(str: string): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹'
  const arabic = '٠١٢٣٤٥٦٧٨٩'
  return str.replace(/[۰-۹٠-٩]/g, (d) => {
    const p = persian.indexOf(d)
    const a = arabic.indexOf(d)
    return String(p !== -1 ? p : a)
  })
}
