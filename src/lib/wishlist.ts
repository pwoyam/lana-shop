import { cache } from 'react'
import { prisma } from './prisma'

/**
 * همه productIdهای wishlist کاربر رو برمی‌گردونه (یک query)
 */
export const getUserWishlistIds = cache(async (userId: string): Promise<Set<string>> => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    })
    return new Set(items.map((i) => i.productId))
  } catch {
    return new Set()
  }
})
