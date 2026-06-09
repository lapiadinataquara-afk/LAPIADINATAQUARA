'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Users, Star, TrendingUp, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, today: 0, revenueTotal: 0, revenueToday: 0, clients: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    const [totalOrders, todayOrders, clients, recentRes, pendingRes] = await Promise.all([
      supabase.from('orders').select('id, total', { count: 'exact' }),
      supabase.from('orders').select('id, total', { count: 'exact' }).gte('created_at', today),
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pendente'),
    ])

    const revenueTotal = (totalOrders.data || []).reduce((s: number, o: any) => s + (o.total || 0), 0)
    const revenueToday = (todayOrders.data || []).reduce((s: number, o: any) => s + (o.total || 0), 0)

    setStats({
      orders: totalOrders.count || 0,
      today: todayOrders.count || 0,
      revenueTotal,
      revenueToday,
      clients: clients.count || 0,
      pending: pendingRes.count || 0,
    })
    if (recentRes.data) setRecentOrders(recentRes.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    const supabase = createClient()
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const STATS = [
    { label: 'Faturamento Hoje', value: formatCurrency(stats.revenueToday), sub: `${stats.today} pedido${stats.today !== 1 ? 's' : ''}`, Icon: TrendingUp, color: '#5C7A2C', bg: 'rgba(92,122,44,0.08)' },
    { label: 'Faturamento Total', value: formatCurrency(stats.revenueTotal), sub: `${stats.orders} pedidos`, Icon: ShoppingBag, color: '#8B2323', bg: 'rgba(139,35,35,0.08)' },
    { label: 'Clientes Cadastrados', value: stats.clients, sub: 'no clube', Icon: Users, color: '#B5581E', bg: 'rgba(181,88,30,0.08)' },
    { label: 'Aguardando', value: stats.pending, sub: 'pedidos pendentes', Icon: Clock, color: stats.pending > 0 ? '#8B2323' : '#5C7A2C', bg: stats.pending > 0 ? 'rgba(139,35,35,0.08)' : 'rgba(92,122,44,0.08)' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Dashboard</h1>
          <p style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>
        {stats.pending > 0 && !loading && (
          <Link href="/adm/pedidos"
            className="flex items-center gap-2"
            style={{ background: '#8B2323', color: '#F5EDD8', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', fontFamily: 'system-ui', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', animation: 'pulse 2s infinite' }}>
            <AlertCircle size={16} />
            {stats.pending} pedido{stats.pending > 1 ? 's' : ''} aguardando!
          </Link>
        )}
        {stats.pending === 0 && !loading && (
          <div className="flex items-center gap-2" style={{ color: '#5C7A2C', fontFamily: 'system-ui', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Tudo em dia
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div style={{ width: '38px', height: '38px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.bg }}>
                <card.Icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.55rem', fontWeight: 700, color: '#1A0A0A', lineHeight: 1 }}>
              {loading ? '—' : card.value}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.2rem' }}>{card.label}</p>
            <p style={{ fontSize: '0.72rem', color: card.color, marginTop: '0.1rem', fontWeight: 600 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #EAD9B8' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#1A0A0A' }}>Pedidos Recentes</h2>
          <Link href="/adm/pedidos" className="flex items-center gap-1" style={{ color: '#8B2323', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F5EDD8' }}>
                {['Pedido', 'Cliente', 'Total', 'Pagamento', 'Status', 'Hora'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.72rem', color: '#6B6B6B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B6B6B' }}>Carregando...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6B6B6B' }}>Nenhum pedido ainda.</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F5EDD8' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#1A0A0A', fontFamily: 'monospace' }}>
                      #{order.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#1A0A0A' }}>
                      {order.customer_name}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#8B2323', whiteSpace: 'nowrap' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {order.payment_method === 'pix' ? '🔵 PIX' : order.payment_method === 'cartao_entrega' ? '💳 Cartão' : '💵 Dinheiro'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        fontFamily: 'system-ui', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '999px',
                        background: `${getStatusColor(order.status)}18`,
                        color: getStatusColor(order.status),
                        whiteSpace: 'nowrap',
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/adm/pedidos', label: 'Gerenciar Pedidos', desc: 'Confirmar e atualizar status', color: '#8B2323' },
          { href: '/adm/cardapio', label: 'Editar Cardápio', desc: 'Adicionar pratos e categorias', color: '#B5581E' },
          { href: '/adm/recompensas', label: 'Recompensas', desc: 'Configurar troca de pontos', color: '#5C7A2C' },
          { href: '/adm/configuracoes', label: 'Configurações', desc: 'PIX, entrega e horários', color: '#009246' },
        ].map(link => (
          <Link key={link.href} href={link.href} className="card p-5 block group" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: link.color, marginBottom: '0.25rem', fontSize: '0.95rem' }}>
              {link.label}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{link.desc}</p>
            <ChevronRight size={16} style={{ color: link.color, marginTop: '0.75rem' }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}
