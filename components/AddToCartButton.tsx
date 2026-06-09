'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'

export default function AddToCartButton({ product, dark }: { product: Product; dark?: boolean }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  function handle() {
    addItem(product, 1)
    setAdded(true)
    toast.success(`${product.name} adicionado!`)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      onClick={handle}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        background: added ? '#5C7A2C' : 'transparent',
        color: added ? '#fff' : (dark ? '#B5581E' : '#8B2323'),
        border: `1.5px solid ${added ? '#5C7A2C' : (dark ? '#B5581E' : '#8B2323')}`,
        padding: '0.5rem 1rem', borderRadius: '0.375rem',
        fontFamily: 'system-ui', fontSize: '0.78rem', fontWeight: 700,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
      }}
    >
      {added ? <><Check size={13} /> Adicionado</> : <><Plus size={13} /> Adicionar</>}
    </button>
  )
}
