'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUploader } from './ImageUploader'
import { toast } from 'sonner'

type Category = { id: string; name: string }
type Product = {
  id?: string
  name: string
  description: string
  price: number
  comparePrice: number | null
  stock: number
  images: string[]
  sizes: string[]
  colors: string[]
  isFeatured: boolean
  isActive: boolean
  categoryId: string | null
}

type Props = {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<Product>(product || {
    name: '',
    description: '',
    price: 0,
    comparePrice: null,
    stock: 0,
    images: [],
    sizes: [],
    colors: [],
    isFeatured: false,
    isActive: true,
    categoryId: categories[0]?.id || null,
  })

  const [sizesText, setSizesText] = useState((product?.sizes || []).join(', '))
  const [colorsText, setColorsText] = useState((product?.colors || []).join(', '))

  const update = (k: string, v: any) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        images: form.images,
        sizes: sizesText.split(',').map(s => s.trim()).filter(Boolean),
        colors: colorsText.split(',').map(s => s.trim()).filter(Boolean),
      }

      const url = product?.id ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product?.id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطا')

      toast.success(product?.id ? 'محصول ویرایش شد' : 'محصول ساخته شد')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product?.id) return
    if (!confirm('مطمئنی می‌خوای حذف کنی؟')) return

    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('محصول حذف شد')
      router.push('/admin/products')
      router.refresh()
    } else {
      toast.error('خطا در حذف')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* تصاویر */}
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900">تصاویر محصول</h2>
        <ImageUploader
          images={form.images}
          onChange={(imgs) => update('images', imgs)}
          max={5}
        />
      </div>

      {/* اطلاعات پایه */}
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900 mb-2">اطلاعات پایه</h2>

        <div>
          <label className="text-sm text-brand-700 mb-1 block">نام محصول *</label>
          <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>

        <div>
          <label className="text-sm text-brand-700 mb-1 block">توضیحات</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm text-brand-700 mb-1 block">دسته‌بندی</label>
          <select
            value={form.categoryId || ''}
            onChange={(e) => update('categoryId', e.target.value || null)}
            className="w-full h-10 rounded-lg border border-brand-200 bg-white px-3 text-sm"
          >
            <option value="">بدون دسته</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* قیمت و موجودی */}
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900 mb-2">قیمت و موجودی</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-brand-700 mb-1 block">قیمت (تومان) *</label>
            <Input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-brand-700 mb-1 block">قیمت قبل از تخفیف</label>
            <Input type="number" value={form.comparePrice || ''} onChange={(e) => update('comparePrice', e.target.value || null)} />
          </div>
          <div>
            <label className="text-sm text-brand-700 mb-1 block">موجودی *</label>
            <Input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} required />
          </div>
        </div>
      </div>

      {/* ویژگی‌ها */}
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900 mb-2">ویژگی‌ها</h2>

        <div>
          <label className="text-sm text-brand-700 mb-1 block">سایزها (با کاما جدا کن)</label>
          <Input value={sizesText} onChange={(e) => setSizesText(e.target.value)} placeholder="S, M, L, XL" />
        </div>

        <div>
          <label className="text-sm text-brand-700 mb-1 block">رنگ‌ها (با کاما جدا کن)</label>
          <Input value={colorsText} onChange={(e) => setColorsText(e.target.value)} placeholder="مشکی, قهوه‌ای, کرم" />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-brand-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
            فعال
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
            محصول ویژه
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'در حال ذخیره...' : (product?.id ? 'ذخیره تغییرات' : 'ساخت محصول')}
        </Button>
        {product?.id && (
          <Button type="button" variant="destructive" size="lg" onClick={handleDelete}>
            حذف محصول
          </Button>
        )}
      </div>
    </form>
  )
}
