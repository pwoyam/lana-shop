import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { ProductCard } from '@/components/shop/ProductCard'
import { getSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'علاقه‌مندی‌ها' }

export default async function WishlistPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()])
  if (!user) redirect('/login')

  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const products = items.map((i) => i.product).filter(Boolean)
  const wishlistIds = new Set(products.map((p) => p.id))

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <AccountSidebar />
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-brand-900">علاقه‌مندی‌ها</h1>
                <p className="text-brand-500 text-sm mt-1">{products.length.toLocaleString('fa-IR')} محصول</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 border border-brand-100 rounded-xl bg-brand-50">
                  <Heart className="h-12 w-12 text-brand-200 mx-auto mb-3" />
                  <p className="text-brand-500 mb-4">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
                  <Link href="/shop" className="inline-flex items-center h-10 px-4 rounded-lg bg-brand-700 text-white text-sm font-medium">
                    رفتن به فروشگاه
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isLoggedIn={true}
                      isWishlisted={wishlistIds.has(p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
