import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'
import { parseArray } from '@/lib/parse'

type Params = { params: Promise<{ id: string }> }

export const metadata = { title: 'ویرایش محصول' }

export default async function EditProductPage({ params }: Params) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  const data = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    stock: product.stock,
    images: parseArray(product.images),
    sizes: parseArray(product.sizes),
    colors: parseArray(product.colors),
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    categoryId: product.categoryId,
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 mb-2">
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
        <h1 className="text-2xl font-bold text-brand-900">ویرایش محصول</h1>
      </div>

      <ProductForm product={data} categories={categories} />
    </div>
  )
}
