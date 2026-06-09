'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { generateReferralCode } from '@/lib/utils'
import toast from 'react-hot-toast'

function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref') || ''
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', referral: referralCode })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, phone: form.phone } }
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Find referrer
      let referredBy = null
      if (form.referral) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', form.referral.toUpperCase())
          .single()
        if (referrer) referredBy = referrer.id
      }

      await supabase.from('users').insert({
        id: data.user.id,
        email: form.email,
        name: form.name,
        phone: form.phone,
        referral_code: generateReferralCode(),
        referred_by: referredBy,
        points: 0,
        total_spent: 0,
      })

      toast.success('Conta criada! Bem-vindo(a) ao Clube La Piadina!')
      router.push('/clube')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F5EDD8' }}>
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center flex-col p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #5C7A2C 0%, transparent 60%)' }} />
        <Image src="/logo.png" alt="La Piadina" width={180} height={180} className="rounded-full mb-8 relative z-10" />
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#F5EDD8', textAlign: 'center', marginBottom: '1rem' }}>
          Junte-se ao Clube
        </h2>
        <div className="space-y-4 w-full max-w-xs">
          {[
            { pts: '100 pts', desc: 'por R$1 gasto' },
            { pts: '500 pts', desc: 'por indicação' },
            { pts: 'Bônus', desc: 'no aniversário' },
          ].map(item => (
            <div key={item.desc} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(245,237,216,0.08)' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#B5581E', minWidth: '60px' }}>{item.pts}</span>
              <span style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.8)', fontSize: '0.9rem' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6 lg:hidden">
            <Image src="/logo.png" alt="La Piadina" width={80} height={80} className="rounded-full" />
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323', marginBottom: '0.5rem' }}>
            Criar conta grátis
          </h1>
          <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#8B2323', fontWeight: 700 }}>Faça login</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nome completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input className="input pl-9" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" required />
              </div>
            </div>
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input className="input pl-9" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
              </div>
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input className="input pl-9" name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" required />
              </div>
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input className="input pl-9" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mín. 6 caracteres" required minLength={6} />
              </div>
            </div>
            {referralCode && (
              <div>
                <label className="label">Código de indicação</label>
                <input className="input" name="referral" value={form.referral} onChange={handleChange} placeholder="Código do amigo" style={{ background: 'rgba(92,122,44,0.05)', borderColor: '#5C7A2C' }} />
              </div>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Criando conta...' : 'Criar Conta e Entrar no Clube'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: '#EAD9B8' }}>
            <Link href="/" style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#6B6B6B' }}>
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5EDD8' }}><p style={{ fontFamily: 'Georgia, serif', color: '#8B2323' }}>Carregando...</p></div>}>
      <CadastroForm />
    </Suspense>
  )
}
