'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star, Clock, ChevronRight, LogOut, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'
import toast from 'react-hot-toast'

type UserData = { id: string; name: string; email: string; points: number; total_spent: number }
type Order = { id: string; status: string; total: number; created_at: string; payment_method: string }

const STATUS_STEPS = ['pendente', 'confirmado', 'preparando', 'saiu_para_entrega', 'entregue']
const STATUS_ICONS: Record<string, string> = {
  pendente: '⏳',
  confirmado: '✅',
  preparando: '👨‍🍳',
  saiu_para_entrega: '🛵',
  entregue: '🎉',
  cancelado: '❌',
}

export default function MinhaContaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserData | null>(null)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser) { router.push('/login'); return }

      const [userRes, ordersRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', authUser.id).single(),
        supabase.from('orders')
          .select('id, status, total, created_at, payment_method')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      if (userRes.data) {
        setUser(userRes.data)
      } else {
        // Fallback: usa dados do Auth se não tem linha na tabela users ainda
        const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Cliente'
        setUser({ id: authUser.id, name, email: authUser.email || '', points: 0, total_spent: 0 })
      }

      if (ordersRes.data && ordersRes.data.length > 0) {
        const active = ordersRes.data.find(o => !['entregue', 'cancelado'].includes(o.status))
        const last = ordersRes.data[0]
        if (active) setActiveOrder(active)
        setLastOrder(last)
      }

      setLoading(false)
      } catch (e) {
        console.error('minha-conta error:', e)
        router.push('/login')
      }
    }
    load()
  }, [])

  // Realtime para pedido ativo
  useEffect(() => {
    if (!activeOrder) return
    const channel = supabase
      .channel(`order-${activeOrder.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${activeOrder.id}`,
      }, payload => {
        setActiveOrder(prev => prev ? { ...prev, status: payload.new.status } : prev)
        toast.success(`Pedido atualizado: ${getStatusLabel(payload.new.status)}`)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeOrder?.id])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#120707', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Image src="/logo.png" alt="La Piadina" width={60} height={60} className="rounded-full mx-auto mb-4" style={{ opacity: 0.6 }} />
          <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.4)', fontSize: '0.9rem' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const activeStepIndex = activeOrder ? STATUS_STEPS.indexOf(activeOrder.status) : -1

  return (
    <div style={{ minHeight: '100vh', background: '#120707' }}>
      {/* Header */}
      <div style={{ background: '#1A0A0A', borderBottom: '1px solid rgba(245,237,216,0.06)', padding: '1rem 1.5rem' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="La Piadina" width={40} height={40} className="rounded-full" />
          </Link>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(245,237,216,0.4)', fontFamily: 'system-ui', fontSize: '0.8rem', cursor: 'pointer' }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Saudação */}
        <div style={{ background: '#1A0A0A', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(245,237,216,0.06)' }}>
          <div className="flex items-center gap-4">
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#8B2323', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#F5EDD8' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Olá,
              </p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#F5EDD8', fontWeight: 400 }}>
                {user.name.split(' ')[0]}
              </h1>
            </div>
          </div>
        </div>

        {/* Pontos */}
        <div style={{ background: 'linear-gradient(135deg, #8B2323 0%, #6B1A1A 100%)', borderRadius: '1rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(245,237,216,0.05)' }} />
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: 'rgba(245,237,216,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                Seus pontos
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#F5EDD8', fontWeight: 700, lineHeight: 1 }}>
                {user.points.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)', marginTop: '0.3rem' }}>
                pts acumulados
              </p>
            </div>
            <Star size={36} style={{ color: 'rgba(245,237,216,0.15)' }} />
          </div>
          <Link href="/clube"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', background: 'rgba(245,237,216,0.1)', border: '1px solid rgba(245,237,216,0.2)', color: '#F5EDD8', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontFamily: 'system-ui', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
            Ver recompensas <ChevronRight size={13} />
          </Link>
        </div>

        {/* Pedido ativo */}
        {activeOrder ? (
          <div style={{ background: '#1A0A0A', borderRadius: '1rem', border: '1px solid rgba(181,88,30,0.3)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(245,237,216,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B5581E', animation: 'pulse 2s infinite' }} />
                <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', fontWeight: 700, color: '#B5581E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Pedido em andamento
                </p>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#F5EDD8' }}>
                {formatCurrency(activeOrder.total)}
              </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Status atual */}
              <div className="flex items-center gap-3 mb-5">
                <span style={{ fontSize: '1.8rem' }}>{STATUS_ICONS[activeOrder.status] || '⏳'}</span>
                <div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#F5EDD8' }}>
                    {getStatusLabel(activeOrder.status)}
                  </p>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.4)' }}>
                    Atualizado em tempo real
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              {activeOrder.status !== 'cancelado' && (
                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between mb-2">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: i <= activeStepIndex ? '#B5581E' : 'rgba(245,237,216,0.08)',
                          border: `2px solid ${i <= activeStepIndex ? '#B5581E' : 'rgba(245,237,216,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem',
                          transition: 'all 0.5s ease',
                        }}>
                          <span>{STATUS_ICONS[step]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: '3px', background: 'rgba(245,237,216,0.06)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '2px',
                      background: '#B5581E',
                      width: `${Math.max(0, (activeStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              )}

              <Link href={`/pedido/${activeOrder.id}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(181,88,30,0.1)', border: '1px solid rgba(181,88,30,0.2)', borderRadius: '0.5rem', color: '#B5581E', fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                <Package size={14} /> Ver detalhes do pedido
              </Link>
            </div>
          </div>
        ) : (
          /* Sem pedido ativo */
          <div style={{ background: '#1A0A0A', borderRadius: '1rem', border: '1px solid rgba(245,237,216,0.06)', padding: '2rem', textAlign: 'center' }}>
            <ShoppingBag size={36} style={{ color: 'rgba(245,237,216,0.12)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#F5EDD8', marginBottom: '0.4rem' }}>
              Nenhum pedido ativo
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: 'rgba(245,237,216,0.35)', marginBottom: '1.5rem' }}>
              Está com fome? Faça seu pedido agora!
            </p>
            <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.85rem', display: 'inline-flex' }}>
              <ShoppingBag size={15} /> Fazer Pedido
            </Link>
          </div>
        )}

        {/* Último pedido (se diferente do ativo) */}
        {lastOrder && lastOrder.id !== activeOrder?.id && (
          <div style={{ background: '#1A0A0A', borderRadius: '1rem', border: '1px solid rgba(245,237,216,0.06)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(245,237,216,0.06)' }}>
              <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(245,237,216,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Último pedido
              </p>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: 'rgba(245,237,216,0.3)' }} />
                  <span style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: 'rgba(245,237,216,0.5)' }}>
                    {formatDate(lastOrder.created_at)}
                  </span>
                </div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#F5EDD8', fontWeight: 700 }}>
                  {formatCurrency(lastOrder.total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{
                  fontFamily: 'system-ui', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  background: `${getStatusColor(lastOrder.status)}20`,
                  color: getStatusColor(lastOrder.status),
                }}>
                  {getStatusLabel(lastOrder.status)}
                </span>
                <Link href={`/pedido/${lastOrder.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(245,237,216,0.4)', fontFamily: 'system-ui', fontSize: '0.78rem', textDecoration: 'none' }}>
                  Ver <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Links rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/cardapio" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#1A0A0A', borderRadius: '0.75rem', border: '1px solid rgba(245,237,216,0.06)', textDecoration: 'none' }}>
            <ShoppingBag size={18} style={{ color: '#B5581E' }} />
            <span style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#F5EDD8', fontWeight: 500 }}>Cardápio</span>
          </Link>
          <Link href="/clube" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#1A0A0A', borderRadius: '0.75rem', border: '1px solid rgba(245,237,216,0.06)', textDecoration: 'none' }}>
            <Star size={18} style={{ color: '#5C7A2C' }} />
            <span style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#F5EDD8', fontWeight: 500 }}>Clube</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
