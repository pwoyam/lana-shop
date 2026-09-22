import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { getSettings } from '@/lib/settings'
import { getAllCategories, getProductsByCategory } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { getUserWishlistIds } from '@/lib/wishlist'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  return { title: category?.name || 'دسته‌بندی' }
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params

  const [settings, categories, products, category, user] = await Promise.all([
    getSettings(),
    getAllCategories(),
    getProductsByCategory(slug),
    prisma.category.findUnique({ where: { slug } }),
    getCurrentUser(),
  ])

  if (!category) notFound()

  const wishlistIds = user ? await getUserWishlistIds(user.id) : new Set<string>()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-xs text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-700">خانه</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-brand-700">فروشگاه</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-700">{category.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-900">{category.name}</h1>
            {category.description && <p className="text-brand-500 text-sm mt-2">{category.description}</p>}
            <p className="text-brand-400 text-xs mt-2">{products.length.toLocaleString('fa-IR')} محصول</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/shop" className="px-4 py-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm font-medium">
              همه
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat.slug === slug ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div className="text-center py-20 text-brand-500">محصولی در این دسته یافت نشد</div>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
