'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Minus, Plus, Truck, ShieldCheck, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { parseArray } from '@/lib/parse'
import { WishlistButton } from './WishlistButton'

type Product = {
  id: string
  name: string
  slug: string
  price: any
  comparePrice: any
  images: string
  sizes: string
  colors: string
  stock: number
  description: string | null
}

type Props = {
  product: Product
  isLoggedIn: boolean
  initialWishlisted: boolean
}

export function ProductDetail({ product, isLoggedIn, initialWishlisted }: Props) {
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)

  const images = parseArray(product.images)
  const sizes = parseArray(product.sizes)
  const colors = parseArray(product.colors)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const discountPercent = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: images[0] || '',
      quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setTimeout(() => router.push('/cart'), 300)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-brand-100 bg-brand-50">
          {images[selectedImage] ? (
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-300">بدون تصویر</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden border-2 transition',
                  selectedImage === i ? 'border-brand-600' : 'border-brand-100 hover:border-brand-300'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {discountPercent > 0 && <Badge variant="danger">٪{discountPercent.toLocaleString('fa-IR')} تخفیف</Badge>}
        <h1 className="text-2xl md:text-3xl font-bold text-brand-900">{product.name}</h1>

        <div className="flex items-end gap-3 pb-4 border-b border-brand-100">
          <div className="flex flex-col">
            {comparePrice && <span className="text-sm text-brand-400 line-through">{formatPrice(comparePrice)}</span>}
            <span className="text-3xl font-bold text-brand-800">{formatPrice(price)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {product.stock > 0 ? <Badge variant="success">موجود در انبار</Badge> : <Badge variant="danger">ناموجود</Badge>}
        </div>

        {product.description && <p className="text-brand-600 text-sm leading-7">{product.description}</p>}

        {sizes.length > 0 && (
          <div>
            <label className="text-sm font-medium text-brand-900 mb-2 block">سایز:</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={cn(
                    'min-w-[3rem] h-10 px-3 rounded-lg border text-sm font-medium transition',
                    selectedSize === s ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 text-brand-700 hover:border-brand-400'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <label className="text-sm font-medium text-brand-900 mb-2 block">رنگ:</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    'h-10 px-4 rounded-lg border text-sm font-medium transition',
                    selectedColor === c ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 text-brand-700 hover:border-brand-400'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 items-center pt-2">
          <div className="flex items-center border border-brand-200 rounded-lg">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-brand-50 rounded-r-lg">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity.toLocaleString('fa-IR')}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-brand-50 rounded-l-lg">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button size="lg" disabled={product.stock === 0} className="flex-1" onClick={handleAddToCart}>
            {added ? <><Check className="h-5 w-5" /> اضافه شد!</> : <><ShoppingBag className="h-5 w-5" /> افزودن به سبد</>}
          </Button>
        </div>

        <WishlistButton
          productId={product.id}
          isLoggedIn={isLoggedIn}
          initialWishlisted={initialWishlisted}
          variant="full"
        />

        {product.stock > 0 && (
          <Button variant="secondary" size="lg" className="w-full" onClick={handleBuyNow}>
            خرید سریع (رفتن به سبد)
          </Button>
        )}

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-100">
          <div className="text-center"><Truck className="h-5 w-5 text-brand-600 mx-auto mb-1" /><div className="text-xs text-brand-600">ارسال سریع</div></div>
          <div className="text-center"><ShieldCheck className="h-5 w-5 text-brand-600 mx-auto mb-1" /><div className="text-xs text-brand-600">ضمانت اصالت</div></div>
          <div className="text-center"><RefreshCw className="h-5 w-5 text-brand-600 mx-auto mb-1" /><div className="text-xs text-brand-600">۷ روز بازگشت</div></div>
        </div>
      </div>
    </div>
  )
}
