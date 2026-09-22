'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Props = { initial: Record<string, string> }

const fields: { key: string; label: string; hint?: string; ltr?: boolean }[] = [
  { key: 'site_name', label: 'نام سایت' },
  { key: 'site_tagline', label: 'شعار سایت' },
  { key: 'site_description', label: 'توضیح کوتاه' },
  { key: 'site_phone', label: 'تلفن', ltr: true },
  { key: 'site_email', label: 'ایمیل', ltr: true },
  { key: 'site_address', label: 'آدرس' },
  { key: 'site_instagram', label: 'لینک اینستاگرام', ltr: true },
  { key: 'site_telegram', label: 'لینک تلگرام', ltr: true },
  { key: 'shipping_cost', label: 'هزینه ارسال (تومان)', ltr: true },
  { key: 'free_shipping_threshold', label: 'حد ارسال رایگان (تومان)', ltr: true },
]

const colorPresets = [
  { name: 'قهوه‌ای (پیش‌فرض)', value: '#6B4F3A' },
  { name: 'سبز زیتونی', value: '#4A5D3A' },
  { name: 'آبی نفتی', value: '#2C4A5A' },
  { name: 'زرشکی', value: '#7A2E3B' },
  { name: 'بنفش ملایم', value: '#5A3F6B' },
  { name: 'نارنجی خاکی', value: '#B5651D' },
  { name: 'مشکی', value: '#1F1F1F' },
]

export function SettingsForm({ initial }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Record<string, string>>(initial)

  const update = (k: string, v: string) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('خطا')
      toast.success('تنظیمات ذخیره شد ✅')
      // full reload تا تغییرات رنگ و همه‌چیز اعمال بشه
      setTimeout(() => window.location.href = '/admin/settings', 400)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900 mb-2">اطلاعات سایت</h2>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm text-brand-700 mb-1 block">{f.label}</label>
            <Input
              value={form[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              dir={f.ltr ? 'ltr' : 'rtl'}
            />
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900 mb-2">رنگ اصلی برند</h2>

        {/* پریست‌های آماده */}
        <div>
          <label className="text-sm text-brand-700 mb-2 block">رنگ‌های پیشنهادی:</label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => update('primary_color', p.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${
                  form.primary_color === p.value
                    ? 'border-brand-700 bg-brand-50 font-medium'
                    : 'border-brand-200 hover:border-brand-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-white shadow" style={{ background: p.value }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* انتخابگر رنگ دستی */}
        <div>
          <label className="text-sm text-brand-700 mb-1 block">یا رنگ دلخواه:</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={form.primary_color || '#6B4F3A'}
              onChange={(e) => update('primary_color', e.target.value)}
              className="h-10 w-16 rounded-lg border border-brand-200 cursor-pointer"
            />
            <Input
              value={form.primary_color || ''}
              onChange={(e) => update('primary_color', e.target.value)}
              dir="ltr"
              className="flex-1"
            />
          </div>
        </div>

        {/* پیش‌نمایش */}
        <div className="p-4 rounded-lg border border-brand-100 bg-brand-50">
          <div className="text-xs text-brand-600 mb-2">پیش‌نمایش:</div>
          <div className="flex gap-2">
            {['600','700','800'].map((shade) => (
              <div
                key={shade}
                className="flex-1 h-10 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                style={{ background: form.primary_color || '#6B4F3A', filter: shade === '700' ? 'brightness(0.85)' : shade === '800' ? 'brightness(0.7)' : 'none' }}
              >
                {shade}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </Button>
    </form>
  )
}
