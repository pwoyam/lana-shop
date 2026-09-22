'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, FileText, LogOut, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const items = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/pages', label: 'صفحات', icon: FileText },
  { href: '/admin/settings', label: 'تنظیمات سایت', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('خارج شدید')
    window.location.href = '/'
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-brand-800 text-white lg:min-h-screen">
      <div className="p-4 border-b border-brand-700">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold">لَنا ادمین</span>
        </Link>
      </div>

      <nav className="p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap',
                active ? 'bg-brand-600 text-white' : 'text-brand-100 hover:bg-brand-700'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 mt-auto border-t border-brand-700 hidden lg:block">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-100 hover:bg-brand-700">
          <Home className="h-4 w-4" />
          بازگشت به سایت
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-200 hover:bg-red-900/30"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </div>
    </aside>
  )
}
