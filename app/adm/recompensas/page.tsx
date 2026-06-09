'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Gift, ToggleLeft, ToggleRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Reward, Product } from '@/lib/types'
import { formatPoints, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const REWARD_TYPES = [
  { value: 'desconto_valor', label: 'Desconto em R$' },
  { value: 'desconto_percentual', label: 'Desconto em %' },
  { value: 'produto_gratis', label: 'Produto Grátis' },
]

const defaultForm = { name: '', description: '', points_cost: '', type: 'desconto_valor', value: '', product_id: '', min_order_value: '0' }

export default function AdminRecompensasPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editReward, setEditReward] = useState<Reward | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(true)

  async function load() {
    const supabase = createClient()
    const [rRes, pRes] = await Promise.all([
      supabase.from('loyalty_rewards').select('*').order('points_cost'),
      supabase.from('products').select('*').eq('active', true).order('name'),
    ])
    if (rRes.data) setRewards(rRes.data)
    if (pRes.data) setProducts(pRes.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveReward() {
    const supabase = createClient()
    const data = {
      name: form.name,
      description: form.description || null,
      points_cost: parseInt(form.points_cost),
      type: form.type as Reward['type'],
      value: parseFloat(form.value),
      product_id: form.type === 'produto_gratis' ? form.product_id || null : null,
      min_order_value: parseFloat(form.min_order_value) || 0,
      active: true,
    }
    if (editReward) {
      await supabase.from('loyalty_rewards').update(data).eq('id', editReward.id)
      toast.success('Recompensa atualizada!')
    } else {
      await supabase.from('loyalty_rewards').insert(data)
      toast.success('Recompensa criada!')
    }
    setForm(defaultForm)
    setShowForm(false)
    setEditReward(null)
    load()
  }

  async function deleteReward(id: string) {
    if (!confirm('Remover recompensa?')) return
    const supabase = createClient()
    await supabase.from('loyalty_rewards').delete().eq('id', id)
    toast.success('Recompensa removida.')
    load()
  }

  async function toggleReward(reward: Reward) {
    const supabase = createClient()
    await supabase.from('loyalty_rewards').update({ active: !reward.active }).eq('id', reward.id)
    load()
  }

  function openEdit(r: Reward) {
    setEditReward(r)
    setForm({
      name: r.name, description: r.description || '', points_cost: r.points_cost.toString(),
      type: r.type, value: r.value.toString(), product_id: r.product_id || '', min_order_value: r.min_order_value.toString(),
    })
    setShowForm(true)
  }

  function getValueLabel(r: Reward) {
    if (r.type === 'desconto_valor') return `- ${formatCurrency(r.value)}`
    if (r.type === 'desconto_percentual') return `- ${r.value}%`
    return 'Produto Grátis'
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Recompensas do Clube</h1>
        <p style={{ color: '#6B6B6B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Configure o que os clientes podem trocar pelos pontos acumulados.
          Hoje: R$1,00 = 100 pontos.
        </p>
      </div>

      {/* Points rule info */}
      <div className="card p-4" style={{ background: 'rgba(92,122,44,0.05)', border: '1px solid rgba(92,122,44,0.2)' }}>
        <p style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#5C7A2C', fontWeight: 600 }}>
          Regra atual: <strong>R$1,00 = 100 pontos</strong> · Indicação bem-sucedida = <strong>500 pontos</strong>
        </p>
        <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
          Para alterar a conversão, edite a constante POINTS_PER_REAL no código ou configure via banco de dados.
        </p>
      </div>

      <button onClick={() => { setEditReward(null); setForm(defaultForm); setShowForm(true) }}
        className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>
        <Plus size={16} /> Nova Recompensa
      </button>

      {showForm && (
        <div className="card p-5 space-y-4" style={{ border: '2px solid #8B2323' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0A0A' }}>
            {editReward ? 'Editar Recompensa' : 'Nova Recompensa'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nome *</label>
              <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Desconto R$10" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descrição</label>
              <input className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrição para o cliente..." />
            </div>
            <div>
              <label className="label">Custo em Pontos *</label>
              <input className="input" type="number" min="0" value={form.points_cost} onChange={e => setForm(p => ({ ...p, points_cost: e.target.value }))} placeholder="Ex: 1000" />
            </div>
            <div>
              <label className="label">Tipo de Recompensa *</label>
              <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ cursor: 'pointer' }}>
                {REWARD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {form.type !== 'produto_gratis' ? (
              <div>
                <label className="label">{form.type === 'desconto_valor' ? 'Valor do Desconto (R$) *' : 'Percentual de Desconto (%) *'}</label>
                <input className="input" type="number" min="0" step={form.type === 'desconto_valor' ? '0.01' : '1'} value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder={form.type === 'desconto_valor' ? '10,00' : '15'} />
              </div>
            ) : (
              <div>
                <label className="label">Produto Grátis</label>
                <select className="input" value={form.product_id} onChange={e => setForm(p => ({ ...p, product_id: e.target.value }))} style={{ cursor: 'pointer' }}>
                  <option value="">Selecione o produto...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label">Pedido mínimo (R$)</label>
              <input className="input" type="number" min="0" step="0.01" value={form.min_order_value} onChange={e => setForm(p => ({ ...p, min_order_value: e.target.value }))} placeholder="0,00 (sem mínimo)" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={saveReward} disabled={!form.name || !form.points_cost} className="btn-primary" style={{ fontSize: '0.9rem' }}>Salvar</button>
            <button onClick={() => { setShowForm(false); setEditReward(null) }} className="btn-secondary" style={{ fontSize: '0.9rem' }}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6B6B6B' }}>Carregando...</p>
      ) : rewards.length === 0 ? (
        <div className="card p-8 text-center">
          <Gift size={40} style={{ color: '#EAD9B8', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6B6B6B' }}>Nenhuma recompensa criada. Crie a primeira!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rewards.map(r => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-3 flex-wrap" style={{ opacity: r.active ? 1 : 0.6 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,35,35,0.08)' }}>
                  <Gift size={18} style={{ color: '#8B2323' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A0A0A' }}>{r.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>{formatPoints(r.points_cost)}</span>
                    <span style={{ fontSize: '0.78rem', color: '#5C7A2C', fontWeight: 600 }}>{getValueLabel(r)}</span>
                    {r.min_order_value > 0 && (
                      <span style={{ fontSize: '0.72rem', color: '#6B6B6B' }}>Mín: {formatCurrency(r.min_order_value)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleReward(r)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {r.active ? <ToggleRight size={24} style={{ color: '#5C7A2C' }} /> : <ToggleLeft size={24} style={{ color: '#EAD9B8' }} />}
                </button>
                <button onClick={() => openEdit(r)} className="p-2 rounded-lg" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                  <Pencil size={14} style={{ color: '#8B2323' }} />
                </button>
                <button onClick={() => deleteReward(r.id)} className="p-2 rounded-lg" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={14} style={{ color: '#8B2323' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
