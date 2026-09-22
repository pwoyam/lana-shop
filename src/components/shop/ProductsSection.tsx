import Link from 'next/link'
import { ProductCard } from './ProductCard'

type Props = {
  title: string
  subtitle?: string
  viewAllHref?: string
  products: any[]
  isLoggedIn?: boolean
  wishlistIds?: Set<string>
}

export function ProductsSection({
  title,
  subtitle,
  viewAllHref,
  products,
  isLoggedIn,
  wishlistIds,
}: Props) {
  if (!products.length) return null

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900">{title}</h2>
          {subtitle && <p className="text-brand-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-brand-600 hover:text-brand-900 font-medium">
            مشاهده همه →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isLoggedIn={isLoggedIn}
            isWishlisted={wishlistIds?.has(p.id) || false}
          />
        ))}
      </div>
    </section>
  )
}
