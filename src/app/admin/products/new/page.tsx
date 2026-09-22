import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'محصول جدید' }

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 mb-2">
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
        <h1 className="text-2xl font-bold text-brand-900">محصول جدید</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
