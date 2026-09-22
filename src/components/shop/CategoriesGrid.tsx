import Link from 'next/link'

type Category = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900">دسته‌بندی‌ها</h2>
          <p className="text-brand-500 text-sm mt-1">دسته مورد نظر خود را انتخاب کنید</p>
        </div>
        <Link href="/shop" className="text-sm text-brand-600 hover:text-brand-900 font-medium">
          مشاهده همه →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative aspect-square rounded-xl overflow-hidden border border-brand-100"
          >
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-brand-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-4">
              <span className="text-white font-semibold">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
