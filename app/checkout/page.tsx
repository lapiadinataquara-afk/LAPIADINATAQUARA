'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Banknote, QrCode, MapPin, User, Phone, ChevronRight, Star, Tag, Truck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/store'
import { formatCurrency, formatPoints } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Reward } from '@/lib/types'
import toast from 'react-hot-toast'

type PayMethod = 'pix' | 'cartao_entrega' | 'dinheiro_entrega'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDiscount, appliedReward, applyReward, clearCart } = useCartStore()
  const [payment, setPayment] = useState<PayMethod>('pix')
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [showRewards, setShowRewards] = useState(false)
  const [pixKey, setPixKey] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [freeAbove, setFreeAbove] = useState(0)
  const [minOrder, setMinOrder] = useState(0)
  const [troco, setTroco] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', complement: '', notes: '' })

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient()
      const { data } = await supabase.from('settings').select('key, value')
        .in('key', ['pix_key', 'delivery_fee', 'free_delivery_above', 'min_order_value'])
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((s: any) => { map[s.key] = s.value })
        setPixKey(map.pix_key || '')
        setDeliveryFee(parseFloat(map.delivery_fee || '0'))
        setFreeAbove(parseFloat(map.free_delivery_above || '0'))
        setMinOrder(parseFloat(map.min_order_value || '0'))
      }
    }
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = user.user_metadata?.name || ''
        const phone = user.user_metadata?.phone || ''
        setForm(prev => ({ ...prev, name: name || prev.name, phone: phone || prev.phone, email: user.email || prev.email }))
      }
    }
    loadSettings()
    loadUser()
  }, [])

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const freeDelivery = freeAbove > 0 && subtotal >= freeAbove
  const actualDeliveryFee = freeDelivery ? 0 : deliveryFee
  const total = Math.max(0, subtotal - discount + actualDeliveryFee)
  const points = Math.floor(total * 100)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function loadRewards() {
    const supabase = createClient()
    const { data } = await supabase.from('loyalty_rewards').select('*').eq('active', true).order('points_cost')
    if (data) setRewards(data)
    setShowRewards(!showRewards)
  }

  async function placeOrder() {
    if (minOrder > 0 && subtotal < minOrder) {
      toast.error(`Pedido mínimo: ${formatCurrency(minOrder)}`)
      return
    }
    if (!form.name || !form.phone || !form.address) {
      toast.error('Preencha nome, telefone e endereço.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: order, error } = await supabase.from('orders').insert({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        user_id: user?.id || null,
        status: 'pendente',
        payment_method: payment,
        payment_status: payment === 'pix' ? 'aguardando' : 'pendente',
        subtotal,
        discount,
        delivery_fee: actualDeliveryFee,
        total,
        points_earned: points,
        points_used: 0,
        delivery_address: form.address,
        delivery_complement: form.complement || null,
        notes: form.notes || (troco ? `Troco para: R$ ${troco}` : null),
        reward_id: appliedReward?.id || null,
      }).select().single()

      if (error) throw error

      await supabase.from('order_items').insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
          notes: item.notes || null,
        }))
      )

      clearCart()
      router.push(`/pedido/${order.id}${payment === 'pix' ? '?pix=true' : ''}`)
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
            <button onClick={() => router.push('/cardapio')} className="btn-primary">Ver Cardápio</button>
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
            <div className="lg:col-span-2 space-y-5">
              {/* Dados */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} style={{ color: '#8B2323' }} /> Seus Dados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nome completo *</label>
                    <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="label">WhatsApp *</label>
                    <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">E-mail</label>
                    <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#8B2323' }} /> Endereço de Entrega
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Endereço completo *</label>
                    <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="Rua, número, bairro, cidade" />
                  </div>
                  <div>
                    <label className="label">Complemento</label>
                    <input className="input" name="complement" value={form.complement} onChange={handleChange} placeholder="Apto, bloco, ponto de referência..." />
                  </div>
                  <div>
                    <label className="label">Observações do pedido</label>
                    <textarea className="input" name="notes" value={form.notes}
                      onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Sem cebola, ponto da carne, alergia..." rows={2} style={{ resize: 'none' }} />
                  </div>
                </div>

                {/* Info de entrega */}
                {deliveryFee > 0 && (
                  <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: freeDelivery ? 'rgba(92,122,44,0.08)' : 'rgba(181,88,30,0.06)', border: `1px solid ${freeDelivery ? 'rgba(92,122,44,0.2)' : 'rgba(181,88,30,0.15)'}` }}>
                    <Truck size={15} style={{ color: freeDelivery ? '#5C7A2C' : '#B5581E', flexShrink: 0 }} />
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: freeDelivery ? '#5C7A2C' : '#B5581E', fontWeight: 600 }}>
                      {freeDelivery
                        ? 'Entrega grátis! Parabéns 🎉'
                        : freeAbove > 0
                          ? `Taxa: ${formatCurrency(deliveryFee)} — Frete grátis acima de ${formatCurrency(freeAbove)}`
                          : `Taxa de entrega: ${formatCurrency(deliveryFee)}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagamento */}
              <div className="card p-6">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} style={{ color: '#8B2323' }} /> Forma de Pagamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { id: 'pix', label: 'PIX', sublabel: 'Aprovação imediata', Icon: QrCode, badge: 'Recomendado' },
                    { id: 'cartao_entrega', label: 'Cartão', sublabel: 'Débito/crédito na entrega', Icon: CreditCard, badge: null },
                    { id: 'dinheiro_entrega', label: 'Dinheiro', sublabel: 'Na entrega', Icon: Banknote, badge: null },
                  ] as const).map(opt => (
                    <button key={opt.id} onClick={() => setPayment(opt.id)}
                      style={{
                        padding: '1rem', borderRadius: '0.75rem', textAlign: 'left', cursor: 'pointer', position: 'relative',
                        border: `2px solid ${payment === opt.id ? '#8B2323' : '#EAD9B8'}`,
                        background: payment === opt.id ? 'rgba(139,35,35,0.04)' : 'white',
                      }}>
                      {opt.badge && (
                        <span style={{ position: 'absolute', top: '-8px', right: '8px', background: '#5C7A2C', color: 'white', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px', letterSpacing: '0.05em' }}>
                          {opt.badge}
                        </span>
                      )}
                      <opt.Icon size={20} style={{ color: payment === opt.id ? '#8B2323' : '#6B6B6B', marginBottom: '0.4rem' }} />
                      <p style={{ fontWeight: 700, color: payment === opt.id ? '#8B2323' : '#1A0A0A', fontSize: '0.9rem' }}>{opt.label}</p>
                      <p style={{ fontSize: '0.76rem', color: '#6B6B6B' }}>{opt.sublabel}</p>
                    </button>
                  ))}
                </div>

                {payment === 'dinheiro_entrega' && (
                  <div className="mt-4">
                    <label className="label">Troco para quanto? (opcional)</label>
                    <input className="input" value={troco} onChange={e => setTroco(e.target.value)}
                      placeholder="Ex: 50,00" style={{ maxWidth: '200px' }} />
                  </div>
                )}

                {payment === 'pix' && pixKey && (
                  <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(0,146,70,0.06)', border: '1px solid rgba(0,146,70,0.2)' }}>
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#5C7A2C' }}>
                      Chave PIX: <strong>{pixKey}</strong> — O QR Code será gerado após confirmar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1rem' }}>
                  Resumo
                </h2>

                <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between gap-2" style={{ fontFamily: 'system-ui', fontSize: '0.85rem' }}>
                      <span style={{ color: '#1A0A0A' }}>{item.quantity}× {item.product.name}</span>
                      <span style={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Clube */}
                <button onClick={loadRewards}
                  className="w-full flex items-center gap-2 p-3 rounded-xl mb-3"
                  style={{ background: appliedReward ? 'rgba(92,122,44,0.08)' : 'transparent', border: '1px dashed #5C7A2C', cursor: 'pointer' }}>
                  <Tag size={14} style={{ color: '#5C7A2C' }} />
                  <span style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#5C7A2C', fontWeight: 600 }}>
                    {appliedReward ? `✓ ${appliedReward.name}` : 'Usar pontos do Clube'}
                  </span>
                </button>

                {showRewards && rewards.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid #EAD9B8' }}>
                    {rewards.map(r => (
                      <button key={r.id} onClick={() => { applyReward(appliedReward?.id === r.id ? null : r); setShowRewards(false) }}
                        className="w-full text-left p-3 transition-colors"
                        style={{ background: appliedReward?.id === r.id ? 'rgba(139,35,35,0.06)' : 'white', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F5EDD8' }}>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: '#1A0A0A' }}>{r.name}</p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: '#6B6B6B' }}>{formatPoints(r.points_cost)}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Totais */}
                <div className="space-y-2 border-t pt-3" style={{ borderColor: '#EAD9B8', fontFamily: 'system-ui', fontSize: '0.875rem' }}>
                  <div className="flex justify-between" style={{ color: '#6B6B6B' }}>
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: '#5C7A2C' }}>
                      <span>Desconto</span><span>- {formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: freeDelivery ? '#5C7A2C' : '#6B6B6B' }}>
                    <span>Entrega</span>
                    <span>{freeDelivery ? 'Grátis 🎉' : actualDeliveryFee > 0 ? formatCurrency(actualDeliveryFee) : 'Grátis'}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: '#EAD9B8', color: '#1A0A0A', fontSize: '1rem' }}>
                    <span>Total</span>
                    <span style={{ color: '#8B2323' }}>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Pontos */}
                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg" style={{ background: 'rgba(92,122,44,0.08)' }}>
                  <Star size={13} style={{ color: '#5C7A2C' }} />
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.76rem', color: '#5C7A2C', fontWeight: 600 }}>
                    + {points.toLocaleString('pt-BR')} pontos ao finalizar
                  </p>
                </div>

                {minOrder > 0 && subtotal < minOrder && (
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.76rem', color: '#8B2323', marginTop: '0.5rem', fontWeight: 600, textAlign: 'center' }}>
                    Pedido mínimo: {formatCurrency(minOrder)} (faltam {formatCurrency(minOrder - subtotal)})
                  </p>
                )}

                <button onClick={placeOrder} disabled={loading || !form.name || !form.phone || !form.address}
                  className="btn-primary w-full mt-4"
                  style={{ justifyContent: 'center', opacity: (!form.name || !form.phone || !form.address) ? 0.55 : 1 }}>
                  {loading ? 'Enviando...' : payment === 'pix' ? 'Gerar PIX' : 'Confirmar Pedido'}
                  <ChevronRight size={16} />
                </button>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: '#9B9B9B', textAlign: 'center', marginTop: '0.75rem' }}>
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
