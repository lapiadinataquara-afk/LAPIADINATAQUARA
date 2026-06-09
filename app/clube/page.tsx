'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Gift, Users, Copy, Share2, Award, TrendingUp, ShoppingBag, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { User, Reward, PointTransaction, Order } from '@/lib/types'
import { formatCurrency, formatPoints, formatDate, getTier, getTierProgress, TIERS, getStatusLabel, getStatusColor } from '@/lib/utils'
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
          supabase.from('loyalty_rewards').select('*').eq('active', true).order('points_cost'),
          supabase.from('point_transactions').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(30),
          supabase.from('orders').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(15),
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
    navigator.clipboard.writeText(`${window.location.origin}/cadastro?ref=${user.referral_code}`)
    toast.success('Link copiado!')
  }

  function shareReferral() {
    if (!user) return
    const url = `${window.location.origin}/cadastro?ref=${user.referral_code}`
    if (navigator.share) {
      navigator.share({ title: 'La Piadina', text: 'Use meu link e ganhe pontos na La Piadina!', url })
    } else copyReferralLink()
  }

  if (loading) return (
    <div className="flex flex-col min-h-full"><Navbar />
      <main className="flex-1 flex items-center justify-center">
        <p style={{ fontFamily: 'Georgia, serif', color: '#8B2323' }}>Carregando...</p>
      </main><Footer />
    </div>
  )

  if (!user) return (
    <div className="flex flex-col min-h-full"><Navbar />
      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero público */}
          <div className="text-center mb-12">
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(139,35,35,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Award size={36} style={{ color: '#8B2323' }} />
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#8B2323', marginBottom: '1rem' }}>Clube La Piadina</h1>
            <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Cada pedido vira ponto. Cada amigo indicado vira bônus. Suba de nível e ganhe recompensas exclusivas.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/cadastro" className="btn-primary" style={{ fontSize: '0.9rem' }}>Entrar grátis</Link>
              <Link href="/login" className="btn-secondary" style={{ fontSize: '0.9rem' }}>Já tenho conta</Link>
            </div>
          </div>

          {/* Tiers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {TIERS.map(tier => (
              <div key={tier.name} className="card p-5 text-center">
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tier.icon}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: tier.color, fontWeight: 700 }}>{tier.name}</p>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
                  {tier.max === Infinity ? `${tier.min.toLocaleString('pt-BR')}+ pts` : `${tier.min.toLocaleString('pt-BR')}–${tier.max.toLocaleString('pt-BR')} pts`}
                </p>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: tier.color, fontWeight: 700, marginTop: '0.5rem' }}>
                  {tier.multiplier > 1 ? `${tier.multiplier}× pontos` : 'Pontos base'}
                </p>
              </div>
            ))}
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: ShoppingBag, title: 'R$1 = 100 pts', desc: 'Ganhe pontos em cada pedido automaticamente' },
              { Icon: Users, title: 'Indicação = 500 pts', desc: 'Seu amigo compra pelo seu link, você ganha bônus' },
              { Icon: Gift, title: 'Troque por prêmios', desc: 'Descontos, frete grátis e produtos gratuitos' },
            ].map(item => (
              <div key={item.title} className="card p-5 flex gap-4 items-start">
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(139,35,35,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.Icon size={20} style={{ color: '#8B2323' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#1A0A0A', fontSize: '0.9rem' }}>{item.title}</p>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: '#6B6B6B', marginTop: '0.2rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main><Footer />
    </div>
  )

  const tier = getTier(user.points)
  const progress = getTierProgress(user.points)
  const nextTier = TIERS[TIERS.indexOf(tier) + 1]

  return (
    <div className="flex flex-col min-h-full"><Navbar />
      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          {/* Card principal */}
          <div style={{ background: 'linear-gradient(135deg, #1A0A0A 0%, #3D1515 100%)', borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div className="stripe-italy" />
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.2rem' }}>{tier.icon}</span>
                    <span style={{ fontFamily: 'system-ui', fontSize: '0.75rem', fontWeight: 700, color: tier.color, textTransform: 'uppercase', letterSpacing: '0.1em', background: tier.bg, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {tier.name}
                    </span>
                    {tier.multiplier > 1 && (
                      <span style={{ fontFamily: 'system-ui', fontSize: '0.7rem', color: 'rgba(245,237,216,0.5)' }}>
                        {tier.multiplier}× pontos
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                    {user.name.split(' ')[0]}
                  </p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#F5EDD8', fontWeight: 700, lineHeight: 1 }}>
                    {user.points.toLocaleString('pt-BR')}
                  </p>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.82rem', color: '#B5581E', marginTop: '0.2rem' }}>
                    pontos disponíveis
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)', marginBottom: '0.25rem' }}>Gasto total</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#F5EDD8', fontWeight: 700 }}>{formatCurrency(user.total_spent)}</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="mb-6">
                <div className="flex justify-between mb-2" style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)' }}>
                  <span>{tier.icon} {tier.name}</span>
                  {nextTier ? (
                    <span>{nextTier.icon} {nextTier.name} em {(nextTier.min - user.points).toLocaleString('pt-BR')} pts</span>
                  ) : (
                    <span>Nível máximo! {tier.icon}</span>
                  )}
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(245,237,216,0.1)' }}>
                  <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, background: `linear-gradient(90deg, ${tier.color}, #5C7A2C)`, transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Indicação */}
              <div className="p-4 rounded-xl" style={{ background: 'rgba(245,237,216,0.07)' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: 'rgba(245,237,216,0.6)', marginBottom: '0.4rem' }}>
                  Seu código de indicação — compartilhe e ganhe 500 pts por amigo!
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#F5EDD8', fontWeight: 700, letterSpacing: '0.12em' }}>
                    {user.referral_code}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={copyReferralLink} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.1)', border: 'none', cursor: 'pointer', color: '#F5EDD8' }}>
                      <Copy size={15} />
                    </button>
                    <button onClick={shareReferral} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#8B2323', border: 'none', cursor: 'pointer', color: '#F5EDD8' }}>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 p-1.5 rounded-xl" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {([
              { id: 'pontos', label: 'Histórico', Icon: TrendingUp },
              { id: 'recompensas', label: 'Recompensas', Icon: Gift },
              { id: 'pedidos', label: 'Pedidos', Icon: ShoppingBag },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all"
                style={{ fontFamily: 'system-ui', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === tab.id ? '#8B2323' : 'transparent', color: activeTab === tab.id ? 'white' : '#6B6B6B' }}>
                <tab.Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Histórico */}
          {activeTab === 'pontos' && (
            <div className="card p-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1rem' }}>Histórico de Pontos</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={36} style={{ color: '#EAD9B8', margin: '0 auto 1rem' }} />
                  <p style={{ fontFamily: 'system-ui', color: '#6B6B6B' }}>Nenhuma transação ainda. Faça seu primeiro pedido!</p>
                  <Link href="/cardapio" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem', fontSize: '0.85rem' }}>
                    Ver Cardápio
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F5EDD8' }}>
                      <div>
                        <p style={{ fontFamily: 'system-ui', fontWeight: 600, fontSize: '0.875rem', color: '#1A0A0A' }}>{tx.description}</p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: '#9B9B9B' }}>{formatDate(tx.created_at)}</p>
                      </div>
                      <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '0.95rem', color: tx.amount > 0 ? '#5C7A2C' : '#8B2323', whiteSpace: 'nowrap' }}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('pt-BR')} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recompensas */}
          {activeTab === 'recompensas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(92,122,44,0.08)', border: '1px solid rgba(92,122,44,0.2)' }}>
                <Star size={18} style={{ color: '#5C7A2C', flexShrink: 0 }} />
                <p style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#5C7A2C', fontWeight: 600 }}>
                  Você tem <strong>{user.points.toLocaleString('pt-BR')} pontos</strong> — vá ao checkout para resgatar ao finalizar o pedido
                </p>
              </div>
              {rewards.length === 0 ? (
                <div className="card p-8 text-center"><p style={{ fontFamily: 'system-ui', color: '#6B6B6B' }}>Nenhuma recompensa disponível.</p></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rewards.map(reward => {
                    const canRedeem = user.points >= reward.points_cost
                    return (
                      <div key={reward.id} className="card p-5" style={{ opacity: canRedeem ? 1 : 0.65, position: 'relative' }}>
                        {canRedeem && (
                          <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#5C7A2C', color: 'white', fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                            Disponível
                          </span>
                        )}
                        <Gift size={20} style={{ color: '#8B2323', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#1A0A0A', marginBottom: '0.25rem' }}>
                          {reward.name}
                        </h3>
                        {reward.description && (
                          <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: '#6B6B6B', marginBottom: '0.75rem', lineHeight: 1.5 }}>{reward.description}</p>
                        )}
                        {reward.min_order_value > 0 && (
                          <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: '#9B9B9B', marginBottom: '0.75rem' }}>
                            Pedido mínimo: {formatCurrency(reward.min_order_value)}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span style={{ fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, color: '#8B2323', background: 'rgba(139,35,35,0.08)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                            {formatPoints(reward.points_cost)}
                          </span>
                          <Link href="/checkout"
                            style={{ fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, color: canRedeem ? '#5C7A2C' : '#9B9B9B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', pointerEvents: canRedeem ? 'auto' : 'none' }}>
                            {canRedeem ? 'Resgatar' : 'Insuficiente'} {canRedeem && <ChevronRight size={13} />}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pedidos */}
          {activeTab === 'pedidos' && (
            <div className="card p-6">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A', marginBottom: '1rem' }}>Meus Pedidos</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag size={36} style={{ color: '#EAD9B8', margin: '0 auto 1rem' }} />
                  <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', marginBottom: '1rem' }}>Você ainda não fez nenhum pedido.</p>
                  <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.9rem', display: 'inline-flex' }}>Ver Cardápio</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map(order => (
                    <Link key={order.id} href={`/pedido/${order.id}`}
                      className="flex items-center justify-between p-4 rounded-xl transition-colors"
                      style={{ background: '#F5EDD8', display: 'flex', textDecoration: 'none' }}>
                      <div>
                        <p style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: '0.875rem', color: '#1A0A0A' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#9B9B9B' }}>{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p style={{ fontFamily: 'system-ui', fontWeight: 700, color: '#8B2323', fontSize: '0.9rem' }}>{formatCurrency(order.total)}</p>
                          <span style={{ fontFamily: 'system-ui', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status), whiteSpace: 'nowrap' }}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <ChevronRight size={14} style={{ color: '#9B9B9B' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main><Footer />
    </div>
  )
}
