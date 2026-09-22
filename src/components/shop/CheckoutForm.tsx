'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { formatPrice, toEnglishDigits } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type Props = {
  defaultUser?: { name: string | null; email: string; phone: string | null } | null
}

export function CheckoutForm({ defaultUser }: Props) {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const clearCart = useCart((s) => s.clearCart)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: defaultUser?.name || '',
    phone: defaultUser?.phone || '',
    email: defaultUser?.email || '',
    province: 'تهران',
    city: '',
    address: '',
    postalCode: '',
    note: '',
    couponCode: '',
  })

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="text-center py-20 text-brand-400">در حال بارگذاری...</div>

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-500 mb-4">سبد خرید شما خالی است</p>
        <Button onClick={() => router.push('/shop')}>رفتن به فروشگاه</Button>
      </div>
    )
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = 0 // بعد از ثبت، سرور محاسبه می‌کند
  const finalTotal = total

  const update = (k: string, v: string) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          customer: {
            name: form.name,
            phone: toEnglishDigits(form.phone),
            email: form.email || null,
            city: form.city,
            address: form.address,
            postalCode: toEnglishDigits(form.postalCode),
            note: form.note,
          },
          couponCode: form.couponCode || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطا')

      clearCart()
      router.push(`/order/${data.orderId}`)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
      {/* فرم */}
      <div className="lg:col-span-2 space-y-4">
        <div className="p-6 border border-brand-100 rounded-xl bg-white space-y-4">
          <h2 className="font-bold text-brand-900 mb-2">اطلاعات گیرنده</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brand-700 mb-1 block">نام و نام خانوادگی *</label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-brand-700 mb-1 block">شماره موبایل *</label>
              <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} required placeholder="09xxxxxxxxx" />
            </div>
          </div>

          <div>
            <label className="text-sm text-brand-700 mb-1 block">ایمیل (اختیاری)</label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
        </div>

        <div className="p-6 border border-brand-100 rounded-xl bg-white space-y-4">
          <h2 className="font-bold text-brand-900 mb-2">آدرس تحویل</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brand-700 mb-1 block">استان *</label>
              <Input value={form.province} onChange={(e) => update('province', e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-brand-700 mb-1 block">شهر *</label>
              <Input value={form.city} onChange={(e) => update('city', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm text-brand-700 mb-1 block">آدرس کامل *</label>
            <textarea
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-sm text-brand-700 mb-1 block">کد پستی *</label>
            <Input value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} required placeholder="۱۰ رقم" />
          </div>

          <div>
            <label className="text-sm text-brand-700 mb-1 block">توضیحات (اختیاری)</label>
            <textarea
              value={form.note}
              onChange={(e) => update('note', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* خلاصه سفارش */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 p-6 border border-brand-100 rounded-xl bg-brand-50/50 space-y-4">
          <h3 className="font-bold text-brand-900">خلاصه سفارش</h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pb-4 border-b border-brand-100">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <div className="w-12 h-12 rounded overflow-hidden bg-brand-100 shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-brand-900 line-clamp-1">{item.name}</div>
                  <div className="text-brand-500 mt-0.5">
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="کد تخفیف"
              value={form.couponCode}
              onChange={(e) => update('couponCode', e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between">
              <span className="text-brand-600">جمع محصولات</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-600">هزینه ارسال</span>
              <span className="text-xs text-brand-500">در مرحله بعد محاسبه می‌شود</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-brand-100">
            <span className="font-bold text-brand-900">مبلغ نهایی</span>
            <span className="font-bold text-lg text-brand-800">{formatPrice(finalTotal)}</span>
          </div>

          <Button size="lg" className="w-full" disabled={loading}>
            {loading ? 'در حال ثبت...' : 'ثبت سفارش (پرداخت نمایشی)'}
          </Button>

          <p className="text-xs text-brand-500 text-center">
            این پرداخت نمایشی است و پول واقعی دریافت نمی‌شود
          </p>
        </div>
      </div>
    </form>
  )
}
