import Link from 'next/link'
import { Search, User, Heart } from 'lucide-react'
import { getAllCategories } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { CartIcon } from './CartIcon'
import type { SiteSettings } from '@/lib/settings'

type Props = {
  settings: SiteSettings
  initialQuery?: string
}

export async function Header({ settings, initialQuery }: Props) {
  const [categories, user] = await Promise.all([getAllCategories(), getCurrentUser()])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-100 bg-white/95 backdrop-blur-sm">
      <div className="bg-brand-700 text-white text-xs">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <span>ارسال رایگان برای خرید بالای {Number(settings.free_shipping_threshold).toLocaleString('fa-IR')} تومان</span>
          <span className="hidden sm:inline">{settings.site_phone}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold text-brand-800">{settings.site_name}</span>
            <span className="hidden md:inline text-xs text-brand-500 border-r border-brand-200 pr-2 mr-2">
              {settings.site_tagline}
            </span>
          </Link>

          <form action="/shop" method="GET" className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
            <input
              type="search"
              name="q"
              defaultValue={initialQuery}
              placeholder="جستجوی محصول..."
              className="w-full h-10 rounded-lg border border-brand-200 bg-brand-50/50 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </form>

          <div className="flex items-center gap-1">
            <Link href="/account/wishlist" className="p-2 hover:bg-brand-50 rounded-lg transition-colors" aria-label="علاقه‌مندی‌ها">
              <Heart className="h-5 w-5 text-brand-700" />
            </Link>

            {user ? (
              <Link href="/account" className="p-2 hover:bg-brand-50 rounded-lg transition-colors flex items-center gap-2">
                <User className="h-5 w-5 text-brand-700" />
                <span className="hidden md:inline text-xs text-brand-700">{user.name || 'حساب من'}</span>
              </Link>
            ) : (
              <Link href="/login" className="px-3 h-9 flex items-center rounded-lg bg-brand-700 text-white text-xs font-medium hover:bg-brand-800 transition">
                ورود / ثبت‌نام
              </Link>
            )}

            <CartIcon />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 pb-3 overflow-x-auto">
          <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900 whitespace-nowrap">
            همه محصولات
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="text-sm text-brand-600 hover:text-brand-900 whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
