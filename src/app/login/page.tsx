import { redirect } from 'next/navigation'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { AuthForm } from '@/components/auth/AuthForm'
import { getSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'

export const metadata = { title: 'ورود' }

export default async function LoginPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()])
  if (user) redirect('/account')

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-2">ورود به حساب</h1>
            <p className="text-brand-500 text-sm">برای پیگیری سفارش‌ها وارد شوید</p>
          </div>
          <AuthForm mode="login" />
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
