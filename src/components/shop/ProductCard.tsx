import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { parseArray } from '@/lib/parse'
import { WishlistButton } from './WishlistButton'

type Product = {
  id: string
  name: string
  slug: string
  price: any
  comparePrice: any
  images: string
  stock: number
  isFeatured: boolean
}

type Props = {
  product: Product
  isLoggedIn?: boolean
  isWishlisted?: boolean
}

export function ProductCard({ product, isLoggedIn = false, isWishlisted = false }: Props) {
  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const discountPercent = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0
  const images = parseArray(product.images)
  const firstImage = images[0]

  return (
    <div className="group relative rounded-xl overflow-hidden border border-brand-100 bg-white hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-brand-50 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-300 text-sm">بدون تصویر</div>
          )}

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="danger" className="shadow-sm">٪{discountPercent.toLocaleString('fa-IR')} تخفیف</Badge>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ناموجود</span>
            </div>
          )}
        </div>

        <div className="p-4">
          {product.isFeatured && (
            <div className="mb-2">
              <Badge className="bg-brand-700 text-white text-[10px]">ویژه</Badge>
            </div>
          )}
          <h3 className="font-medium text-brand-900 text-sm leading-6 line-clamp-2 min-h-[3rem] group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-col">
              {comparePrice && (
                <span className="text-xs text-brand-400 line-through">{formatPrice(comparePrice)}</span>
              )}
              <span className="font-bold text-brand-800">{formatPrice(price)}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 left-3 z-10">
        <WishlistButton
          productId={product.id}
          isLoggedIn={isLoggedIn}
          initialWishlisted={isWishlisted}
          size="sm"
        />
      </div>
    </div>
  )
}
