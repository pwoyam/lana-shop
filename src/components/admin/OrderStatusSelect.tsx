'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const statuses = [
  { value: 'PENDING', label: 'در انتظار پرداخت' },
  { value: 'PAID', label: 'پرداخت شده' },
  { value: 'SHIPPED', label: 'ارسال شده' },
  { value: 'DELIVERED', label: 'تحویل داده شده' },
  { value: 'CANCELLED', label: 'لغو شده' },
]

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(current)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setStatus(newStatus)
      toast.success('وضعیت به‌روز شد')
      router.refresh()
    } else {
      toast.error('خطا')
    }
    setLoading(false)
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="h-9 rounded-lg border border-brand-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
