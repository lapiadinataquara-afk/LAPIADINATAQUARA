'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Star, User, ChevronDown, LogOut, Package } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const count = useCartStore(s => s.getItemCount())

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Minha Conta'
        setUserName(name.split(' ')[0])
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Minha Conta'
        setUserName(name.split(' ')[0])
      } else {
        setUserName(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserName(null)
    setUserMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(18,7,7,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(245,237,216,0.07)' : 'none',
        transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
      }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: '72px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.png" alt="La Piadina" width={38} height={38}
              className="rounded-full object-cover"
              style={{ border: '1px solid rgba(181,88,30,0.3)' }} />
            <div>
              <p style={{ fontFamily: 'Georgia, serif', color: '#F5EDD8', fontSize: '1.05rem', fontWeight: 400, lineHeight: 1 }}>
                La Piadina
              </p>
              <p className="eyebrow" style={{ color: '#B5581E', fontSize: '0.58rem', marginTop: '0.15rem' }}>
                Farm to Table
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/cardapio"
              style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245,237,216,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Cardápio
            </Link>
            <Link href="/clube" className="flex items-center gap-1"
              style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245,237,216,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
              <Star size={12} style={{ color: '#B5581E' }} /> Clube
            </Link>

            {userName ? (
              /* Usuário logado */
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2"
                  style={{ background: 'rgba(245,237,216,0.07)', border: '1px solid rgba(245,237,216,0.12)', borderRadius: '2rem', padding: '0.4rem 0.9rem 0.4rem 0.5rem', cursor: 'pointer', color: '#F5EDD8', fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600 }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#8B2323', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  {userName}
                  <ChevronDown size={12} style={{ opacity: 0.6 }} />
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1A0A0A', border: '1px solid rgba(245,237,216,0.1)', borderRadius: '0.75rem', padding: '0.5rem', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 100 }}>
                    <Link href="/minha-conta" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', color: '#F5EDD8', fontFamily: 'system-ui', fontSize: '0.85rem', textDecoration: 'none', borderRadius: '0.5rem' }}>
                      <User size={14} /> Minha Conta
                    </Link>
                    <Link href="/clube" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', color: '#F5EDD8', fontFamily: 'system-ui', fontSize: '0.85rem', textDecoration: 'none', borderRadius: '0.5rem' }}>
                      <Star size={14} /> Meus Pontos
                    </Link>
                    <Link href="/clube" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', color: '#F5EDD8', fontFamily: 'system-ui', fontSize: '0.85rem', textDecoration: 'none', borderRadius: '0.5rem' }}>
                      <Package size={14} /> Meus Pedidos
                    </Link>
                    <div style={{ borderTop: '1px solid rgba(245,237,216,0.08)', margin: '0.3rem 0' }} />
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', color: '#B5581E', fontFamily: 'system-ui', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '0.5rem' }}>
                      <LogOut size={14} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Não logado */
              <Link href="/login" className="flex items-center gap-1"
                style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245,237,216,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                <User size={12} /> Entrar
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center"
              style={{ width: '44px', height: '44px', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.07)', border: '1px solid rgba(245,237,216,0.1)', cursor: 'pointer' }}
              aria-label="Carrinho">
              <ShoppingCart size={18} style={{ color: '#F5EDD8' }} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B5581E', color: '#fff', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #120707' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <Link href="/cardapio" className="hidden md:flex btn-primary" style={{ fontSize: '0.78rem', padding: '0.65rem 1.25rem' }}>
              Pedir Agora
            </Link>

            <button className="md:hidden flex items-center justify-center"
              style={{ width: '44px', height: '44px', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.07)', border: '1px solid rgba(245,237,216,0.1)', cursor: 'pointer' }}
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} style={{ color: '#F5EDD8' }} /> : <Menu size={18} style={{ color: '#F5EDD8' }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#1A0A0A', borderTop: '1px solid rgba(245,237,216,0.06)', padding: '1.5rem 1.5rem 2rem' }}>
            <div className="space-y-2 max-w-7xl mx-auto">
              {userName && (
                <div style={{ padding: '0.75rem', background: 'rgba(139,35,35,0.15)', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8B2323', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', color: '#F5EDD8', fontWeight: 700 }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'system-ui', color: '#F5EDD8', fontWeight: 600, fontSize: '0.9rem' }}>{userName}</p>
                    <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.5)', fontSize: '0.75rem' }}>Membro do Clube</p>
                  </div>
                </div>
              )}
              {[
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/clube', label: 'Clube Fidelidade' },
                ...(userName
                  ? [{ href: '/minha-conta', label: 'Minha Conta' }]
                  : [{ href: '/login', label: 'Entrar' }, { href: '/cadastro', label: 'Criar conta' }]
                ),
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', fontFamily: 'system-ui', color: 'rgba(245,237,216,0.7)', fontSize: '1.05rem', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid rgba(245,237,216,0.05)' }}>
                  {item.label}
                </Link>
              ))}
              {userName && (
                <button onClick={handleLogout}
                  style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: 'system-ui', color: '#B5581E', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 0.5rem' }}>
                  Sair
                </button>
              )}
              <Link href="/cardapio" className="btn-primary"
                style={{ display: 'flex', justifyContent: 'center', fontSize: '0.85rem', marginTop: '1rem' }}
                onClick={() => setMenuOpen(false)}>
                Pedir Agora
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div style={{ height: '72px' }} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
