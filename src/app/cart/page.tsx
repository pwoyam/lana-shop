import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { CartView } from '@/components/shop/CartView'
import { getSettings } from '@/lib/settings'

export const metadata = { title: 'سبد خرید' }

export default async function CartPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-8">سبد خرید</h1>
          <CartView
            shippingCost={Number(settings.shipping_cost)}
            freeShippingThreshold={Number(settings.free_shipping_threshold)}
          />
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
