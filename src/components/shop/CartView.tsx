'use client'

import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

type Props = {
  shippingCost: number
  freeShippingThreshold: number
}

export function CartView({ shippingCost, freeShippingThreshold }: Props) {
  const items = useCart((s) => s.items)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="text-center py-20 text-brand-400">
        در حال بارگذاری سبد خرید...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-16 w-16 text-brand-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-brand-900 mb-2">سبد خرید شما خالی است</h2>
        <p className="text-brand-500 mb-6">هنوز محصولی به سبد اضافه نکرده‌اید</p>
        <Link href="/shop">
          <Button size="lg">
            <ArrowLeft className="h-4 w-4" />
            رفتن به فروشگاه
          </Button>
        </Link>
      </div>
    )
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = total >= freeShippingThreshold ? 0 : shippingCost
  const finalTotal = total + shipping

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* لیست محصولات */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border border-brand-100 rounded-xl bg-white">
            <Link href={`/product/${item.slug}`} className="shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-brand-50">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-300 text-xs">بدون تصویر</div>
                )}
              </div>
            </Link>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/product/${item.slug}`} className="font-medium text-brand-900 hover:text-brand-600 line-clamp-2">
                  {item.name}
                </Link>
                <div className="flex gap-3 mt-1 text-xs text-brand-500">
                  {item.size && <span>سایز: {item.size}</span>}
                  {item.color && <span>رنگ: {item.color}</span>}
                </div>
                <div className="mt-2 font-bold text-brand-800">{formatPrice(item.price)}</div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-brand-200 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-brand-50 rounded-r-lg">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity.toLocaleString('fa-IR')}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-brand-50 rounded-l-lg">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* خلاصه سفارش */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 p-6 border border-brand-100 rounded-xl bg-brand-50/50">
          <h3 className="font-bold text-brand-900 mb-4">خلاصه سفارش</h3>

          <div className="space-y-3 text-sm pb-4 border-b border-brand-100">
            <div className="flex justify-between">
              <span className="text-brand-600">جمع محصولات</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-600">هزینه ارسال</span>
              <span className="font-medium">
                {shipping === 0 ? <span className="text-green-600">رایگان</span> : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brand-500 bg-white p-2 rounded border border-brand-100">
                برای ارسال رایگان، {formatPrice(freeShippingThreshold - total)} دیگر خرید کنید
              </p>
            )}
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="font-bold text-brand-900">مبلغ قابل پرداخت</span>
            <span className="font-bold text-lg text-brand-800">{formatPrice(finalTotal)}</span>
          </div>

          <Link href="/checkout">
            <Button size="lg" className="w-full">
              ادامه و تسویه حساب
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
