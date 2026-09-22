/**
 * تبدیل رنگ hex به RGB و ساخت سایه‌های روشن/تیره
 */

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  if (h.length !== 6) return { r: 107, g: 79, b: 58 } // fallback
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b]
    .map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0'))
    .join('')
}

function mixWithWhite(hex: string, percent: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(
    r + (255 - r) * percent,
    g + (255 - g) * percent,
    b + (255 - b) * percent
  )
}

function mixWithBlack(hex: string, percent: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r * (1 - percent), g * (1 - percent), b * (1 - percent))
}

/**
 * از یک رنگ اصلی، ۱۱ سایه (50 تا 950) می‌سازه
 */
export function generateBrandShades(primary: string): Record<string, string> {
  const base = primary.startsWith('#') ? primary : `#${primary}`
  return {
    '50':  mixWithWhite(base, 0.95),
    '100': mixWithWhite(base, 0.88),
    '200': mixWithWhite(base, 0.75),
    '300': mixWithWhite(base, 0.55),
    '400': mixWithWhite(base, 0.30),
    '500': mixWithWhite(base, 0.10),
    '600': base,
    '700': mixWithBlack(base, 0.15),
    '800': mixWithBlack(base, 0.30),
    '900': mixWithBlack(base, 0.48),
    '950': mixWithBlack(base, 0.65),
  }
}

/**
 * خروجی: یه رشته CSS که متغیرهای brand رو override می‌کنه
 */
export function buildBrandCss(primary: string): string {
  const shades = generateBrandShades(primary)
  const vars = Object.entries(shades)
    .map(([k, v]) => `  --color-brand-${k}: ${v};`)
    .join('\n')
  return `:root {\n${vars}\n}`
}
