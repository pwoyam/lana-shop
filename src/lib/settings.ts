import { cache } from 'react'
import { prisma } from './prisma'

export type SiteSettings = {
  [key: string]: string
  site_name: string
  site_tagline: string
  site_description: string
  site_logo: string
  site_phone: string
  site_email: string
  site_address: string
  site_instagram: string
  site_telegram: string
  primary_color: string
  secondary_color: string
  shipping_cost: string
  free_shipping_threshold: string
}

const defaults: SiteSettings = {
  site_name: 'لَنا',
  site_tagline: 'فروشگاه لباس و اکسسوری',
  site_description: '',
  site_logo: '',
  site_phone: '',
  site_email: '',
  site_address: '',
  site_instagram: '',
  site_telegram: '',
  primary_color: '#6B4F3A',
  secondary_color: '#FAF7F2',
  shipping_cost: '50000',
  free_shipping_threshold: '2000000',
}

// cache: در طول یک رندر، فقط یک بار query می‌زنه
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.setting.findMany()
    const map: Record<string, string> = { ...defaults }
    settings.forEach((s) => { map[s.key] = s.value })
    return map as SiteSettings
  } catch {
    return defaults
  }
})
