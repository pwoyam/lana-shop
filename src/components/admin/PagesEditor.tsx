'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Props = { initial: Record<string, string> }

const pages = [
  {
    id: 'about',
    title: 'درباره ما',
    fields: [
      { key: 'about_title', label: 'عنوان صفحه' },
      { key: 'about_content', label: 'متن اصلی', textarea: true },
    ],
  },
  {
    id: 'contact',
    title: 'تماس با ما',
    fields: [
      { key: 'contact_title', label: 'عنوان صفحه' },
      { key: 'contact_content', label: 'متن صفحه', textarea: true },
      { key: 'contact_phone', label: 'تلفن تماس', ltr: true },
      { key: 'contact_email', label: 'ایمیل', ltr: true },
      { key: 'contact_address', label: 'آدرس' },
      { key: 'contact_hours', label: 'ساعات کاری' },
    ],
  },
  {
    id: 'rules',
    title: 'قوانین و مقررات',
    fields: [
      { key: 'rules_title', label: 'عنوان صفحه' },
      { key: 'rules_content', label: 'متن قوانین', textarea: true, rows: 12 },
    ],
  },
]

export function PagesEditor({ initial }: Props) {
  const [activeTab, setActiveTab] = useState('about')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Record<string, string>>(initial)

  const update = (k: string, v: string) => setForm({ ...form, [k]: v })

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('خطا')
      toast.success('ذخیره شد ✅')
      setTimeout(() => window.location.reload(), 400)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const current = pages.find((p) => p.id === activeTab)!

  return (
    <div className="space-y-6 max-w-3xl">
      {/* تب‌ها */}
      <div className="flex gap-2 border-b border-brand-100 pb-2">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === p.id
                ? 'bg-brand-700 text-white'
                : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* فرم */}
      <div className="p-6 rounded-xl border border-brand-100 bg-white space-y-4">
        <h2 className="font-bold text-brand-900">{current.title}</h2>

        {current.fields.map((f: any) => (
          <div key={f.key}>
            <label className="text-sm text-brand-700 mb-1 block">{f.label}</label>
            {f.textarea ? (
              <textarea
                value={form[f.key] || ''}
                onChange={(e) => update(f.key, e.target.value)}
                rows={f.rows || 6}
                className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            ) : (
              <Input
                value={form[f.key] || ''}
                onChange={(e) => update(f.key, e.target.value)}
                dir={f.ltr ? 'ltr' : 'rtl'}
              />
            )}
          </div>
        ))}

        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </div>
  )
}
