'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  _count?: { products: number }
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' })

  const reset = () => {
    setForm({ name: '', description: '', imageUrl: '' })
    setEditing(null)
    setCreating(false)
  }

  const handleCreate = async () => {
    if (!form.name) return toast.error('نام الزامی است')
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('دسته ساخته شد')
      reset()
      router.refresh()
    } else {
      toast.error('خطا')
    }
  }

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('ذخیره شد')
      reset()
      router.refresh()
    } else {
      toast.error('خطا')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('مطمئنی؟ محصولات این دسته بدون دسته می‌شن.')) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('حذف شد')
      router.refresh()
    } else {
      toast.error('خطا')
    }
  }

  const startEdit = (cat: Category) => {
    setEditing(cat.id)
    setCreating(false)
    setForm({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
    })
  }

  return (
    <div className="space-y-6">
      {/* فرم ساخت */}
      {creating && (
        <div className="p-4 rounded-xl border-2 border-brand-300 bg-brand-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-900 text-sm">دسته جدید</span>
            <button onClick={reset} className="p-1 hover:bg-brand-100 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Input placeholder="نام دسته" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="URL تصویر" dir="ltr" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Button onClick={handleCreate} size="sm">
            <Check className="h-4 w-4" /> ذخیره
          </Button>
        </div>
      )}

      {/* لیست */}
      <div className="rounded-xl border border-brand-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-brand-700 text-xs">
            <tr>
              <th className="text-right p-3 font-medium">نام</th>
              <th className="text-right p-3 font-medium">Slug</th>
              <th className="text-right p-3 font-medium">تعداد محصولات</th>
              <th className="text-right p-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-brand-100">
                {editing === c.id ? (
                  <td colSpan={4} className="p-3">
                    <div className="space-y-2">
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                      <Input value={form.imageUrl} dir="ltr" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(c.id)}><Check className="h-4 w-4" /> ذخیره</Button>
                        <Button size="sm" variant="ghost" onClick={reset}><X className="h-4 w-4" /> لغو</Button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-3 font-medium text-brand-900">{c.name}</td>
                    <td className="p-3 text-xs text-brand-500" dir="ltr">{c.slug}</td>
                    <td className="p-3 text-brand-600">{c._count?.products.toLocaleString('fa-IR') || '۰'}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(c)} className="p-2 hover:bg-brand-100 rounded-lg text-brand-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!creating && (
        <Button onClick={() => { setCreating(true); setEditing(null); setForm({ name: '', description: '', imageUrl: '' }) }}>
          <Plus className="h-4 w-4" /> دسته‌بندی جدید
        </Button>
      )}
    </div>
  )
}
