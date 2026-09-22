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
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
      },
    })
    return NextResponse.json({ category })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })
  const { id } = await params
  try {
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
