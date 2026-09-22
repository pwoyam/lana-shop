import type { Metadata } from 'next'
import { getSettings } from './settings'

type SeoProps = {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
}

export async function generateSeo({
  title,
  description,
  image,
  url,
  type = 'website',
}: SeoProps = {}): Promise<Metadata> {
  const settings = await getSettings()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = settings.site_name
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | ${settings.site_tagline}`
  const desc = description || settings.site_description
  const ogImage = image || `${baseUrl}/og-default.png`

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(baseUrl),
    keywords: ['فروشگاه', 'لباس', 'اکسسوری', 'مد', 'پوشاک', 'خرید آنلاین', siteName],
    authors: [{ name: siteName }],
    openGraph: {
      type: type === 'product' ? 'website' : type,
      title: fullTitle,
      description: desc,
      url: url || baseUrl,
      siteName,
      locale: 'fa_IR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}
