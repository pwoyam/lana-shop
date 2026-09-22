import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { SiteSettings } from '@/lib/settings'

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative bg-gradient-to-l from-brand-50 via-brand-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* متن */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium">
              ✨ کالکشن جدید
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-900 leading-tight">
              شیک بپوش،
              <br />
              <span className="text-brand-600">هوشمندانه بخر</span>
            </h1>
            <p className="text-brand-600 text-base md:text-lg leading-7 max-w-md">
              {settings.site_description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-brand-700 text-white font-medium hover:bg-brand-800 transition-colors"
              >
                مشاهده فروشگاه
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center h-12 px-6 rounded-lg border border-brand-300 text-brand-800 font-medium hover:bg-brand-50 transition-colors"
              >
                درباره ما
              </Link>
            </div>
          </div>

          {/* تصویر دکوراتیو */}
          <div className="hidden md:block relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-200 via-brand-300 to-brand-400 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-brand-800 text-7xl font-bold opacity-30">
                {settings.site_name}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-brand-600/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
