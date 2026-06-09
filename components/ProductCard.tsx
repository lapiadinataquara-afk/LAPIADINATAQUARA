'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/store'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, 1)
    setAdded(true)
    toast.success(`${product.name} adicionado!`)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="product-card group">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2', background: '#F5EDD8' }}>
        {product.image_url ? (
          <Image
            src={product.image_url} alt={product.name} fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image src="/logo.png" alt="La Piadina" width={64} height={64} style={{ opacity: 0.2 }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,7,7,0.5) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s ease' }} className="group-hover:opacity-100" />

        {product.featured && (
          <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
            <span className="badge badge-red" style={{ background: '#8B2323', color: '#fff', fontSize: '0.65rem' }}>
              Destaque
            </span>
          </div>
        )}

        {/* Quick add on hover */}
        <div style={{ position: 'absolute', bottom: '0.875rem', right: '0.875rem', opacity: 0, transform: 'translateY(8px)', transition: 'all 0.3s ease' }} className="group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleAdd}
            style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: added ? '#5C7A2C' : '#8B2323', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', transition: 'background 0.2s ease' }}
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.375rem 1.375rem' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: 400, color: '#120707', lineHeight: 1.3, marginBottom: '0.5rem' }}>
          {product.name}
        </h3>
        {product.description && (
          <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#9B9B9B', lineHeight: 1.6, marginBottom: '1.125rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#8B2323', fontWeight: 700 }}>
            {formatCurrency(product.price)}
          </p>
          <button
            onClick={handleAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: added ? '#5C7A2C' : 'transparent',
              color: added ? '#fff' : '#8B2323',
              border: `1.5px solid ${added ? '#5C7A2C' : '#8B2323'}`,
              padding: '0.5rem 1rem', borderRadius: '0.375rem',
              fontFamily: 'system-ui', fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {added ? <><Check size={13} /> Adicionado</> : <><Plus size={13} /> Adicionar</>}
          </button>
        </div>
      </div>
    </article>
  )
}
