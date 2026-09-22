'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useEffect, useState } from 'react'

export function CartIcon() {
  const items = useCart((s) => s.items)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link
      href="/cart"
      className="p-2 hover:bg-brand-50 rounded-lg transition-colors relative"
      aria-label="سبد خرید"
    >
      <ShoppingBag className="h-5 w-5 text-brand-700" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1 -left-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center">
          {totalItems.toLocaleString('fa-IR')}
        </span>
      )}
    </Link>
  )
}
