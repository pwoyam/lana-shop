import { prisma } from './prisma'
import { parseArray } from './parse'

export async function getAllProducts(limit?: number) {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getFeaturedProducts(limit: number = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: { isActive: true, category: { slug } },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit: number = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: excludeId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    take: limit,
  })
}

// ─── جستجو و فیلتر پیشرفته ───
export type FilterOptions = {
  q?: string
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  sort?: 'newest' | 'cheapest' | 'most-expensive' | 'featured'
}

export async function searchProducts(opts: FilterOptions) {
  const where: any = { isActive: true }

  if (opts.q) {
    where.OR = [
      { name: { contains: opts.q } },
      { description: { contains: opts.q } },
    ]
  }

  if (opts.categorySlug) {
    where.category = { slug: opts.categorySlug }
  }

  if (opts.inStock) {
    where.stock = { gt: 0 }
  }

  let orderBy: any = { createdAt: 'desc' }
  if (opts.sort === 'cheapest') orderBy = { price: 'asc' }
  else if (opts.sort === 'most-expensive') orderBy = { price: 'desc' }
  else if (opts.sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]

  let products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  })

  // فیلتر سایز و رنگ و قیمت (چون SQLite آرایه نداره، توی JS فیلتر می‌کنیم)
  if (opts.minPrice !== undefined) {
    products = products.filter((p) => Number(p.price) >= opts.minPrice!)
  }
  if (opts.maxPrice !== undefined) {
    products = products.filter((p) => Number(p.price) <= opts.maxPrice!)
  }
  if (opts.sizes?.length) {
    products = products.filter((p) => {
      const s = parseArray(p.sizes)
      return opts.sizes!.some((size) => s.includes(size))
    })
  }
  if (opts.colors?.length) {
    products = products.filter((p) => {
      const c = parseArray(p.colors)
      return opts.colors!.some((color) => c.includes(color))
    })
  }

  return products
}

// ─── استخراج همه سایزها و رنگ‌های موجود ───
export async function getAvailableFilters() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { sizes: true, colors: true, price: true },
  })

  const sizeSet = new Set<string>()
  const colorSet = new Set<string>()
  let minPrice = Infinity
  let maxPrice = 0

  for (const p of products) {
    parseArray(p.sizes).forEach((s) => sizeSet.add(s))
    parseArray(p.colors).forEach((c) => colorSet.add(c))
    const price = Number(p.price)
    if (price < minPrice) minPrice = price
    if (price > maxPrice) maxPrice = price
  }

  return {
    sizes: Array.from(sizeSet).sort(),
    colors: Array.from(colorSet),
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice,
  }
}
