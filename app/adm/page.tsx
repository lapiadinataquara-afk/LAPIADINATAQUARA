'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Users, Star, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, today: 0, revenue: 0, clients: 0, points: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]

      const [totalOrders, todayOrders, clients, recentRes] = await Promise.all([
        supabase.from('orders').select('id, total', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', today),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
      ])

      const revenue = (totalOrders.data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0)

      setStats({
        orders: totalOrders.count || 0,
        today: todayOrders.count || 0,
        revenue,
        clients: clients.count || 0,
        points: 0,
      })

      if (recentRes.data) setRecentOrders(recentRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const STAT_CARDS = [
    { label: 'Pedidos Hoje', value: stats.today, Icon: Clock, color: '#B5581E', bg: 'rgba(181,88,30,0.08)' },
    { label: 'Total Pedidos', value: stats.orders, Icon: ShoppingBag, color: '#8B2323', bg: 'rgba(139,35,35,0.08)' },
    { label: 'Faturamento', value: formatCurrency(stats.revenue), Icon: TrendingUp, color: '#5C7A2C', bg: 'rgba(92,122,44,0.08)' },
    { label: 'Clientes', value: stats.clients, Icon: Users, color: '#009246', bg: 'rgba(0,146,70,0.08)' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>
          Bem-vindo ao painel La Piadina
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.Icon size={20} style={{ color: card.color }} />
              </div>
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#1A0A0A', lineHeight: 1 }}>
              {loading ? '—' : card.value}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#6B6B6B', marginTop: '0.25rem' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#1A0A0A' }}>Pedidos Recentes</h2>
          <Link href="/adm/pedidos" className="flex items-center gap-1" style={{ color: '#8B2323', fontSize: '0.85rem', fontWeight: 600 }}>
            Ver todos <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F5EDD8' }}>
                {['Pedido', 'Cliente', 'Total', 'Pagamento', 'Status', 'Data'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', color: '#6B6B6B', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B6B6B' }}>Carregando...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B6B6B' }}>Nenhum pedido ainda.</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F5EDD8' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#1A0A0A' }}>
                      #{order.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#1A0A0A' }}>
                      {order.customer_name}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#8B2323' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'cartao_entrega' ? 'Cartão' : 'Dinheiro'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className={`badge ${getStatusColor(order.status)}`} style={{ fontSize: '0.72rem' }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/adm/cardapio', label: 'Gerenciar Cardápio', desc: 'Adicionar pratos e categorias', color: '#8B2323' },
          { href: '/adm/recompensas', label: 'Configurar Recompensas', desc: 'Definir troca de pontos', color: '#5C7A2C' },
          { href: '/adm/clientes', label: 'Ver Clientes', desc: 'Gerenciar base de clientes', color: '#B5581E' },
        ].map(link => (
          <Link key={link.href} href={link.href} className="card p-5 block group">
            <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: link.color, marginBottom: '0.25rem', fontSize: '1rem' }}>
              {link.label}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#6B6B6B' }}>{link.desc}</p>
            <ChevronRight size={16} style={{ color: link.color, marginTop: '0.75rem' }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}
