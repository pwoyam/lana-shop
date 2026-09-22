import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })
  try {
    const body = await req.json()
    const slug = body.slug || `cat-${Date.now()}`
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
      },
    })
    return NextResponse.json({ category })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
