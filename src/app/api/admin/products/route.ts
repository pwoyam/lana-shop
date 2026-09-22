import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })
  const products = await prisma.product.findMany({ include: { category: true } })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })

  try {
    const body = await req.json()
    const slug = body.slug || `product-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        price: Number(body.price),
        comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
        stock: Number(body.stock || 0),
        images: JSON.stringify(body.images || []),
        sizes: JSON.stringify(body.sizes || []),
        colors: JSON.stringify(body.colors || []),
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
        categoryId: body.categoryId || null,
      },
    })
    return NextResponse.json({ product })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
