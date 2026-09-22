import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'
import { getSettings } from '@/lib/settings'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { getCurrentUser } from '@/lib/auth'
import { getUserWishlistIds } from '@/lib/wishlist'
import { generateSeo } from '@/lib/seo'
import { parseArray } from '@/lib/parse'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return generateSeo({ title: 'محصول یافت نشد' })

  const images = parseArray(product.images)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return generateSeo({
    title: product.name,
    description: product.description || undefined,
    image: images[0] || undefined,
    url: `${baseUrl}/product/${product.slug}`,
    type: 'product',
  })
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const [settings, product, user] = await Promise.all([
    getSettings(),
    getProductBySlug(slug),
    getCurrentUser(),
  ])

  if (!product) notFound()

  const wishlistIds = user ? await getUserWishlistIds(user.id) : new Set<string>()
  const initialWishlisted = wishlistIds.has(product.id)

  const related = await getRelatedProducts(product.categoryId, product.id, 4)
  const images = parseArray(product.images)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    sku: product.id,
    brand: { '@type': 'Brand', name: settings.site_name },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: 'IRR',
      price: Number(product.price),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-xs text-brand-500 mb-6">
            <Link href="/" className="hover:text-brand-700">خانه</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-brand-700">فروشگاه</Link>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-700">
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-brand-700">{product.name}</span>
          </nav>

          <ProductDetail
            product={product}
            isLoggedIn={!!user}
            initialWishlisted={initialWishlisted}
          />

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-bold text-brand-900 mb-6">محصولات مشابه</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isLoggedIn={!!user}
                    isWishlisted={wishlistIds.has(p.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
