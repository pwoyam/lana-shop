import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { parseArray } from '@/lib/parse'

export const metadata = { title: 'محصولات' }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">محصولات</h1>
          <p className="text-brand-500 text-sm mt-1">{products.length.toLocaleString('fa-IR')} محصول</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          محصول جدید
        </Link>
      </div>

      <div className="rounded-xl border border-brand-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-700 text-xs">
              <tr>
                <th className="text-right p-3 font-medium">تصویر</th>
                <th className="text-right p-3 font-medium">نام</th>
                <th className="text-right p-3 font-medium">دسته</th>
                <th className="text-right p-3 font-medium">قیمت</th>
                <th className="text-right p-3 font-medium">موجودی</th>
                <th className="text-right p-3 font-medium">وضعیت</th>
                <th className="text-right p-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const images = parseArray(p.images)
                return (
                  <tr key={p.id} className="border-t border-brand-100 hover:bg-brand-50/50">
                    <td className="p-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-brand-50">
                        {images[0] && <img src={images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-brand-900 line-clamp-1 max-w-xs">{p.name}</td>
                    <td className="p-3 text-brand-500 text-xs">{p.category?.name || '-'}</td>
                    <td className="p-3 font-medium">{formatPrice(Number(p.price))}</td>
                    <td className="p-3">
                      <Badge variant={p.stock === 0 ? 'danger' : p.stock < 10 ? 'warning' : 'success'}>
                        {p.stock.toLocaleString('fa-IR')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={p.isActive ? 'success' : 'default'}>
                        {p.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 hover:bg-brand-100 rounded-lg text-brand-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
