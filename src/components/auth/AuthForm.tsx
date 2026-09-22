'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { toEnglishDigits } from '@/lib/utils'

type Mode = 'login' | 'register'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })

  const update = (k: string, v: string) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: toEnglishDigits(form.phone), password: form.password }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطا در ورود')

      toast.success(mode === 'login' ? 'خوش آمدید!' : 'ثبت‌نام با موفقیت انجام شد!')

      // استفاده از full reload تا cookie حتماً اعمال شود
      window.location.href = '/account'
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label className="text-sm text-brand-700 mb-1 block">نام و نام خانوادگی</label>
          <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
      )}

      <div>
        <label className="text-sm text-brand-700 mb-1 block">ایمیل</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
          dir="ltr"
          autoComplete="email"
        />
      </div>

      {mode === 'register' && (
        <div>
          <label className="text-sm text-brand-700 mb-1 block">شماره موبایل</label>
          <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="09xxxxxxxxx" dir="ltr" />
        </div>
      )}

      <div>
        <label className="text-sm text-brand-700 mb-1 block">رمز عبور</label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
          minLength={6}
          dir="ltr"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'در حال پردازش...' : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}
      </Button>

      <p className="text-center text-sm text-brand-500 pt-2">
        {mode === 'login' ? (
          <>حساب کاربری ندارید؟ <Link href="/register" className="text-brand-700 font-medium hover:underline">ثبت‌نام کنید</Link></>
        ) : (
          <>قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login" className="text-brand-700 font-medium hover:underline">وارد شوید</Link></>
        )}
      </p>

      {mode === 'login' && (
        <div className="mt-6 p-4 bg-brand-50 rounded-lg border border-brand-100 text-xs text-brand-600 space-y-1">
          <p className="font-bold text-brand-900 mb-2">🔑 حساب‌های تستی:</p>
          <p>ادمین: <span dir="ltr" className="font-mono">admin@lana.ir / admin123</span></p>
          <p>مشتری: <span dir="ltr" className="font-mono">customer@lana.ir / customer123</span></p>
        </div>
      )}
    </form>
  )
}
