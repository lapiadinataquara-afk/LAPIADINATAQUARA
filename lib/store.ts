import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, Reward } from './types'

interface CartStore {
  items: CartItem[]
  appliedReward: Reward | null
  addItem: (product: Product, quantity?: number, notes?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyReward: (reward: Reward | null) => void
  getTotal: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getItemCount: () => number
  getPointsToEarn: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedReward: null,

      addItem: (product, quantity = 1, notes) => {
        set((state) => {
          const existing = state.items.find(i => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            }
          }
          return { items: [...state.items, { product, quantity, notes }] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.product.id !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          )
        }))
      },

      clearCart: () => set({ items: [], appliedReward: null }),

      applyReward: (reward) => set({ appliedReward: reward }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      getDiscount: () => {
        const reward = get().appliedReward
        const subtotal = get().getSubtotal()
        if (!reward) return 0

        if (reward.type === 'desconto_valor') return Math.min(reward.value, subtotal)
        if (reward.type === 'desconto_percentual') return subtotal * (reward.value / 100)
        return 0
      },

      getTotal: () => {
        return Math.max(0, get().getSubtotal() - get().getDiscount())
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getPointsToEarn: () => {
        return Math.floor(get().getTotal() * 100)
      }
    }),
    { name: 'la-piadina-cart' }
  )
)
