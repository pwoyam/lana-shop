import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'ایمیل و رمز عبور الزامی است (رمز حداقل ۶ کاراکتر)' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        phone: phone || null,
        passwordHash,
        role: 'CUSTOMER',
      },
    })

    const token = await signToken({ userId: user.id, role: user.role })
    await setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'خطا در ثبت‌نام' }, { status: 500 })
  }
}
