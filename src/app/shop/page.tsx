import { Suspense } from 'react'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { SortSelect } from '@/components/shop/SortSelect'
import { getSettings } from '@/lib/settings'
import { getAllCategories, searchProducts, getAvailableFilters } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { getUserWishlistIds } from '@/lib/wishlist'

export const metadata = { title: 'فروشگاه' }

type SearchParams = Promise<{
  q?: string
  category?: string
  size?: string | string[]
  color?: string | string[]
  minPrice?: string
  maxPrice?: string
  inStock?: string
  sort?: string
}>

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const sizes = params.size ? (Array.isArray(params.size) ? params.size : [params.size]) : []
  const colors = params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : []

  const user = await getCurrentUser()
  const wishlistIds = user ? await getUserWishlistIds(user.id) : new Set<string>()

  const [settings, categories, filters, products] = await Promise.all([
    getSettings(),
    getAllCategories(),
    getAvailableFilters(),
    searchProducts({
      q: params.q,
      categorySlug: params.category,
      sizes,
      colors,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      inStock: params.inStock === '1',
      sort: (params.sort as any) || 'newest',
    }),
  ])

  const hasFilter =
    params.q || params.category || sizes.length || colors.length ||
    params.minPrice || params.maxPrice || params.inStock === '1'

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brand-900">
              {params.q ? `نتایج جستجو برای «${params.q}»` : 'همه محصولات'}
            </h1>
            <p className="text-brand-500 text-sm mt-2">
              {products.length.toLocaleString('fa-IR')} محصول
              {hasFilter && ' (فیلتر شده)'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <Suspense fallback={<div className="w-64 shrink-0" />}>
              <FilterSidebar
                categories={categories}
                availableSizes={filters.sizes}
                availableColors={filters.colors}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
              />
            </Suspense>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isLoggedIn={!!user}
                      isWishlisted={wishlistIds.has(p.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-brand-100 rounded-xl bg-brand-50">
                  <p className="text-brand-500 mb-2">محصولی با این فیلترها پیدا نشد</p>
                  <p className="text-xs text-brand-400">فیلترها رو تغییر بدید یا پاک کنید</p>
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
