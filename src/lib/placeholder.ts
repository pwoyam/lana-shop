/**
 * ساخت SVG به‌صورت data URI — بدون نیاز به اینترنت
 * رنگ‌ها با پالت قهوه‌ای سایت هماهنگ هستند
 */
const palettes = [
  { bg: '#6B4F3A', fg: '#FAF7F2' },
  { bg: '#9C7B5A', fg: '#FAF7F2' },
  { bg: '#3E2C1F', fg: '#F5EFE6' },
  { bg: '#D4C0A8', fg: '#3E2C1F' },
  { bg: '#B89B7A', fg: '#2A1D14' },
  { bg: '#4A3628', fg: '#FAF7F2' },
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function placeholderImage(text: string, index = 0): string {
  const palette = palettes[(hash(text) + index) % palettes.length]
  const initials = text.trim().split(' ').slice(0, 2).map(w => w[0]).join('')
  const safe = text.replace(/[<>&"']/g, '').slice(0, 30)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bg}"/>
        <stop offset="100%" stop-color="${palette.bg}dd"/>
      </linearGradient>
    </defs>
    <rect width="600" height="800" fill="url(#g)"/>
    <circle cx="300" cy="320" r="110" fill="${palette.fg}" opacity="0.1"/>
    <text x="300" y="350" font-family="sans-serif" font-size="80" font-weight="700" fill="${palette.fg}" text-anchor="middle" opacity="0.9">${initials}</text>
    <text x="300" y="620" font-family="sans-serif" font-size="26" font-weight="500" fill="${palette.fg}" text-anchor="middle" opacity="0.85">${safe}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
