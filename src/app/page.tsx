import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { Hero } from '@/components/shop/Hero'
import { Features } from '@/components/shop/Features'
import { CategoriesGrid } from '@/components/shop/CategoriesGrid'
import { ProductsSection } from '@/components/shop/ProductsSection'
import { getSettings } from '@/lib/settings'
import { getAllCategories, getFeaturedProducts, getAllProducts } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { getUserWishlistIds } from '@/lib/wishlist'

export default async function HomePage() {
  const user = await getCurrentUser()
  const wishlistIds = user ? await getUserWishlistIds(user.id) : new Set<string>()

  const [settings, categories, featured, newest] = await Promise.all([
    getSettings(),
    getAllCategories(),
    getFeaturedProducts(8),
    getAllProducts(8),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <Hero settings={settings} />
        <Features />
        <CategoriesGrid categories={categories} />
        <ProductsSection
          title="محصولات ویژه"
          subtitle="انتخاب‌های خاص برای شما"
          viewAllHref="/shop?sort=featured"
          products={featured}
          isLoggedIn={!!user}
          wishlistIds={wishlistIds}
        />
        <ProductsSection
          title="جدیدترین‌ها"
          subtitle="تازه‌های فروشگاه"
          viewAllHref="/shop"
          products={newest}
          isLoggedIn={!!user}
          wishlistIds={wishlistIds}
        />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
