'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('E-mail ou senha inválidos.')
    } else {
      toast.success('Bem-vindo(a) de volta!')
      router.push('/minha-conta')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F5EDD8' }}>
      {/* Sidebar decorativa */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center flex-col p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #B5581E 0%, transparent 60%)' }} />
        <Image src="/logo.png" alt="La Piadina" width={180} height={180} className="rounded-full mb-8 relative z-10" />
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#F5EDD8', textAlign: 'center', marginBottom: '1rem' }}>
          Bem-vindo ao Clube La Piadina
        </h2>
        <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.7)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.7 }}>
          Faça login para acompanhar seus pedidos, acumular pontos e resgatar recompensas exclusivas.
        </p>
        <div className="stripe-italy mt-8 w-32 rounded-full" style={{ height: '3px' }} />
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Image src="/logo.png" alt="La Piadina" width={80} height={80} className="rounded-full" />
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323', marginBottom: '0.5rem' }}>
            Entrar na conta
          </h1>
          <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: '#8B2323', fontWeight: 700 }}>Cadastre-se grátis</Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input
                  className="input pl-9"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
                <input
                  className="input pl-9 pr-10"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} style={{ color: '#6B6B6B' }} /> : <Eye size={16} style={{ color: '#6B6B6B' }} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Entrando...' : 'Entrar'}
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
