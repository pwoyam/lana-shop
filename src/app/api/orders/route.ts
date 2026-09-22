import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customer, couponCode } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'سبد خرید خالی است' }, { status: 400 })
    }

    const user = await getCurrentUser()

    // ─── اعتبارسنجی productId ها ───
    const validProductIds = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
      select: { id: true },
    })
    const validIds = new Set(validProductIds.map((p) => p.id))
    const validItems = items.filter((item: any) => validIds.has(item.productId))

    if (validItems.length === 0) {
      return NextResponse.json(
        { error: 'سبد خرید شما حاوی محصولات نامعتبر است. لطفاً سبد را دوباره پر کنید.' },
        { status: 400 }
      )
    }

    // محاسبه مبالغ
    let totalAmount = 0
    for (const item of validItems) {
      totalAmount += item.price * item.quantity
    }

    let discountAmount = 0
    if (couponCode) {
      const discount = await prisma.discount.findUnique({ where: { code: couponCode } })
      if (discount && discount.isActive) {
        if (discount.type === 'PERCENT') {
          discountAmount = (totalAmount * discount.value) / 100
        } else {
          discountAmount = discount.value
        }
        await prisma.discount.update({
          where: { id: discount.id },
          data: { usedCount: { increment: 1 } },
        })
      }
    }

    // هزینه ارسال
    const settings = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.key] = s.value })
    const shippingCost = Number(map.shipping_cost || '50000')
    const freeThreshold = Number(map.free_shipping_threshold || '2000000')
    const shippingAmount = totalAmount >= freeThreshold ? 0 : shippingCost

    const finalTotal = totalAmount - discountAmount + shippingAmount

    const orderNumber = `LN-${Date.now().toString().slice(-8)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id || null,
        status: 'PAID',
        totalAmount,
        shippingAmount,
        discountAmount,
        couponCode: couponCode || null,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email || null,
        shippingAddress: customer.address,
        shippingCity: customer.city,
        shippingPostalCode: customer.postalCode,
        note: customer.note || null,
        items: {
          create: validItems.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
    })

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber })
  } catch (err: any) {
    console.error('Order error:', err)
    return NextResponse.json({ error: err.message || 'خطا در ثبت سفارش' }, { status: 500 })
  }
}
