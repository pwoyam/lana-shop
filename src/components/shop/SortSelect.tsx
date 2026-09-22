'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') || 'newest'

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'newest') params.delete('sort')
    else params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 rounded-lg border border-brand-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <option value="newest">جدیدترین</option>
      <option value="cheapest">ارزان‌ترین</option>
      <option value="most-expensive">گران‌ترین</option>
      <option value="featured">محصولات ویژه</option>
    </select>
  )
}
