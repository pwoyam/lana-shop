import Link from 'next/link'
import { Send, Phone, Mail, MapPin } from 'lucide-react'
import type { SiteSettings } from '@/lib/settings'

type Props = {
  settings: SiteSettings
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function Footer({ settings }: Props) {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-brand-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-brand-900 mb-4">{settings.site_name}</h3>
            <p className="text-sm text-brand-600 leading-6">{settings.site_description}</p>
            <div className="flex gap-3 mt-4">
              {settings.site_instagram && (
                <a href={settings.site_instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg hover:bg-brand-100 transition" aria-label="اینستاگرام">
                  <InstagramIcon className="h-4 w-4 text-brand-700" />
                </a>
              )}
              {settings.site_telegram && (
                <a href={settings.site_telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg hover:bg-brand-100 transition" aria-label="تلگرام">
                  <Send className="h-4 w-4 text-brand-700" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-brand-900 mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-brand-600 hover:text-brand-900">فروشگاه</Link></li>
              <li><Link href="/about" className="text-brand-600 hover:text-brand-900">درباره ما</Link></li>
              <li><Link href="/contact" className="text-brand-600 hover:text-brand-900">تماس با ما</Link></li>
              <li><Link href="/rules" className="text-brand-600 hover:text-brand-900">قوانین و مقررات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brand-900 mb-4">حساب کاربری</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-brand-600 hover:text-brand-900">ورود</Link></li>
              <li><Link href="/register" className="text-brand-600 hover:text-brand-900">ثبت‌نام</Link></li>
              <li><Link href="/account/orders" className="text-brand-600 hover:text-brand-900">پیگیری سفارش</Link></li>
              <li><Link href="/account/wishlist" className="text-brand-600 hover:text-brand-900">علاقه‌مندی‌ها</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brand-900 mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm">
              {settings.site_phone && (
                <li className="flex items-center gap-2 text-brand-600">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span dir="ltr">{settings.site_phone}</span>
                </li>
              )}
              {settings.site_email && (
                <li className="flex items-center gap-2 text-brand-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span dir="ltr">{settings.site_email}</span>
                </li>
              )}
              {settings.site_address && (
                <li className="flex items-start gap-2 text-brand-600">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{settings.site_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-200 text-center text-xs text-brand-500">
          © {new Date().getFullYear()} {settings.site_name} — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  )
}
