import Link from 'next/link'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    userCount,
    totalRevenue,
    recentOrders,
    lowStock,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'PAID' } }),
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.product.findMany({
      where: { stock: { lt: 10 }, isActive: true },
      orderBy: { stock: 'asc' },
      take: 5,
    }),
  ])

  const stats = [
    { label: 'محصولات', value: productCount, icon: Package, color: 'bg-blue-500' },
    { label: 'سفارش‌ها', value: orderCount, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'کاربران', value: userCount, icon: Users, color: 'bg-purple-500' },
    { label: 'درآمد کل', value: formatPrice(Number(totalRevenue._sum.totalAmount || 0)), icon: DollarSign, color: 'bg-brand-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-2">داشبورد</h1>
        <p className="text-brand-500 text-sm">نمای کلی فروشگاه</p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-5 rounded-xl border border-brand-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${s.color} text-white`}>
                <s.icon className="h-4 w-4" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-brand-900 mb-1">{typeof s.value === 'number' ? s.value.toLocaleString('fa-IR') : s.value}</div>
            <div className="text-xs text-brand-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* سفارش‌های اخیر */}
        <div className="p-6 rounded-xl border border-brand-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-900">سفارش‌های اخیر</h2>
            <Link href="/admin/orders" className="text-xs text-brand-600 hover:text-brand-800">مشاهده همه →</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-brand-400 text-center py-6">هنوز سفارشی ثبت نشده</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <Link key={o.id} href={`/admin/orders`} className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition">
                  <div>
                    <div className="font-mono text-xs text-brand-600">{o.orderNumber}</div>
                    <div className="text-sm font-medium text-brand-900">{o.customerName}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-brand-800">{formatPrice(Number(o.totalAmount))}</div>
                    <div className="text-xs text-brand-400">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* موجودی کم */}
        <div className="p-6 rounded-xl border border-brand-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              موجودی کم
            </h2>
            <Link href="/admin/products" className="text-xs text-brand-600 hover:text-brand-800">مشاهده همه →</Link>
          </div>

          {lowStock.length === 0 ? (
            <p className="text-sm text-brand-400 text-center py-6">موجودی همه محصولات کافیه ✅</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition">
                  <div className="text-sm font-medium text-brand-900 line-clamp-1">{p.name}</div>
                  <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>
                    {p.stock.toLocaleString('fa-IR')} عدد
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
