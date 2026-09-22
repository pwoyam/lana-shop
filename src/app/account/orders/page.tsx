import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Badge } from '@/components/ui/badge'
import { getSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'سفارش‌های من' }

const statusLabels: Record<string, { label: string; variant: any }> = {
  PENDING: { label: 'در انتظار پرداخت', variant: 'warning' },
  PAID: { label: 'پرداخت شده', variant: 'success' },
  SHIPPED: { label: 'ارسال شده', variant: 'default' },
  DELIVERED: { label: 'تحویل داده شده', variant: 'success' },
  CANCELLED: { label: 'لغو شده', variant: 'danger' },
}

export default async function OrdersPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()])
  if (!user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <AccountSidebar />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-900 mb-6">سفارش‌های من</h1>

              {orders.length === 0 ? (
                <div className="text-center py-16 border border-brand-100 rounded-xl bg-brand-50">
                  <p className="text-brand-500 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
                  <Link href="/shop" className="inline-flex items-center h-10 px-4 rounded-lg bg-brand-700 text-white text-sm font-medium">
                    رفتن به فروشگاه
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const st = statusLabels[order.status] || statusLabels.PENDING
                    return (
                      <Link
                        key={order.id}
                        href={`/order/${order.id}`}
                        className="block p-5 border border-brand-100 rounded-xl bg-white hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-brand-600">{order.orderNumber}</span>
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </div>
                          <span className="text-xs text-brand-400">
                            {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {order.items.slice(0, 3).map((item) => (
                              <div key={item.id} className="w-12 h-12 rounded overflow-hidden bg-brand-50">
                                {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-brand-800">
                            {formatPrice(Number(order.totalAmount) + Number(order.shippingAmount) - Number(order.discountAmount))}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
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
