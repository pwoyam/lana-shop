'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Package, Heart, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const items = [
  { href: '/account', label: 'پروفایل', icon: User },
  { href: '/account/orders', label: 'سفارش‌های من', icon: Package },
  { href: '/account/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('خارج شدید')
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="lg:w-64 shrink-0">
      <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition whitespace-nowrap',
                active ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition whitespace-nowrap"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </nav>
    </aside>
  )
}
