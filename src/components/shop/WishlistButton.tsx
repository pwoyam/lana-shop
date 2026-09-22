'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Props = {
  productId: string
  isLoggedIn: boolean
  initialWishlisted?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'full'
}

export function WishlistButton({
  productId,
  isLoggedIn,
  initialWishlisted = false,
  size = 'md',
  variant = 'icon',
}: Props) {
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setWishlisted(initialWishlisted)
  }, [initialWishlisted])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error('برای افزودن به علاقه‌مندی‌ها وارد شوید')
      setTimeout(() => router.push('/login'), 800)
      return
    }

    setLoading(true)
    try {
      if (wishlisted) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
        if (res.ok) {
          setWishlisted(false)
          toast.success('از علاقه‌مندی‌ها حذف شد')
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.ok) {
          setWishlisted(true)
          toast.success('به علاقه‌مندی‌ها اضافه شد')
        }
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          'flex items-center justify-center gap-2 h-12 px-4 rounded-lg border transition',
          wishlisted
            ? 'border-red-300 bg-red-50 text-red-600'
            : 'border-brand-200 text-brand-700 hover:border-brand-400'
        )}
      >
        <Heart className={cn('h-5 w-5', wishlisted && 'fill-red-500 text-red-500')} />
        {wishlisted ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
      </button>
    )
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'rounded-full bg-white/90 backdrop-blur-sm border border-brand-100 hover:bg-white shadow-sm transition',
        sizeClasses[size]
      )}
      aria-label="افزودن به علاقه‌مندی‌ها"
    >
      <Heart
        className={cn(
          iconSizes[size],
          wishlisted ? 'fill-red-500 text-red-500' : 'text-brand-600'
        )}
      />
    </button>
  )
}
