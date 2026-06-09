'use client'

import { useEffect, useState } from 'react'
import { Save, Settings, QrCode, Truck, Store, Star, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

type Setting = { key: string; value: string; label: string }

const GROUPS = [
  {
    title: 'Pagamento',
    icon: QrCode,
    color: '#8B2323',
    keys: ['pix_key'],
    tips: { pix_key: 'Ex: email@gmail.com, CPF ou chave aleatória' },
  },
  {
    title: 'Entrega',
    icon: Truck,
    color: '#B5581E',
    keys: ['delivery_fee', 'free_delivery_above', 'min_order_value'],
    tips: {
      delivery_fee: 'Valor cobrado por entrega (ex: 6.00)',
      free_delivery_above: 'Pedidos acima deste valor têm frete grátis. Use 0 para desativar',
      min_order_value: 'Valor mínimo para aceitar o pedido (ex: 25.00)',
    },
  },
  {
    title: 'Restaurante',
    icon: Store,
    color: '#5C7A2C',
    keys: ['restaurant_phone', 'restaurant_whatsapp', 'restaurant_address', 'restaurant_hours'],
    tips: {
      restaurant_phone: 'Telefone exibido no site',
      restaurant_whatsapp: 'Com DDI+DDD sem espaços: 5551999999999',
      restaurant_address: 'Endereço completo para exibir no site',
      restaurant_hours: 'Ex: Seg–Dom: 11h às 22h',
    },
  },
  {
    title: 'Clube Fidelidade',
    icon: Star,
    color: '#009246',
    keys: ['points_per_real', 'referral_points', 'first_order_bonus', 'birthday_bonus'],
    tips: {
      points_per_real: 'Pontos ganhos por cada R$1 gasto (padrão: 100)',
      referral_points: 'Pontos bônus quando o amigo indicado faz o 1º pedido',
      first_order_bonus: 'Pontos bônus que o cliente recebe no primeiro pedido',
      birthday_bonus: 'Pontos bônus no mês de aniversário do cliente',
    },
  },
]

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((s: Setting) => { map[s.key] = s.value })
        setSettings(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  function handleChange(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      const updates = Object.entries(settings).map(([key, value]) => ({
        key, value, updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' })
      if (error) throw error
      toast.success('Configurações salvas!')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const LABELS: Record<string, string> = {
    pix_key: 'Chave PIX',
    delivery_fee: 'Taxa de entrega (R$)',
    free_delivery_above: 'Entrega grátis acima de (R$)',
    min_order_value: 'Pedido mínimo (R$)',
    restaurant_phone: 'Telefone',
    restaurant_whatsapp: 'WhatsApp (ex: 5551999999999)',
    restaurant_address: 'Endereço',
    restaurant_hours: 'Horário de funcionamento',
    points_per_real: 'Pontos por R$1 gasto',
    referral_points: 'Pontos por indicação',
    first_order_bonus: 'Bônus 1º pedido',
    birthday_bonus: 'Bônus aniversário',
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <p style={{ color: '#6B6B6B' }}>Carregando configurações...</p>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Configurações</h1>
          <p style={{ color: '#6B6B6B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Gerencie todas as configurações do restaurante
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2"
          style={{ background: saved ? '#5C7A2C' : '#8B2323', color: '#F5EDD8', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontFamily: 'system-ui', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saved ? <><CheckCircle size={16} /> Salvo!</> : saving ? 'Salvando...' : <><Save size={16} /> Salvar Tudo</>}
        </button>
      </div>

      {GROUPS.map(group => (
        <div key={group.title} className="card p-6">
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid #EAD9B8' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', background: `${group.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <group.icon size={18} style={{ color: group.color }} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1A0A0A' }}>{group.title}</h2>
          </div>
          <div className="space-y-4">
            {group.keys.map(key => (
              <div key={key}>
                <label className="label">{LABELS[key] || key}</label>
                <input
                  className="input"
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={group.tips[key as keyof typeof group.tips] || ''}
                />
                {group.tips[key as keyof typeof group.tips] && (
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.3rem' }}>
                    {group.tips[key as keyof typeof group.tips]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Dica de pontos */}
      <div className="card p-5" style={{ background: 'rgba(92,122,44,0.04)', border: '1px solid rgba(92,122,44,0.2)' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#5C7A2C', marginBottom: '0.75rem' }}>
          💡 Sugestão de configuração do Clube
        </h3>
        <div style={{ fontFamily: 'system-ui', fontSize: '0.85rem', color: '#6B6B6B', lineHeight: 1.8 }}>
          <p><strong>R$1 = 100 pts</strong> — incentiva compras frequentes</p>
          <p><strong>Indicação = 500 pts</strong> — equivale a R$5 de compra, bom custo-benefício</p>
          <p><strong>1º pedido = 200 pts</strong> — dá boas-vindas e incentiva o cadastro</p>
          <p><strong>Frete grátis acima de R$80</strong> — aumenta o ticket médio</p>
          <p><strong>Pedido mínimo R$25</strong> — cobre os custos de entrega</p>
        </div>
      </div>

      <div style={{ paddingBottom: '2rem' }} />
    </div>
  )
}
