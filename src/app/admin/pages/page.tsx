import { PagesEditor } from '@/components/admin/PagesEditor'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'مدیریت صفحات' }

export default async function AdminPagesPage() {
  const settings = await prisma.setting.findMany()
  const map: Record<string, string> = {}
  settings.forEach((s) => { map[s.key] = s.value })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">مدیریت صفحات</h1>
        <p className="text-brand-500 text-sm mt-1">محتوای صفحات ثابت سایت رو ویرایش کن</p>
      </div>
      <PagesEditor initial={map} />
    </div>
  )
}
