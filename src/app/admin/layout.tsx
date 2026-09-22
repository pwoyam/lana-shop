import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Providers } from '../providers'

export const metadata = { title: 'پنل مدیریت' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'ADMIN') redirect('/')

  return (
    <Providers>
      <div className="min-h-screen flex flex-col lg:flex-row bg-brand-50/30">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </Providers>
  )
}
