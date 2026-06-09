'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Star, User } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const count = useCartStore(s => s.getItemCount())

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'rgba(18,7,7,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245,237,216,0.07)' : 'none',
          transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18" style={{ height: '72px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/logo.png" alt="La Piadina" width={38} height={38}
              className="rounded-full object-cover"
              style={{ border: '1px solid rgba(181,88,30,0.3)', transition: 'transform 0.3s ease' }}
            />
            <div>
              <p style={{ fontFamily: 'Georgia, serif', color: '#F5EDD8', fontSize: '1.05rem', fontWeight: 400, lineHeight: 1, letterSpacing: '0.01em' }}>
                La Piadina
              </p>
              <p className="eyebrow" style={{ color: '#B5581E', fontSize: '0.58rem', marginTop: '0.15rem' }}>
                Farm to Table
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: '/cardapio', label: 'Cardápio' },
              { href: '/clube', label: 'Clube', icon: <Star size={12} style={{ color: '#B5581E' }} /> },
              { href: '/login', label: 'Entrar', icon: <User size={12} /> },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-1.5 group relative"
                style={{ fontFamily: 'system-ui', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245,237,216,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
                {item.icon}
                {item.label}
                <span style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '1px', background: '#B5581E', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s ease' }}
                  className="group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center"
              style={{ width: '44px', height: '44px', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.07)', border: '1px solid rgba(245,237,216,0.1)', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,237,216,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,237,216,0.07)' }}
              aria-label="Carrinho"
            >
              <ShoppingCart size={18} style={{ color: '#F5EDD8' }} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#B5581E', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700, fontFamily: 'system-ui',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #120707',
                }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Order CTA — desktop only */}
            <Link href="/cardapio" className="hidden md:flex btn-primary" style={{ fontSize: '0.78rem', padding: '0.65rem 1.25rem' }}>
              Pedir Agora
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden flex items-center justify-center"
              style={{ width: '44px', height: '44px', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.07)', border: '1px solid rgba(245,237,216,0.1)', cursor: 'pointer' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} style={{ color: '#F5EDD8' }} /> : <Menu size={18} style={{ color: '#F5EDD8' }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#1A0A0A', borderTop: '1px solid rgba(245,237,216,0.06)', padding: '1.5rem 1.5rem 2rem' }}>
            <div className="space-y-4 max-w-7xl mx-auto">
              {[
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/clube', label: 'Clube Fidelidade' },
                { href: '/login', label: 'Entrar' },
                { href: '/cadastro', label: 'Criar conta' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', fontFamily: 'system-ui', color: 'rgba(245,237,216,0.7)', fontSize: '1.05rem', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid rgba(245,237,216,0.05)' }}>
                  {item.label}
                </Link>
              ))}
              <Link href="/cardapio" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.85rem', marginTop: '1rem' }} onClick={() => setMenuOpen(false)}>
                Pedir Agora
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div style={{ height: '72px' }} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
