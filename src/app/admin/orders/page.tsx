import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'
import { toPersianNumber } from '@/lib/utils'

export const metadata = { title: 'سفارش‌ها' }

const statusBadge: Record<string, { label: string; variant: any }> = {
  PENDING: { label: 'در انتظار', variant: 'warning' },
  PAID: { label: 'پرداخت شده', variant: 'success' },
  SHIPPED: { label: 'ارسال شده', variant: 'default' },
  DELIVERED: { label: 'تحویل شده', variant: 'success' },
  CANCELLED: { label: 'لغو شده', variant: 'danger' },
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">سفارش‌ها</h1>
        <p className="text-brand-500 text-sm mt-1">{orders.length.toLocaleString('fa-IR')} سفارش</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center border border-brand-100 rounded-xl bg-white text-brand-400">
          هنوز سفارشی ثبت نشده
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total = Number(order.totalAmount) + Number(order.shippingAmount) - Number(order.discountAmount)
            return (
              <div key={order.id} className="p-5 rounded-xl border border-brand-100 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-brand-800">{order.orderNumber}</span>
                      <Badge variant={statusBadge[order.status].variant}>{statusBadge[order.status].label}</Badge>
                    </div>
                    <div className="text-xs text-brand-500">
                      {new Date(order.createdAt).toLocaleString('fa-IR')}
                    </div>
                  </div>
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-brand-500">مشتری</div>
                    <div className="font-medium text-brand-900">{order.customerName}</div>
                    <div className="text-xs text-brand-600" dir="ltr">{order.customerPhone}</div>
                    <div className="text-xs text-brand-500">{order.shippingCity}، {order.shippingAddress}</div>
                  </div>
                  <div className="space-y-1 md:text-left">
                    <div className="text-xs text-brand-500">مبلغ کل</div>
                    <div className="text-xl font-bold text-brand-800">{formatPrice(total)}</div>
                    <div className="text-xs text-brand-500">{order.items.length.toLocaleString('fa-IR')} قلم کالا</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-brand-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-brand-50 text-xs">
                      <div className="w-8 h-8 rounded overflow-hidden bg-white shrink-0">
                        {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-brand-700 line-clamp-1">{item.productName}</span>
                      <span className="text-brand-500">×{item.quantity.toLocaleString('fa-IR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
