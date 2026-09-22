import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { CheckoutForm } from '@/components/shop/CheckoutForm'
import { getSettings } from '@/lib/settings'
import { getCurrentUser } from '@/lib/auth'

export const metadata = { title: 'تسویه حساب' }

export default async function CheckoutPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-8">تسویه حساب</h1>
          <CheckoutForm defaultUser={user} />
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
