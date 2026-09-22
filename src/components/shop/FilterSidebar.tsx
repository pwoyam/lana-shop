'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  categories: { id: string; name: string; slug: string }[]
  availableSizes: string[]
  availableColors: string[]
  minPrice: number
  maxPrice: number
}

export function FilterSidebar({ categories, availableSizes, availableColors, minPrice, maxPrice }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  // خواندن مقادیر فعلی از URL
  const currentCategory = searchParams.get('category') || ''
  const currentSizes = searchParams.getAll('size')
  const currentColors = searchParams.getAll('color')
  const currentMin = searchParams.get('minPrice') || ''
  const currentMax = searchParams.get('maxPrice') || ''
  const inStock = searchParams.get('inStock') === '1'

  const updateParams = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key)
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (value !== null && value !== '') {
        params.set(key, value)
      }
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleArrayValue = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateParams({ [key]: next })
  }

  const clearAll = () => {
    router.push(pathname)
  }

  const hasFilters =
    currentCategory || currentSizes.length || currentColors.length || currentMin || currentMax || inStock

  const content = (
    <div className="space-y-6">
      {/* دسته‌بندی */}
      <div>
        <h3 className="font-semibold text-brand-900 text-sm mb-3">دسته‌بندی</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn(
              'w-full text-right px-3 py-2 rounded-lg text-sm transition',
              !currentCategory ? 'bg-brand-700 text-white font-medium' : 'text-brand-700 hover:bg-brand-50'
            )}
          >
            همه
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParams({ category: c.slug })}
              className={cn(
                'w-full text-right px-3 py-2 rounded-lg text-sm transition',
                currentCategory === c.slug ? 'bg-brand-700 text-white font-medium' : 'text-brand-700 hover:bg-brand-50'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* قیمت */}
      <div>
        <h3 className="font-semibold text-brand-900 text-sm mb-3">محدوده قیمت (تومان)</h3>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="از"
            defaultValue={currentMin}
            onBlur={(e) => updateParams({ minPrice: e.target.value })}
            dir="ltr"
            className="text-xs"
          />
          <span className="text-brand-400">-</span>
          <Input
            type="number"
            placeholder="تا"
            defaultValue={currentMax}
            onBlur={(e) => updateParams({ maxPrice: e.target.value })}
            dir="ltr"
            className="text-xs"
          />
        </div>
      </div>

      {/* سایزها */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-brand-900 text-sm mb-3">سایز</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleArrayValue('size', s, currentSizes)}
                className={cn(
                  'min-w-[2.5rem] h-8 px-2 rounded-lg border text-xs font-medium transition',
                  currentSizes.includes(s)
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-brand-200 text-brand-700 hover:border-brand-400'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* رنگ‌ها */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="font-semibold text-brand-900 text-sm mb-3">رنگ</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <button
                key={c}
                onClick={() => toggleArrayValue('color', c, currentColors)}
                className={cn(
                  'h-8 px-3 rounded-lg border text-xs font-medium transition',
                  currentColors.includes(c)
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-brand-200 text-brand-700 hover:border-brand-400'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* موجودی */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-700">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParams({ inStock: e.target.checked ? '1' : null })}
            className="rounded"
          />
          فقط کالاهای موجود
        </label>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearAll}>
          <X className="h-4 w-4" />
          پاک کردن فیلترها
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* دکمه موبایل */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium"
      >
        <SlidersHorizontal className="h-4 w-4" />
        فیلترها
        {hasFilters && <span className="w-2 h-2 rounded-full bg-brand-600" />}
      </button>

      {/* سایدبار دسکتاپ */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 p-5 rounded-xl border border-brand-100 bg-white">
          {content}
        </div>
      </aside>

      {/* مودال موبایل */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-full bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-900">فیلترها</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-brand-50 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  )
}
