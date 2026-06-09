'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingCart, Trash2, Star, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getSubtotal, getTotal, getDiscount, getPointsToEarn } = useCartStore()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = getTotal()
  const points = getPointsToEarn()

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="cart-sidebar">

        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <div>
            <p className="eyebrow" style={{ color: '#B5581E', fontSize: '0.62rem', marginBottom: '0.15rem' }}>Meu Pedido</p>
            <p style={{ fontFamily: 'Georgia, serif', color: '#120707', fontSize: '1.15rem' }}>
              {items.length === 0 ? 'Carrinho vazio' : `${items.reduce((s, i) => s + i.quantity, 0)} item(s)`}
            </p>
          </div>
          <button onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: '#F5EDD8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} style={{ color: '#120707' }} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: items.length === 0 ? '0' : '1rem' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '3rem 2rem', gap: '1.25rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#F5EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={30} style={{ color: '#EAD9B8' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#120707', marginBottom: '0.5rem' }}>Nenhum item ainda</p>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#9B9B9B' }}>Explore nosso cardápio e adicione suas piadinas favoritas.</p>
              </div>
              <button onClick={() => { onClose(); router.push('/cardapio') }} className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.75rem 1.5rem' }}>
                Ver Cardápio
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', background: '#FAFAF7', border: '1px solid #F0EDE8' }}>
                  {/* Image */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '0.5rem', overflow: 'hidden', background: '#F5EDD8', flexShrink: 0 }}>
                    {item.product.image_url ? (
                      <Image src={item.product.image_url} alt={item.product.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image src="/logo.png" alt="" width={32} height={32} style={{ opacity: 0.2 }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.92rem', color: '#120707', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#8B2323', fontWeight: 700 }}>
                      {formatCurrency(item.product.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.625rem' }}>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '0.35rem', background: '#8B2323', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={11} />
                        </button>
                        <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '0.85rem', color: '#120707', minWidth: '1.25rem', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '0.35rem', background: '#8B2323', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={11} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#120707', fontSize: '0.875rem' }}>
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                        <button onClick={() => removeItem(item.product.id)}
                          style={{ width: '26px', height: '26px', borderRadius: '0.35rem', background: 'rgba(139,35,35,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={11} style={{ color: '#8B2323' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #F0EDE8', background: '#fff' }}>
            {/* Points hint */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: '0.625rem', background: 'rgba(92,122,44,0.07)', border: '1px solid rgba(92,122,44,0.15)', marginBottom: '1rem' }}>
              <Star size={13} style={{ color: '#5C7A2C', flexShrink: 0 }} />
              <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#5C7A2C', fontWeight: 600 }}>
                Você vai ganhar <strong>{points.toLocaleString('pt-BR')} pontos</strong> nesse pedido
              </p>
            </div>

            {/* Totals */}
            <div style={{ marginBottom: '1.125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: '0.85rem', color: '#9B9B9B', marginBottom: '0.35rem' }}>
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: '0.85rem', color: '#5C7A2C', marginBottom: '0.35rem' }}>
                  <span>Desconto</span><span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#120707', paddingTop: '0.625rem', borderTop: '1px solid #F0EDE8', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span style={{ color: '#8B2323', fontWeight: 700 }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => { onClose(); router.push('/checkout') }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '1rem' }}
            >
              Finalizar Pedido <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
