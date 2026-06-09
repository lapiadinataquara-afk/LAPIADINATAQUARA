'use client'

import { useEffect, useState, use } from 'react'
import { CheckCircle, Clock, ChefHat, Bike, Package, XCircle, Copy } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

const PIX_KEY = 'SEU_PIX_AQUI@email.com'

const STATUS_STEPS = [
  { key: 'pendente', label: 'Recebido', Icon: Clock },
  { key: 'confirmado', label: 'Confirmado', Icon: CheckCircle },
  { key: 'preparando', label: 'Preparando', Icon: ChefHat },
  { key: 'saiu', label: 'Saiu para entrega', Icon: Bike },
  { key: 'entregue', label: 'Entregue', Icon: Package },
]

export default function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', id)
        .single()
      if (data) setOrder(data)
      setLoading(false)
    }
    load()

    // Real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel(`order-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        payload => setOrder(prev => prev ? { ...prev, ...payload.new } : prev))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY)
    toast.success('Chave PIX copiada!')
  }

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : 0

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse" style={{ fontFamily: 'Georgia, serif', color: '#8B2323', fontSize: '1.2rem' }}>
            Carregando pedido...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#6B6B6B' }}>
            Pedido não encontrado.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

          {/* Header */}
          <div className="card p-6 text-center" style={{ background: order.status === 'cancelado' ? 'rgba(139,35,35,0.05)' : 'rgba(92,122,44,0.05)' }}>
            {order.status === 'cancelado' ? (
              <XCircle size={48} style={{ color: '#8B2323', margin: '0 auto 1rem' }} />
            ) : (
              <CheckCircle size={48} style={{ color: '#5C7A2C', margin: '0 auto 1rem' }} />
            )}
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#1A0A0A', marginBottom: '0.5rem' }}>
              {order.status === 'cancelado' ? 'Pedido Cancelado' : 'Pedido Recebido!'}
            </h1>
            <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '0.9rem' }}>
              #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}
            </p>
          </div>

          {/* PIX Payment */}
          {order.payment_method === 'pix' && order.payment_status === 'aguardando' && (
            <div className="card p-6" style={{ border: '2px solid #5C7A2C' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#5C7A2C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Pagamento via PIX
              </h2>
              <p style={{ fontFamily: 'system-ui', fontSize: '0.9rem', color: '#6B6B6B', marginBottom: '1rem' }}>
                Pague via PIX para confirmar seu pedido. Após o pagamento, nossa equipe irá confirmar.
              </p>
              <div className="p-4 rounded-xl mb-3" style={{ background: '#F5EDD8' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: '#6B6B6B', marginBottom: '0.25rem' }}>Chave PIX:</p>
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#1A0A0A', wordBreak: 'break-all' }}>{PIX_KEY}</p>
                  <button onClick={copyPix} className="p-2 rounded-lg flex-shrink-0" style={{ background: '#8B2323', color: 'white', border: 'none', cursor: 'pointer' }}>
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#EAD9B8' }}>
                <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#8B2323', fontSize: '1.1rem', textAlign: 'center' }}>
                  Valor: {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          )}

          {/* Status Steps */}
          {order.status !== 'cancelado' && (
            <div className="card p-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1.5rem' }}>
                Acompanhe seu pedido
              </h2>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5" style={{ background: '#EAD9B8' }} />
                <div
                  className="absolute left-6 top-6 w-0.5 transition-all duration-500"
                  style={{
                    background: '#5C7A2C',
                    height: `${Math.min(currentStepIndex / (STATUS_STEPS.length - 1), 1) * 100}%`
                  }}
                />

                <div className="space-y-6">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i < currentStepIndex
                    const active = i === currentStepIndex
                    return (
                      <div key={step.key} className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all"
                          style={{ background: done || active ? (active ? '#8B2323' : '#5C7A2C') : '#EAD9B8' }}>
                          <step.Icon size={20} style={{ color: done || active ? 'white' : '#6B6B6B' }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: 'system-ui', fontWeight: active ? 700 : 500, color: active ? '#8B2323' : done ? '#5C7A2C' : '#6B6B6B', fontSize: '0.95rem' }}>
                            {step.label}
                          </p>
                          {active && (
                            <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: '#6B6B6B' }}>
                              Status atual
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="card p-6">
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1rem' }}>
              Itens do Pedido
            </h2>
            <div className="space-y-3 mb-4">
              {order.items?.map(item => (
                <div key={item.id} className="flex justify-between" style={{ fontFamily: 'system-ui', fontSize: '0.9rem' }}>
                  <span style={{ color: '#1A0A0A' }}>{item.quantity}x {item.product_name}</span>
                  <span style={{ color: '#6B6B6B' }}>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t space-y-1" style={{ borderColor: '#EAD9B8', fontFamily: 'system-ui', fontSize: '0.875rem' }}>
              {order.discount > 0 && (
                <div className="flex justify-between" style={{ color: '#5C7A2C' }}>
                  <span>Desconto</span><span>- {formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold" style={{ color: '#8B2323', fontSize: '1rem' }}>
                <span>Total Pago</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
            {order.points_earned > 0 && (
              <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(92,122,44,0.08)' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#5C7A2C', fontWeight: 600, textAlign: 'center' }}>
                  + {order.points_earned.toLocaleString('pt-BR')} pontos adicionados ao seu Clube!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
