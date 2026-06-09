import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock, ArrowRight, Share2, MessageSquareShare } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0D0404' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="La Piadina" width={52} height={52} className="rounded-full" style={{ border: '1px solid rgba(181,88,30,0.3)' }} />
              <div>
                <p style={{ fontFamily: 'Georgia, serif', color: '#F5EDD8', fontSize: '1.2rem', fontWeight: 400 }}>La Piadina</p>
                <p className="eyebrow" style={{ color: '#B5581E', fontSize: '0.58rem', marginTop: '0.2rem' }}>Farm to Table</p>
              </div>
            </div>
            <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.35)', fontSize: '0.9rem', lineHeight: 1.85, maxWidth: '280px', marginBottom: '2rem' }}>
              Piadinas artesanais com ingredientes frescos, preparadas com paixão e entregues com rapidez.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="footer-social">
                <Share2 size={16} style={{ color: '#F5EDD8' }} />
              </a>
              <a href="#" aria-label="WhatsApp" className="footer-social">
                <MessageSquareShare size={16} style={{ color: '#F5EDD8' }} />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1.5rem', fontSize: '0.65rem' }}>Menu</p>
            <ul className="space-y-3">
              {[
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/clube', label: 'Clube Fidelidade' },
                { href: '/cadastro', label: 'Criar Conta' },
                { href: '/login', label: 'Entrar' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1.5rem', fontSize: '0.65rem' }}>Contato</p>
            <ul className="space-y-4">
              {[
                { Icon: Phone, text: '(00) 00000-0000' },
                { Icon: MapPin, text: 'Seu endereço aqui' },
                { Icon: Clock, text: 'Seg–Dom: 11h às 22h' },
              ].map(item => (
                <li key={item.text} className="flex items-start gap-3">
                  <item.Icon size={14} style={{ color: '#B5581E', marginTop: '0.15rem', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.45)', fontSize: '0.88rem' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1.5rem', fontSize: '0.65rem' }}>Peça Agora</p>
            <div style={{ background: '#8B2323', borderRadius: '0.75rem', padding: '1.75rem', boxShadow: '0 8px 32px rgba(139,35,35,0.25)' }}>
              <p style={{ fontFamily: 'Georgia, serif', color: '#F5EDD8', fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                Sua piadina pronta em até 45 min
              </p>
              <Link href="/cardapio"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F5EDD8', fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', marginTop: '1rem' }}>
                Ver cardápio <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(245,237,216,0.05)' }}>
        <div className="stripe-italy" />
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.2)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} La Piadina. Todos os direitos reservados.
          </p>
          <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.15)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            FARM TO TABLE · HANDCRAFTED WITH LOVE
          </p>
        </div>
      </div>
    </footer>
  )
}
