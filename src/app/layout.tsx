import type { Metadata, Viewport } from "next"
import "@fontsource-variable/vazirmatn"
import "./globals.css"
import { Providers } from "./providers"
import { getSettings } from "@/lib/settings"
import { buildBrandCss } from "@/lib/colors"
import { generateSeo } from "@/lib/seo"
import { unstable_noStore as noStore } from "next/cache"

export async function generateMetadata(): Promise<Metadata> {
  return generateSeo()
}

export const viewport: Viewport = {
  themeColor: '#6B4F3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  noStore()
  const settings = await getSettings()
  const brandCss = buildBrandCss(settings.primary_color)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: settings.site_name,
    description: settings.site_description,
    url: baseUrl,
    telephone: settings.site_phone || undefined,
    email: settings.site_email || undefined,
    address: settings.site_address ? {
      '@type': 'PostalAddress',
      streetAddress: settings.site_address,
      addressCountry: 'IR',
    } : undefined,
  }

  return (
    <html lang="fa" dir="rtl">
      <head>
        <style dangerouslySetInnerHTML={{ __html: brandCss }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
