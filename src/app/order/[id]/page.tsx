import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { Button } from '@/components/ui/button'
import { getSettings } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { formatPrice, toPersianNumber } from '@/lib/utils'

type Params = { params: Promise<{ id: string }> }

export const metadata = { title: 'سفارش ثبت شد' }

export default async function OrderPage({ params }: Params) {
  const { id } = await params
  const [settings, order] = await Promise.all([
    getSettings(),
    prisma.order.findUnique({ where: { id }, include: { items: true } }),
  ])

  if (!order) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-brand-900 mb-2">سفارش شما ثبت شد!</h1>
            <p className="text-brand-500">شماره سفارش: <span className="font-mono font-bold text-brand-800">{order.orderNumber}</span></p>
          </div>

          <div className="p-6 border border-brand-100 rounded-xl bg-white mb-6">
            <h2 className="font-bold text-brand-900 mb-4">جزئیات سفارش</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brand-500">گیرنده:</span><span>{order.customerName}</span></div>
              <div className="flex justify-between"><span className="text-brand-500">موبایل:</span><span dir="ltr">{order.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-brand-500">آدرس:</span><span>{order.shippingCity}، {order.shippingAddress}</span></div>
              <div className="flex justify-between"><span className="text-brand-500">وضعیت:</span><span className="text-green-600 font-medium">پرداخت شده</span></div>
            </div>
          </div>

          <div className="p-6 border border-brand-100 rounded-xl bg-white mb-6">
            <h2 className="font-bold text-brand-900 mb-4">محصولات</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded overflow-hidden bg-brand-50 shrink-0">
                    {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.productName}</div>
                    <div className="text-xs text-brand-500">
                      {item.quantity.toLocaleString('fa-IR')} × {formatPrice(Number(item.price))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-500">جمع کل:</span><span>{formatPrice(Number(order.totalAmount))}</span></div>
              <div className="flex justify-between"><span className="text-brand-500">ارسال:</span><span>{Number(order.shippingAmount) === 0 ? 'رایگان' : formatPrice(Number(order.shippingAmount))}</span></div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600"><span>تخفیف:</span><span>-{formatPrice(Number(order.discountAmount))}</span></div>
              )}
              <div className="flex justify-between font-bold text-brand-900 pt-2 border-t border-brand-100">
                <span>مبلغ نهایی:</span>
                <span>{formatPrice(Number(order.totalAmount) + Number(order.shippingAmount) - Number(order.discountAmount))}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/shop"><Button>ادامه خرید</Button></Link>
            <Link href="/"><Button variant="outline">صفحه اصلی</Button></Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
