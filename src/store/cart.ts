'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  size?: string | null
  color?: string | null
  stock: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const key = `${item.productId}-${item.size || ''}-${item.color || ''}`
        const existing = items.find(
          (i) => `${i.productId}-${i.size || ''}-${i.color || ''}` === key
        )

        if (existing) {
          set({
            items: items.map((i) =>
              `${i.productId}-${i.size || ''}-${i.color || ''}` === key
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
            ],
          })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i
          ),
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'lana-cart' }
  )
)
