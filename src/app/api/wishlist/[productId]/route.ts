import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

type Params = { params: Promise<{ productId: string }> }

export async function DELETE(_: NextRequest, { params }: Params) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { productId } = await params
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: user.id, productId },
    })
    return NextResponse.json({ ok: true, wishlisted: false })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
