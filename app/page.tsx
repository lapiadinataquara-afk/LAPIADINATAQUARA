import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { ShoppingBag, Star, Truck, Award, Users, ArrowRight, Leaf, MapPin, Clock, ChefHat, Heart } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedProducts from '@/components/FeaturedProducts'

/* ─── BANDEIRAS ─── */
function FlagBadge({ flag, label }: { flag: 'IT' | 'BR'; label: string }) {
  const colors = flag === 'IT'
    ? ['#009246', '#fff', '#CE2B37']
    : ['#009C3B', '#FFDF00', '#002776']
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.85rem', borderRadius: '999px', background: 'rgba(245,237,216,0.06)', border: '1px solid rgba(245,237,216,0.12)' }}>
      <div style={{ display: 'flex', width: '18px', height: '13px', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
        {colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
      </div>
      <span className="eyebrow" style={{ color: 'rgba(245,237,216,0.65)', fontSize: '0.62rem' }}>{label}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div style={{ background: '#0E0606', minHeight: '100vh' }}>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — EDITORIAL FULL SCREEN
      ══════════════════════════════════════ */}
      <section style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Noise */}
        <div className="hero-noise" />

        {/* Gradientes decorativos */}
        <div className="deco-circle" style={{ width: '600px', height: '600px', top: '-200px', right: '-150px', opacity: 0.08, background: 'radial-gradient(circle, #CE2B37 0%, transparent 70%)' }} />
        <div className="deco-circle" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', opacity: 0.07, background: 'radial-gradient(circle, #009246 0%, transparent 70%)' }} />
        <div className="deco-circle" style={{ width: '300px', height: '300px', top: '30%', left: '30%', opacity: 0.04, background: 'radial-gradient(circle, #FFDF00 0%, transparent 70%)' }} />

        {/* Linha decorativa lateral esquerda */}
        <div className="deco-line hidden lg:block" style={{ left: '5%', top: '10%', bottom: '10%' }} />

        <div className="max-w-6xl mx-auto px-6 w-full py-32 text-center">

          {/* Países */}
          <div className="flex items-center justify-center gap-3 mb-10 anim-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <FlagBadge flag="IT" label="Itália" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(245,237,216,0.25)', fontFamily: 'system-ui', fontSize: '0.65rem' }}>
              <Heart size={10} style={{ color: '#B5581E' }} />
            </div>
            <FlagBadge flag="BR" label="Brasil" />
          </div>

          {/* Título editorial */}
          <div className="anim-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1.5rem', letterSpacing: '0.25em' }}>
              — Autêntica Cozinha Italiana —
            </p>
            <h1 className="display-xl" style={{ color: '#F5EDD8', marginBottom: '0.2rem' }}>La</h1>
            <h1 className="display-xl" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(245,237,216,0.2)', marginBottom: '0.2rem' }}>Piadina</h1>
            <h1 className="display-xl" style={{ color: '#B5581E' }}>Taquara</h1>
          </div>

          {/* Linha dupla das bandeiras */}
          <div className="flex justify-center my-8 anim-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <div style={{ width: '120px' }}>
              <div className="stripe-italy mb-1" />
              <div className="stripe-brasil" />
            </div>
          </div>

          {/* Subtítulo */}
          <div className="anim-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.45)', fontSize: 'clamp(0.95rem,2vw,1.1rem)', maxWidth: '480px', lineHeight: 1.9, margin: '0 auto 3rem' }}>
              Piadinas artesanais com ingredientes frescos selecionados.<br />
              A tradição italiana no coração do Rio Grande do Sul.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 anim-up" style={{ animationDelay: '0.65s', opacity: 0 }}>
            <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.82rem', padding: '1rem 2.25rem' }}>
              <ShoppingBag size={15} /> Fazer Pedido
            </Link>
            <Link href="/clube" className="btn-ghost" style={{ fontSize: '0.82rem', padding: '1rem 2.25rem' }}>
              <Star size={15} /> Clube Fidelidade
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-20 anim-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
            {[
              { num: '2.500+', label: 'Clientes satisfeitos' },
              { num: '20+',    label: 'Sabores exclusivos'   },
              { num: '4.9★',   label: 'Avaliação média'      },
              { num: '45min',  label: 'Entrega rápida'        },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p className="stat-number" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: '#F5EDD8' }}>{s.num}</p>
                <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.3)', marginTop: '0.3rem', fontSize: '0.6rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.18)', fontSize: '0.55rem', letterSpacing: '0.2em' }}>scroll</p>
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, rgba(245,237,216,0.15), transparent)' }} />
        </div>
      </section>

      {/* ── MARQUEE DUPLO ── */}
      <div style={{ borderTop: '1px solid rgba(245,237,216,0.05)', borderBottom: '1px solid rgba(245,237,216,0.05)' }}>
        <div style={{ background: '#8B2323', padding: '0.8rem 0', overflow: 'hidden' }}>
          <div className="marquee-track">
            {Array(10).fill(['🇮🇹 Itália', '·', 'Massa Artesanal', '·', '🇧🇷 Brasil', '·', 'Farm to Table', '·', 'Ingredientes Frescos', '·', 'Entrega Rápida', '·', 'Clube Fidelidade', '·']).flat().map((t, i) => (
              <span key={i} className="eyebrow" style={{ color: 'rgba(245,237,216,0.75)', padding: '0 1.5rem', letterSpacing: '0.15em', flexShrink: 0 }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="stripe-duo" />
      </div>

      {/* ══════════════════════════════════════
          ORIGEM — ITÁLIA ENCONTRA O BRASIL
      ══════════════════════════════════════ */}
      <section style={{ background: '#F5EDD8', padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <div className="max-w-5xl mx-auto text-center">

          {/* Bandeiras centralizadas */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Mini bandeira Itália */}
            <div style={{ display: 'flex', width: '36px', height: '26px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }}>
              {['#009246', '#ffffff', '#CE2B37'].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(18,7,7,0.15)' }} />
            <Heart size={16} style={{ color: '#8B2323' }} />
            <div style={{ width: '40px', height: '1px', background: 'rgba(18,7,7,0.15)' }} />
            {/* Mini bandeira Brasil */}
            <div style={{ display: 'flex', width: '36px', height: '26px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }}>
              {['#009C3B', '#FFDF00', '#002776'].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
          </div>

          <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1rem', letterSpacing: '0.2em' }}>Nossa Origem</p>
          <h2 className="display-md" style={{ color: '#120707', marginBottom: '0.5rem' }}>
            A alma da Romagna
          </h2>
          <h2 className="display-md" style={{ color: '#8B2323', marginBottom: '0' }}>
            no coração gaúcho
          </h2>

          <div className="section-divider-duo" />

          <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1.05rem', lineHeight: 1.9, maxWidth: '580px', margin: '0 auto 1.5rem' }}>
            A piadina nasceu na região da Romagna, no norte da Itália — um pão achatado humilde e delicioso, vendido pelas <em>piadinare</em> nas ruas de Rímini há séculos.
          </p>
          <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1.05rem', lineHeight: 1.9, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            No Brasil, em Taquara/RS, trouxemos essa tradição com ingredientes locais frescos e o calor da cultura gaúcha. Uma fusão única entre dois países apaixonados por boa comida.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.83rem' }}>
              Ver Cardápio Completo <ArrowRight size={15} />
            </Link>
            <Link href="/clube" className="btn-secondary" style={{ fontSize: '0.83rem' }}>
              Clube Fidelidade
            </Link>
          </div>

          {/* Selo visual */}
          <div className="flex items-center justify-center gap-6 mt-16">
            <div style={{ textAlign: 'center', padding: '1.5rem 2rem', borderRadius: '1rem', background: 'white', border: '1px solid rgba(234,217,184,0.8)', boxShadow: '0 4px 24px rgba(18,7,7,0.06)' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#8B2323', fontWeight: 700, lineHeight: 1 }}>10+</p>
              <p className="eyebrow" style={{ color: '#9B9B9B', marginTop: '0.3rem', fontSize: '0.6rem' }}>Anos de tradição</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem 2rem', borderRadius: '1rem', background: '#8B2323', boxShadow: '0 8px 32px rgba(139,35,35,0.3)' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#F5EDD8', fontWeight: 700, lineHeight: 1 }}>100%</p>
              <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.6)', marginTop: '0.3rem', fontSize: '0.6rem' }}>Artesanal</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem 2rem', borderRadius: '1rem', background: 'white', border: '1px solid rgba(234,217,184,0.8)', boxShadow: '0 4px 24px rgba(18,7,7,0.06)' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#5C7A2C', fontWeight: 700, lineHeight: 1 }}>20+</p>
              <p className="eyebrow" style={{ color: '#9B9B9B', marginTop: '0.3rem', fontSize: '0.6rem' }}>Sabores únicos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIFERENCIAIS — GRADE 4 COL
      ══════════════════════════════════════ */}
      <section style={{ background: '#120707', padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1rem' }}>Por que La Piadina?</p>
            <h2 className="display-md" style={{ color: '#F5EDD8' }}>Qualidade em cada detalhe</h2>
            <div className="section-divider-duo" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: 'rgba(245,237,216,0.05)', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid rgba(245,237,216,0.05)' }}>
            {[
              { Icon: Leaf,     title: 'Farm to Table',    desc: 'Ingredientes frescos de produtores locais gaúchos, sem intermediários.', n: '01' },
              { Icon: Truck,    title: 'Entrega Rápida',   desc: 'Piadina quente na sua porta em até 45 minutos.', n: '02' },
              { Icon: Star,     title: 'Clube Fidelidade', desc: 'R$1 = 100 pontos. Suba de nível e ganhe recompensas exclusivas.', n: '03' },
              { Icon: Users,    title: 'Indique & Ganhe',  desc: 'Cada amigo indicado te rende 500 pontos bônus na hora.', n: '04' },
            ].map(item => (
              <div key={item.title} className="diff-card text-center"
                style={{ padding: 'clamp(2.5rem,5vw,3.5rem) clamp(1.5rem,3vw,2.5rem)', background: '#120707', transition: 'background 0.3s ease' }}>
                <p className="eyebrow" style={{ color: 'rgba(181,88,30,0.4)', marginBottom: '1.5rem' }}>{item.n}</p>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(181,88,30,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <item.Icon size={22} style={{ color: '#B5581E' }} />
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#F5EDD8', marginBottom: '0.75rem', fontWeight: 400 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.35)', fontSize: '0.84rem', lineHeight: 1.8 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESTAQUES DO CARDÁPIO
      ══════════════════════════════════════ */}
      <section style={{ background: '#0E0606', padding: 'clamp(5rem,10vw,10rem) 1.5rem', borderTop: '1px solid rgba(245,237,216,0.04)' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
            <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1rem' }}>Mais Pedidos</p>
            <h2 className="display-md" style={{ color: '#F5EDD8' }}>Destaques da casa</h2>
            <div className="section-divider-duo" />
            <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.35)', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
              As piadinas mais amadas pelos nossos clientes
            </p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(n => (
                <div key={n} style={{ borderRadius: '1rem', overflow: 'hidden', background: '#1A0A0A', border: '1px solid rgba(245,237,216,0.05)', height: '320px' }} />
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/cardapio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(245,237,216,0.4)', fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
              Ver cardápio completo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLUBE FIDELIDADE
      ══════════════════════════════════════ */}
      <section style={{ background: '#F5EDD8', padding: 'clamp(5rem,10vw,10rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(139,35,35,0.04)', pointerEvents: 'none' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="eyebrow" style={{ color: '#5C7A2C' }}>✦</span>
            <p className="eyebrow" style={{ color: '#5C7A2C', letterSpacing: '0.2em' }}>Programa de Fidelidade</p>
            <span className="eyebrow" style={{ color: '#5C7A2C' }}>✦</span>
          </div>

          <h2 className="display-md" style={{ color: '#120707', marginBottom: '0.4rem' }}>Clube</h2>
          <h2 className="display-md" style={{ color: '#8B2323' }}>La Piadina</h2>
          <div className="section-divider-duo" />

          <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1.05rem', lineHeight: 1.9, maxWidth: '520px', margin: '0 auto 3.5rem' }}>
            Cada real gasto vira ponto. Cada amigo indicado vira bônus. Sobe de nível e resgata descontos, frete grátis e produtos gratuitos.
          </p>

          {/* Tiers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {[
              { icon: '🥉', name: 'Bronze',   pts: '0 – 4.999 pts',    color: '#CD7F32', mult: '1×'   },
              { icon: '🥈', name: 'Prata',    pts: '5.000 – 14.999',   color: '#9E9E9E', mult: '1,25×' },
              { icon: '🥇', name: 'Ouro',     pts: '15.000 – 29.999',  color: '#D4AF37', mult: '1,5×'  },
              { icon: '💎', name: 'Diamante', pts: '30.000+ pts',       color: '#00BFFF', mult: '2×'   },
            ].map(tier => (
              <div key={tier.name} style={{ padding: '1.5rem 1rem', borderRadius: '1rem', background: 'white', border: '1px solid rgba(234,217,184,0.8)', boxShadow: '0 4px 20px rgba(18,7,7,0.05)', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{tier.icon}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: tier.color, fontWeight: 700 }}>{tier.name}</p>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.7rem', color: '#9B9B9B', margin: '0.3rem 0' }}>{tier.pts}</p>
                <p style={{ fontFamily: 'system-ui', fontSize: '0.72rem', color: tier.color, fontWeight: 700, background: `${tier.color}14`, padding: '0.2rem 0.6rem', borderRadius: '999px', display: 'inline-block' }}>
                  {tier.mult} pontos
                </p>
              </div>
            ))}
          </div>

          {/* Cards de earning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { pts: '100 pts', label: 'por R$1 gasto', Icon: ShoppingBag, color: '#8B2323' },
              { pts: '500 pts', label: 'por indicação',  Icon: Users,      color: '#5C7A2C' },
              { pts: '1.000 pts', label: 'no aniversário', Icon: Award,   color: '#B5581E' },
            ].map(item => (
              <div key={item.label} style={{ padding: '1.5rem', borderRadius: '1rem', background: 'white', border: '1px solid rgba(234,217,184,0.8)', boxShadow: '0 4px 20px rgba(18,7,7,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.Icon size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: item.color, fontWeight: 700, lineHeight: 1 }}>{item.pts}</p>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#9B9B9B', marginTop: '0.2rem' }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/cadastro" className="btn-primary" style={{ fontSize: '0.85rem', padding: '1.1rem 2.5rem' }}>
            Entrar no Clube Grátis <ArrowRight size={15} />
          </Link>
          <p style={{ fontFamily: 'system-ui', fontSize: '0.78rem', color: '#9B9B9B', marginTop: '1rem' }}>
            Cadastro gratuito. Pontos acumulam automaticamente.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════ */}
      <section style={{ background: '#120707', padding: 'clamp(5rem,10vw,10rem) 1.5rem' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow" style={{ color: '#B5581E', marginBottom: '1rem', letterSpacing: '0.2em' }}>Simples assim</p>
          <h2 className="display-md" style={{ color: '#F5EDD8' }}>Como fazer seu pedido</h2>
          <div className="section-divider-duo" />

          <div className="grid grid-cols-1 md:grid-cols-3 mt-4" style={{ gap: '1px', background: 'rgba(245,237,216,0.06)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(245,237,216,0.05)' }}>
            {[
              { n: '01', Icon: ShoppingBag, title: 'Escolha',  desc: 'Navegue pelo cardápio e monte seu pedido do jeito que você preferir.' },
              { n: '02', Icon: ChefHat,     title: 'Pague',    desc: 'PIX com aprovação imediata ou cartão/dinheiro na entrega.' },
              { n: '03', Icon: Star,        title: 'Aproveite', desc: 'Receba em casa e acumule pontos no Clube La Piadina.' },
            ].map((step) => (
              <div key={step.n} className="diff-card text-center"
                style={{ padding: 'clamp(2.5rem,5vw,3.5rem) clamp(1.5rem,3vw,2rem)', background: '#120707', transition: 'background 0.3s ease' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '4rem', color: 'rgba(181,88,30,0.08)', lineHeight: 1, marginBottom: '1rem' }}>{step.n}</p>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(181,88,30,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <step.Icon size={22} style={{ color: '#B5581E' }} />
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#F5EDD8', marginBottom: '0.75rem', fontWeight: 400 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.35)', fontSize: '0.86rem', lineHeight: 1.8, maxWidth: '240px', margin: '0 auto' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.85rem', padding: '1.1rem 2.5rem' }}>
              Fazer Pedido Agora <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO BAR
      ══════════════════════════════════════ */}
      <section style={{ background: '#8B2323', padding: 'clamp(2.5rem,5vw,4rem) 1.5rem' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.5)', marginBottom: '2rem', letterSpacing: '0.2em' }}>Informações</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[
              { Icon: Clock,  title: 'Horário',          info: 'Seg–Dom: 11h às 22h' },
              { Icon: MapPin, title: 'Área de entrega',  info: 'Taquara/RS e região'  },
              { Icon: Truck,  title: 'Tempo médio',      info: '30–45 minutos'        },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245,237,216,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <item.Icon size={18} style={{ color: '#F5EDD8' }} />
                </div>
                <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.45)', marginBottom: '0.3rem', fontSize: '0.58rem' }}>{item.title}</p>
                <p style={{ fontFamily: 'system-ui', color: '#F5EDD8', fontWeight: 700, fontSize: '0.95rem' }}>{item.info}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/cardapio" className="btn-ghost" style={{ fontSize: '0.82rem', padding: '0.9rem 2rem' }}>
              Pedir Agora <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
