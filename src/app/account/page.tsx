import { redirect } from 'next/navigation'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { getSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'حساب کاربری' }

export default async function AccountPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()])

  console.log('🔍 /account - user:', user ? user.email : 'NULL')

  if (!user) redirect('/login')

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlist.count({ where: { userId: user.id } }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <AccountSidebar />
            <div className="flex-1 space-y-6">
              <div className="p-6 border border-brand-100 rounded-xl bg-white">
                <h1 className="text-2xl font-bold text-brand-900 mb-1">سلام {user.name || 'کاربر'} 👋</h1>
                <p className="text-brand-500 text-sm" dir="ltr">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-brand-100 rounded-xl bg-brand-50">
                  <div className="text-3xl font-bold text-brand-800">{orderCount.toLocaleString('fa-IR')}</div>
                  <div className="text-sm text-brand-600 mt-1">سفارش</div>
                </div>
                <div className="p-6 border border-brand-100 rounded-xl bg-brand-50">
                  <div className="text-3xl font-bold text-brand-800">{wishlistCount.toLocaleString('fa-IR')}</div>
                  <div className="text-sm text-brand-600 mt-1">علاقه‌مندی</div>
                </div>
              </div>

              {user.role === 'ADMIN' && (
                <div className="p-6 border border-brand-200 rounded-xl bg-brand-100">
                  <h2 className="font-bold text-brand-900 mb-2">دسترسی ادمین</h2>
                  <p className="text-sm text-brand-600 mb-3">شما به پنل مدیریت دسترسی دارید</p>
                  <a href="/admin" className="inline-flex items-center h-10 px-4 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800">
                    ورود به پنل ادمین
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
