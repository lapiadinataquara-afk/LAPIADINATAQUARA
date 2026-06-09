'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, ShoppingBag, BookOpen, Gift, Users, LogOut, Menu, X, ChefHat, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/adm', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/adm/pedidos', label: 'Pedidos', Icon: ShoppingBag },
  { href: '/adm/cardapio', label: 'Cardápio', Icon: BookOpen },
  { href: '/adm/recompensas', label: 'Recompensas', Icon: Gift },
  { href: '/adm/clientes', label: 'Clientes', Icon: Users },
  { href: '/adm/configuracoes', label: 'Configurações', Icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pendente')
      .then(({ count }) => setPendingCount(count || 0))

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pendente')
          .then(({ count }) => setPendingCount(count || 0))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F0EDE8', fontFamily: 'system-ui, sans-serif' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#1A0A0A', minHeight: '100vh' }}>
        <div className="stripe-italy" />

        {/* Brand */}
        <div className="p-5 border-b" style={{ borderColor: 'rgba(245,237,216,0.08)' }}>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="La Piadina" width={40} height={40} className="rounded-full" />
            <div>
              <p style={{ color: '#F5EDD8', fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700 }}>La Piadina</p>
              <p style={{ color: '#B5581E', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: isActive(item) ? 'rgba(139,35,35,0.7)' : 'transparent',
                color: isActive(item) ? '#F5EDD8' : 'rgba(245,237,216,0.55)',
                fontSize: '0.9rem', fontWeight: isActive(item) ? 600 : 400,
                textDecoration: 'none',
              }}>
              <div className="flex items-center gap-3">
                <item.Icon size={18} />
                {item.label}
              </div>
              {item.href === '/adm/pedidos' && pendingCount > 0 && (
                <span style={{ background: '#8B2323', color: '#F5EDD8', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '999px', minWidth: '20px', textAlign: 'center' }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'rgba(245,237,216,0.08)' }}>
          <Link href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: 'rgba(245,237,216,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Ver Site ↗
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,237,216,0.4)', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 py-3 border-b" style={{ background: 'white', borderColor: '#EAD9B8' }}>
          <button className="lg:hidden p-2 rounded-lg" onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={22} style={{ color: '#1A0A0A' }} />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat size={18} style={{ color: '#8B2323' }} />
            <span style={{ fontWeight: 600, color: '#1A0A0A', fontSize: '0.9rem' }}>
              {NAV_ITEMS.find(i => isActive(i))?.label || 'Admin'}
            </span>
          </div>
          {pendingCount > 0 && (
            <Link href="/adm/pedidos"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#8B2323', color: '#F5EDD8', padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F5EDD8', display: 'inline-block' }} />
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Link>
          )}
          {pendingCount === 0 && <div style={{ width: '80px' }} />}
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
