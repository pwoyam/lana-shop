import { CategoryManager } from '@/components/admin/CategoryManager'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'دسته‌بندی‌ها' }

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">دسته‌بندی‌ها</h1>
        <p className="text-brand-500 text-sm mt-1">{categories.length.toLocaleString('fa-IR')} دسته‌بندی</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  )
}
