import { SettingsForm } from '@/components/admin/SettingsForm'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'تنظیمات سایت' }

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany()
  const map: Record<string, string> = {}
  settings.forEach((s) => { map[s.key] = s.value })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">تنظیمات سایت</h1>
        <p className="text-brand-500 text-sm mt-1">اطلاعات کلی و رنگ‌های برند رو اینجا ویرایش کن</p>
      </div>
      <SettingsForm initial={map} />
    </div>
  )
}
