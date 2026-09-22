import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { getSettings } from '@/lib/settings'

export const metadata = { title: 'تماس با ما' }

export default async function ContactPage() {
  const settings = await getSettings()
  const title = settings['contact_title'] || 'تماس با ما'
  const content = settings['contact_content'] || ''

  const items = [
    { icon: Phone, label: 'تلفن', value: settings['contact_phone'] || settings.site_phone, ltr: true },
    { icon: Mail, label: 'ایمیل', value: settings['contact_email'] || settings.site_email, ltr: true },
    { icon: MapPin, label: 'آدرس', value: settings['contact_address'] || settings.site_address },
    { icon: Clock, label: 'ساعات کاری', value: settings['contact_hours'] || '' },
  ].filter((i) => i.value)

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-3">{title}</h1>
          {content && (
            <p className="text-brand-600 leading-8 mb-8 whitespace-pre-line">{content}</p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-brand-100 bg-white flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-50">
                  <item.icon className="h-5 w-5 text-brand-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-brand-500 mb-1">{item.label}</div>
                  <div className="text-sm font-medium text-brand-900 break-words" dir={item.ltr ? 'ltr' : 'rtl'}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
