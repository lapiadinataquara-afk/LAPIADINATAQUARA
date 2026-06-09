'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUSES = ['todos', 'pendente', 'confirmado', 'preparando', 'saiu', 'entregue', 'cancelado']

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  async function loadOrders() {
    setLoading(true)
    const supabase = createClient()
    let q = supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false })
    if (statusFilter !== 'todos') q = q.eq('status', statusFilter)
    const { data } = await q
    if (data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [statusFilter])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function updateStatus(orderId: string, status: string) {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      toast.error('Erro ao atualizar status.')
    } else {
      toast.success('Status atualizado!')
      setSelected(prev => prev ? { ...prev, status: status as any } : null)
      loadOrders()
    }
    setUpdating(false)
  }

  async function confirmPayment(orderId: string) {
    const supabase = createClient()
    await supabase.from('orders').update({ payment_status: 'pago', status: 'confirmado' }).eq('id', orderId)
    toast.success('Pagamento confirmado!')
    loadOrders()
  }

  const filtered = orders.filter(o =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone.includes(search) ||
    o.id.startsWith(search.toLowerCase())
  )

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Pedidos</h1>
        <button onClick={loadOrders} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <RefreshCw size={15} /> Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
          <input className="input pl-9" placeholder="Buscar por nome, telefone ou ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: statusFilter === s ? '#8B2323' : 'white',
                color: statusFilter === s ? 'white' : '#6B6B6B',
                border: '2px solid', borderColor: statusFilter === s ? '#8B2323' : '#EAD9B8',
                cursor: 'pointer',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Orders List */}
        <div className={`space-y-3 ${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="card p-8 text-center" style={{ color: '#6B6B6B' }}>Carregando pedidos...</div>
          ) : filtered.length === 0 ? (
            <div className="card p-8 text-center" style={{ color: '#6B6B6B' }}>Nenhum pedido encontrado.</div>
          ) : (
            filtered.map(order => (
              <div key={order.id}
                onClick={() => setSelected(selected?.id === order.id ? null : order)}
                className="card p-4 cursor-pointer transition-all"
                style={{ border: selected?.id === order.id ? '2px solid #8B2323' : '2px solid transparent' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A0A0A' }}>
                        #{order.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span className={`badge ${getStatusColor(order.status)}`} style={{ fontSize: '0.72rem' }}>
                        {getStatusLabel(order.status)}
                      </span>
                      {order.payment_status === 'aguardando' && order.payment_method === 'pix' && (
                        <span className="badge" style={{ background: 'rgba(234,157,0,0.1)', color: '#b47d00', fontSize: '0.72rem' }}>
                          PIX aguardando
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#1A0A0A', marginTop: '0.25rem', fontWeight: 600 }}>
                      {order.customer_name}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#6B6B6B' }}>{order.customer_phone}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
                      {order.delivery_address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontWeight: 700, color: '#8B2323', fontSize: '1rem' }}>{formatCurrency(order.total)}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
                      {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'cartao_entrega' ? 'Cartão' : 'Dinheiro'}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#9B9B9B', marginTop: '0.25rem' }}>{formatDate(order.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Detail */}
        {selected && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A' }}>
                Detalhes #{selected.id.slice(0, 6).toUpperCase()}
              </h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Items */}
            <div style={{ fontSize: '0.85rem' }}>
              <p style={{ fontWeight: 700, color: '#1A0A0A', marginBottom: '0.5rem' }}>Itens:</p>
              {selected.items?.map(item => (
                <div key={item.id} className="flex justify-between" style={{ color: '#6B6B6B', marginBottom: '0.25rem' }}>
                  <span>{item.quantity}x {item.product_name}</span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2" style={{ borderTop: '1px solid #EAD9B8', color: '#8B2323' }}>
                <span>Total</span><span>{formatCurrency(selected.total)}</span>
              </div>
            </div>

            {/* Address */}
            {selected.notes && (
              <div className="p-3 rounded-xl" style={{ background: '#F5EDD8', fontSize: '0.82rem', color: '#6B6B6B' }}>
                <strong>Obs:</strong> {selected.notes}
              </div>
            )}

            {/* PIX confirm */}
            {selected.payment_method === 'pix' && selected.payment_status === 'aguardando' && (
              <button onClick={() => confirmPayment(selected.id)} className="btn-green w-full" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                Confirmar Pagamento PIX
              </button>
            )}

            {/* Status update */}
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1A0A0A', marginBottom: '0.5rem' }}>Atualizar status:</p>
              <div className="grid grid-cols-2 gap-2">
                {['confirmado', 'preparando', 'saiu', 'entregue', 'cancelado'].map(s => (
                  <button key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={updating || selected.status === s}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selected.status === s ? '#8B2323' : '#F5EDD8',
                      color: selected.status === s ? 'white' : '#1A0A0A',
                      border: 'none', cursor: 'pointer', fontSize: '0.78rem',
                    }}>
                    {getStatusLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
