import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })

  const { id } = await params
  try {
    const body = await req.json()
    const data: any = {}
    if (body.name !== undefined) data.name = body.name
    if (body.description !== undefined) data.description = body.description
    if (body.price !== undefined) data.price = Number(body.price)
    if (body.comparePrice !== undefined) data.comparePrice = body.comparePrice ? Number(body.comparePrice) : null
    if (body.stock !== undefined) data.stock = Number(body.stock)
    if (body.images !== undefined) data.images = JSON.stringify(body.images)
    if (body.sizes !== undefined) data.sizes = JSON.stringify(body.sizes)
    if (body.colors !== undefined) data.colors = JSON.stringify(body.colors)
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null

    const product = await prisma.product.update({ where: { id }, data })
    return NextResponse.json({ product })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })

  const { id } = await params
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
