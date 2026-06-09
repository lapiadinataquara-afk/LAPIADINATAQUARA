'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CreditCard, Banknote, QrCode, MapPin, User, Phone, ChevronRight, Star, Tag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/store'
import { formatCurrency, formatPoints } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Reward } from '@/lib/types'
import toast from 'react-hot-toast'

const PIX_KEY = 'SEU_PIX_AQUI@email.com' // Configure no painel

type PayMethod = 'pix' | 'cartao_entrega' | 'dinheiro_entrega'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getTotal, getDiscount, getPointsToEarn, appliedReward, applyReward, clearCart } = useCartStore()
  const [step, setStep] = useState<'dados' | 'pagamento' | 'pix'>('dados')
  const [payment, setPayment] = useState<PayMethod>('pix')
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [showRewards, setShowRewards] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', complement: '', notes: '',
  })

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = getTotal()
  const points = getPointsToEarn()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function loadRewards() {
    const supabase = createClient()
    const { data } = await supabase.from('loyalty_rewards').select('*').eq('active', true)
    if (data) setRewards(data)
    setShowRewards(true)
  }

  async function placeOrder() {
    setLoading(true)
    try {
      const supabase = createClient()
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        notes: item.notes || null,
      }))

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          status: 'pendente',
          payment_method: payment,
          payment_status: payment === 'pix' ? 'aguardando' : 'pendente',
          subtotal,
          discount,
          total,
          points_earned: points,
          points_used: 0,
          delivery_address: form.address,
          delivery_complement: form.complement || null,
          notes: form.notes || null,
          reward_id: appliedReward?.id || null,
        })
        .select()
        .single()

      if (error) throw error

      // Insert items
      await supabase.from('order_items').insert(
        orderItems.map(item => ({ ...item, order_id: order.id }))
      )

      clearCart()

      if (payment === 'pix') {
        setStep('pix')
        router.push(`/pedido/${order.id}?pix=true`)
      } else {
        router.push(`/pedido/${order.id}`)
      }
    } catch {
      toast.error('Erro ao fazer pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#6B6B6B', marginBottom: '1rem' }}>
              Seu carrinho está vazio.
            </p>
            <button onClick={() => router.push('/cardapio')} className="btn-primary">
              Ver Cardápio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#8B2323', marginBottom: '2rem' }}>
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados do cliente */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} style={{ color: '#8B2323' }} /> Seus Dados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nome completo *</label>
                    <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" required />
                  </div>
                  <div>
                    <label className="label">WhatsApp *</label>
                    <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">E-mail (opcional)</label>
                    <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" type="email" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ color: '#8B2323' }} /> Endereço de Entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Endereço completo *</label>
                    <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="Rua, número, bairro" required />
                  </div>
                  <div>
                    <label className="label">Complemento</label>
                    <input className="input" name="complement" value={form.complement} onChange={handleChange} placeholder="Apto, bloco, referência..." />
                  </div>
                  <div>
                    <label className="label">Observações do pedido</label>
                    <textarea className="input" name="notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Sem cebola, bem passado..." rows={3} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              {/* Forma de pagamento */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} style={{ color: '#8B2323' }} /> Forma de Pagamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { id: 'pix', label: 'PIX', sublabel: 'Aprovação imediata', Icon: QrCode },
                    { id: 'cartao_entrega', label: 'Cartão', sublabel: 'Na entrega', Icon: CreditCard },
                    { id: 'dinheiro_entrega', label: 'Dinheiro', sublabel: 'Na entrega', Icon: Banknote },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayment(opt.id)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        border: `2px solid ${payment === opt.id ? '#8B2323' : '#EAD9B8'}`,
                        background: payment === opt.id ? 'rgba(139,35,35,0.05)' : 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <opt.Icon size={20} style={{ color: payment === opt.id ? '#8B2323' : '#6B6B6B', marginBottom: '0.5rem' }} />
                      <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: payment === opt.id ? '#8B2323' : '#1A0A0A', fontSize: '0.9rem' }}>
                        {opt.label}
                      </p>
                      <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#6B6B6B' }}>{opt.sublabel}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="card p-6 sticky top-24">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1rem' }}>
                  Resumo do Pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between gap-2" style={{ fontFamily: 'system-ui', fontSize: '0.875rem' }}>
                      <span style={{ color: '#1A0A0A' }}>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span style={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reward */}
                <button
                  onClick={loadRewards}
                  className="w-full flex items-center gap-2 p-3 rounded-xl mb-4 transition-colors"
                  style={{ background: 'rgba(92,122,44,0.08)', border: '1px dashed #5C7A2C', cursor: 'pointer' }}
                >
                  <Tag size={15} style={{ color: '#5C7A2C' }} />
                  <span style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#5C7A2C', fontWeight: 600 }}>
                    {appliedReward ? appliedReward.name : 'Usar pontos do Clube'}
                  </span>
                </button>

                {showRewards && rewards.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl" style={{ background: '#F5EDD8' }}>
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, color: '#1A0A0A', marginBottom: '0.5rem' }}>
                      Recompensas disponíveis:
                    </p>
                    {rewards.map(r => (
                      <button key={r.id} onClick={() => { applyReward(appliedReward?.id === r.id ? null : r); setShowRewards(false) }}
                        className="w-full text-left p-2 rounded-lg mb-1 transition-colors"
                        style={{ background: appliedReward?.id === r.id ? 'rgba(139,35,35,0.1)' : 'white', border: 'none', cursor: 'pointer' }}>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: '#1A0A0A' }}>{r.name}</p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#6B6B6B' }}>{formatPoints(r.points_cost)}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 border-t pt-3" style={{ borderColor: '#EAD9B8', fontFamily: 'system-ui', fontSize: '0.875rem' }}>
                  <div className="flex justify-between" style={{ color: '#6B6B6B' }}>
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: '#5C7A2C' }}>
                      <span>Desconto</span><span>- {formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-1 border-t" style={{ borderColor: '#EAD9B8', color: '#1A0A0A' }}>
                    <span>Total</span>
                    <span style={{ color: '#8B2323' }}>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg" style={{ background: 'rgba(92,122,44,0.08)' }}>
                  <Star size={14} style={{ color: '#5C7A2C' }} />
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#5C7A2C', fontWeight: 600 }}>
                    + {points.toLocaleString('pt-BR')} pontos ao finalizar
                  </p>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading || !form.name || !form.phone || !form.address}
                  className="btn-primary w-full mt-4"
                  style={{ justifyContent: 'center', opacity: (!form.name || !form.phone || !form.address) ? 0.6 : 1 }}
                >
                  {loading ? 'Enviando...' : payment === 'pix' ? 'Gerar PIX' : 'Confirmar Pedido'}
                  <ChevronRight size={18} />
                </button>

                <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#6B6B6B', textAlign: 'center', marginTop: '0.75rem' }}>
                  Ao confirmar, você concorda com nossas políticas de entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
