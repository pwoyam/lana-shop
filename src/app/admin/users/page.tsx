import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'کاربران' }

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">کاربران</h1>
        <p className="text-brand-500 text-sm mt-1">{users.length.toLocaleString('fa-IR')} کاربر</p>
      </div>

      <div className="rounded-xl border border-brand-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-700 text-xs">
              <tr>
                <th className="text-right p-3 font-medium">نام</th>
                <th className="text-right p-3 font-medium">ایمیل</th>
                <th className="text-right p-3 font-medium">موبایل</th>
                <th className="text-right p-3 font-medium">نقش</th>
                <th className="text-right p-3 font-medium">سفارش‌ها</th>
                <th className="text-right p-3 font-medium">تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-brand-100 hover:bg-brand-50/50">
                  <td className="p-3 font-medium text-brand-900">{u.name || '-'}</td>
                  <td className="p-3 text-xs text-brand-600" dir="ltr">{u.email}</td>
                  <td className="p-3 text-xs text-brand-600" dir="ltr">{u.phone || '-'}</td>
                  <td className="p-3">
                    <Badge variant={u.role === 'ADMIN' ? 'warning' : 'default'}>
                      {u.role === 'ADMIN' ? 'مدیر' : 'مشتری'}
                    </Badge>
                  </td>
                  <td className="p-3 text-brand-600">{u._count.orders.toLocaleString('fa-IR')}</td>
                  <td className="p-3 text-xs text-brand-500">
                    {new Date(u.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
