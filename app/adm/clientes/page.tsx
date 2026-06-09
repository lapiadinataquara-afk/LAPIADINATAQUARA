'use client'

import { useEffect, useState } from 'react'
import { Search, Star, TrendingUp, Users, Copy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { formatCurrency, formatPoints, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminClientesPage() {
  const [clients, setClients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<User | null>(null)
  const [bonusPoints, setBonusPoints] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('users').select('*').order('points', { ascending: false })
      if (data) setClients(data)
      setLoading(false)
    }
    load()
  }, [])

  async function addBonus(userId: string, points: number) {
    const supabase = createClient()
    await supabase.from('users').update({ points: (selected?.points || 0) + points }).eq('id', userId)
    await supabase.from('point_transactions').insert({
      user_id: userId, amount: points, type: 'bonus',
      description: `Bônus manual pelo administrador`, order_id: null,
    })
    toast.success(`${points.toLocaleString('pt-BR')} pontos adicionados!`)
    const { data } = await supabase.from('users').select('*').order('points', { ascending: false })
    if (data) {
      setClients(data)
      setSelected(data.find(u => u.id === userId) || null)
    }
    setBonusPoints('')
  }

  function copyRef(code: string) {
    navigator.clipboard.writeText(`${window.location.origin}/cadastro?ref=${code}`)
    toast.success('Link copiado!')
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Clientes</h1>
          <p style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>{clients.length} cliente(s) cadastrado(s)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Clientes', value: clients.length, Icon: Users, color: '#8B2323' },
          { label: 'Total Pontos em Circulação', value: clients.reduce((s, c) => s + c.points, 0).toLocaleString('pt-BR'), Icon: Star, color: '#5C7A2C' },
          { label: 'Receita Total', value: formatCurrency(clients.reduce((s, c) => s + c.total_spent, 0)), Icon: TrendingUp, color: '#B5581E' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.Icon size={16} style={{ color: stat.color }} />
              <p style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>{stat.label}</p>
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#1A0A0A' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
        <input className="input pl-9" placeholder="Buscar por nome, email ou telefone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <p style={{ color: '#6B6B6B' }}>Carregando...</p>
          ) : filtered.length === 0 ? (
            <div className="card p-8 text-center">
              <p style={{ color: '#6B6B6B' }}>Nenhum cliente encontrado.</p>
            </div>
          ) : (
            filtered.map((client, i) => (
              <div key={client.id}
                onClick={() => setSelected(selected?.id === client.id ? null : client)}
                className="card p-4 cursor-pointer"
                style={{ border: selected?.id === client.id ? '2px solid #8B2323' : '2px solid transparent' }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: i < 3 ? '#B5581E' : '#8B2323', fontSize: '0.85rem', fontFamily: 'Georgia, serif' }}>
                      {i + 1}°
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A0A0A' }}>{client.name}</p>
                      <p style={{ fontSize: '0.78rem', color: '#6B6B6B' }}>{client.email}</p>
                      {client.phone && <p style={{ fontSize: '0.72rem', color: '#9B9B9B' }}>{client.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end" style={{ color: '#5C7A2C' }}>
                      <Star size={13} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{client.points.toLocaleString('pt-BR')} pts</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#6B6B6B' }}>{formatCurrency(client.total_spent)} gasto</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="card p-5 space-y-4">
            <div className="flex justify-between">
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0A0A' }}>Detalhes</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: '1.1rem' }}>✕</button>
            </div>

            <div className="space-y-2" style={{ fontSize: '0.85rem' }}>
              <div><span style={{ color: '#6B6B6B' }}>Nome:</span> <strong>{selected.name}</strong></div>
              <div><span style={{ color: '#6B6B6B' }}>Email:</span> {selected.email}</div>
              {selected.phone && <div><span style={{ color: '#6B6B6B' }}>Fone:</span> {selected.phone}</div>}
              <div><span style={{ color: '#6B6B6B' }}>Membro desde:</span> {formatDate(selected.created_at)}</div>
              <div><span style={{ color: '#6B6B6B' }}>Total gasto:</span> <strong>{formatCurrency(selected.total_spent)}</strong></div>
              <div><span style={{ color: '#6B6B6B' }}>Pontos:</span> <strong style={{ color: '#5C7A2C' }}>{selected.points.toLocaleString('pt-BR')}</strong></div>
            </div>

            {/* Referral */}
            <div className="p-3 rounded-xl" style={{ background: '#F5EDD8' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B6B6B', marginBottom: '0.25rem' }}>Código de indicação:</p>
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '0.08em' }}>{selected.referral_code}</span>
                <button onClick={() => copyRef(selected.referral_code)} style={{ background: '#8B2323', border: 'none', cursor: 'pointer', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* Add bonus */}
            <div>
              <label className="label">Adicionar pontos bônus</label>
              <div className="flex gap-2">
                <input className="input flex-1" type="number" min="1" value={bonusPoints} onChange={e => setBonusPoints(e.target.value)} placeholder="Qtd pontos" />
                <button
                  onClick={() => bonusPoints && addBonus(selected.id, parseInt(bonusPoints))}
                  disabled={!bonusPoints}
                  className="btn-green" style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}>
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
