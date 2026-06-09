'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Gift, Users, Copy, Share2, Award, TrendingUp, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { User, Reward, PointTransaction, Order } from '@/lib/types'
import { formatCurrency, formatPoints, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClubePage() {
  const [user, setUser] = useState<User | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pontos' | 'recompensas' | 'pedidos'>('pontos')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        const [userRes, rewardsRes, txRes, ordersRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', authUser.id).single(),
          supabase.from('loyalty_rewards').select('*').eq('active', true),
          supabase.from('point_transactions').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(20),
          supabase.from('orders').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(10),
        ])
        if (userRes.data) setUser(userRes.data)
        if (rewardsRes.data) setRewards(rewardsRes.data)
        if (txRes.data) setTransactions(txRes.data)
        if (ordersRes.data) setOrders(ordersRes.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  function copyReferralLink() {
    if (!user) return
    const link = `${window.location.origin}/cadastro?ref=${user.referral_code}`
    navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  function shareReferral() {
    if (!user) return
    const link = `${window.location.origin}/cadastro?ref=${user.referral_code}`
    if (navigator.share) {
      navigator.share({ title: 'La Piadina – Clube Fidelidade', text: 'Use meu link e ganhe pontos na La Piadina!', url: link })
    } else {
      copyReferralLink()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ fontFamily: 'Georgia, serif', color: '#8B2323' }}>Carregando...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <Award size={64} style={{ color: '#EAD9B8', margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323', marginBottom: '1rem' }}>
              Clube La Piadina
            </h1>
            <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', marginBottom: '2rem' }}>
              Faça login para acessar seus pontos, recompensas e histórico de pedidos.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="btn-primary">Entrar</Link>
              <Link href="/cadastro" className="btn-secondary">Cadastrar</Link>
            </div>

            {/* Public info */}
            <div className="mt-12 space-y-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A' }}>Como funciona?</h2>
              {[
                { icon: ShoppingBag, title: 'Compre e Ganhe', desc: 'R$1 = 100 pontos em cada pedido' },
                { icon: Users, title: 'Indique Amigos', desc: 'Amigo compra pelo seu link = pontos para você' },
                { icon: Gift, title: 'Troque Pontos', desc: 'Por descontos ou produtos grátis' },
              ].map(item => (
                <div key={item.title} className="card p-4 flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,35,35,0.08)' }}>
                    <item.icon size={20} style={{ color: '#8B2323' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '0.9rem', color: '#1A0A0A' }}>{item.title}</p>
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#6B6B6B' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const POINTS_PER_LEVEL = 10000
  const progress = Math.min((user.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100, 100)

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          {/* Points Card */}
          <div style={{ background: 'linear-gradient(135deg, #1A0A0A 0%, #3D1515 100%)', borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div className="stripe-italy" />
            <div className="p-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: 'rgba(245,237,216,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    Seus Pontos
                  </p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', color: '#F5EDD8', fontWeight: 700, lineHeight: 1 }}>
                    {user.points.toLocaleString('pt-BR')}
                  </p>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#B5581E', marginTop: '0.25rem' }}>
                    pontos acumulados
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: 'rgba(245,237,216,0.6)', marginBottom: '0.25rem' }}>Gasto total</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#F5EDD8', fontWeight: 700 }}>
                    {formatCurrency(user.total_spent)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between mb-2" style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: 'rgba(245,237,216,0.5)' }}>
                  <span>Nível {Math.floor(user.points / POINTS_PER_LEVEL) + 1}</span>
                  <span>{user.points.toLocaleString('pt-BR')} / {((Math.floor(user.points / POINTS_PER_LEVEL) + 1) * POINTS_PER_LEVEL).toLocaleString('pt-BR')} pts</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(245,237,216,0.15)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #B5581E, #5C7A2C)' }} />
                </div>
              </div>

              {/* Referral */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(245,237,216,0.08)' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: 'rgba(245,237,216,0.7)', marginBottom: '0.5rem' }}>
                  Seu código de indicação:
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#F5EDD8', fontWeight: 700, letterSpacing: '0.1em' }}>
                    {user.referral_code}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={copyReferralLink} className="p-2 rounded-lg" style={{ background: 'rgba(245,237,216,0.1)', border: 'none', cursor: 'pointer', color: '#F5EDD8' }}>
                      <Copy size={16} />
                    </button>
                    <button onClick={shareReferral} className="p-2 rounded-lg" style={{ background: '#8B2323', border: 'none', cursor: 'pointer', color: '#F5EDD8' }}>
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'white' }}>
            {([
              { id: 'pontos', label: 'Histórico', icon: TrendingUp },
              { id: 'recompensas', label: 'Recompensas', icon: Gift },
              { id: 'pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all"
                style={{
                  fontFamily: 'system-ui', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? '#8B2323' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6B6B6B',
                }}>
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'pontos' && (
            <div className="card p-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1rem' }}>
                Histórico de Pontos
              </h2>
              {transactions.length === 0 ? (
                <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', textAlign: 'center', padding: '2rem' }}>
                  Nenhuma transação ainda. Faça seu primeiro pedido!
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F5EDD8' }}>
                      <div>
                        <p style={{ fontFamily: 'system-ui', fontWeight: 600, fontSize: '0.875rem', color: '#1A0A0A' }}>
                          {tx.description}
                        </p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#6B6B6B' }}>
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                      <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '1rem', color: tx.amount > 0 ? '#5C7A2C' : '#8B2323' }}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('pt-BR')} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recompensas' && (
            <div>
              <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(92,122,44,0.08)', border: '1px solid rgba(92,122,44,0.2)' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#5C7A2C', fontWeight: 600 }}>
                  Você tem <strong>{user.points.toLocaleString('pt-BR')} pontos</strong> disponíveis para resgatar.
                </p>
              </div>
              {rewards.length === 0 ? (
                <div className="card p-8 text-center">
                  <p style={{ fontFamily: 'system-ui', color: '#6B6B6B' }}>
                    Nenhuma recompensa disponível ainda. Fique ligado!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rewards.map(reward => {
                    const canRedeem = user.points >= reward.points_cost
                    return (
                      <div key={reward.id} className="card p-5" style={{ opacity: canRedeem ? 1 : 0.6 }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#1A0A0A' }}>
                              {reward.name}
                            </h3>
                            {reward.description && (
                              <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
                                {reward.description}
                              </p>
                            )}
                          </div>
                          <Gift size={22} style={{ color: '#8B2323', flexShrink: 0 }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="badge badge-red">
                            {formatPoints(reward.points_cost)}
                          </span>
                          <Link href={`/checkout`}
                            className={canRedeem ? 'btn-primary' : 'btn-secondary'}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', pointerEvents: canRedeem ? 'auto' : 'none' }}>
                            {canRedeem ? 'Resgatar' : 'Pontos insuficientes'}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="card p-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#1A0A0A', marginBottom: '1rem' }}>
                Meus Pedidos
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', marginBottom: '1rem' }}>
                    Você ainda não fez nenhum pedido.
                  </p>
                  <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.9rem' }}>Ver Cardápio</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <Link key={order.id} href={`/pedido/${order.id}`}
                      className="flex items-center justify-between p-4 rounded-xl transition-colors"
                      style={{ background: '#F5EDD8', display: 'flex' }}>
                      <div>
                        <p style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '0.875rem', color: '#1A0A0A' }}>
                          Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#6B6B6B' }}>
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#8B2323', fontSize: '0.9rem' }}>
                          {formatCurrency(order.total)}
                        </p>
                        <span style={{
                          fontFamily: 'system-ui', fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px',
                          background: order.status === 'entregue' ? 'rgba(92,122,44,0.1)' : 'rgba(181,88,30,0.1)',
                          color: order.status === 'entregue' ? '#5C7A2C' : '#B5581E',
                        }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
