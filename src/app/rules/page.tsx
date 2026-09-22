import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { getSettings } from '@/lib/settings'

export const metadata = { title: 'قوانین و مقررات' }

export default async function RulesPage() {
  const settings = await getSettings()
  const title = settings['rules_title'] || 'قوانین و مقررات'
  const content = settings['rules_content'] || 'محتوای این صفحه هنوز تنظیم نشده است.'

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-8">{title}</h1>
          <div className="prose prose-brand max-w-none text-brand-700 leading-8 whitespace-pre-line">
            {content}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
