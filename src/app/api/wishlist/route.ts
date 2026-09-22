import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ productIds: [] })

  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    select: { productId: true },
  })
  return NextResponse.json({ productIds: items.map((i) => i.productId) })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'برای این کار باید وارد شوی' }, { status: 401 })

  try {
    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'شناسه محصول لازم است' }, { status: 400 })

    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    })

    return NextResponse.json({ ok: true, wishlisted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
