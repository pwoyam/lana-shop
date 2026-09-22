import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react'

const features = [
  { icon: Truck, title: 'ارسال سریع', desc: 'ارسال به سراسر کشور' },
  { icon: ShieldCheck, title: 'ضمانت اصالت', desc: 'تضمین کیفیت محصولات' },
  { icon: RefreshCw, title: 'بازگشت آسان', desc: '۷ روز مهلت بازگشت' },
  { icon: Headphones, title: 'پشتیبانی', desc: 'پاسخگویی همه‌روزه' },
]

export function Features() {
  return (
    <section className="border-y border-brand-100 bg-brand-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white border border-brand-100">
                <f.icon className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <div className="font-semibold text-brand-900 text-sm">{f.title}</div>
                <div className="text-xs text-brand-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
