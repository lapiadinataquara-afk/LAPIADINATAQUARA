import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { ShoppingBag, Star, Truck, Award, Users, ArrowRight, Leaf, MapPin, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedProducts from '@/components/FeaturedProducts'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full" style={{ background: '#120707' }}>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero-bg relative" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '5rem' }}>
        <div className="hero-noise" />
        <div className="deco-circle" style={{ width: '500px', height: '500px', top: '-150px', right: '-80px', opacity: 0.1, background: 'radial-gradient(circle, #B5581E 0%, transparent 70%)' }} />
        <div className="deco-circle" style={{ width: '350px', height: '350px', bottom: '0', left: '-100px', opacity: 0.07, background: 'radial-gradient(circle, #5C7A2C 0%, transparent 70%)' }} />
        <div className="deco-line hidden lg:block" style={{ left: '8%', top: '15%', bottom: '10%' }} />
        <div className="deco-line hidden lg:block" style={{ right: '8%', top: '20%', bottom: '15%' }} />

        {/* Logo centralizado no topo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center anim-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <Image src="/logo.png" alt="La Piadina" width={90} height={90}
            className="rounded-full"
            style={{ border: '2px solid rgba(181,88,30,0.3)' }}
          />
          <div className="stripe-italy mt-3" style={{ width: '50px', borderRadius: '2px' }} />
        </div>

        {/* Conteúdo principal — centralizado no mobile, esquerda no desktop */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl text-center lg:text-left mx-auto lg:mx-0">

            <div className="anim-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <span className="eyebrow inline-flex items-center justify-center lg:justify-start gap-2 mb-8" style={{ color: '#B5581E' }}>
                <span className="hidden lg:inline-block" style={{ width: '32px', height: '1px', background: '#B5581E' }} />
                Autêntica Cozinha Italiana
              </span>
            </div>

            <div className="anim-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
              <h1 className="display-xl" style={{ color: '#F5EDD8', marginBottom: '0.3rem' }}>La</h1>
              <h1 className="display-xl" style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(245,237,216,0.35)', marginBottom: '0.3rem' }}>Piadina</h1>
              <h1 className="display-xl" style={{ color: '#B5581E' }}>Delivery</h1>
            </div>

            <div className="anim-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.5)', fontSize: 'clamp(0.95rem,2vw,1.1rem)', maxWidth: '440px', lineHeight: 1.85, margin: '2rem auto 2.5rem', textAlign: 'inherit' }} className="lg:mx-0">
                Piadinas artesanais com ingredientes frescos, direto do campo à sua mesa. Farm to table de verdade.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start anim-up" style={{ animationDelay: '0.75s', opacity: 0 }}>
              <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.85rem', padding: '1rem 2rem' }}>
                <ShoppingBag size={16} /> Pedir Agora
              </Link>
              <Link href="/clube" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '1rem 2rem' }}>
                <Star size={16} /> Clube Fidelidade
              </Link>
            </div>
          </div>
        </div>

        {/* Stats — centralizados no mobile */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-14">
          <div className="flex gap-8 flex-wrap justify-center lg:justify-start">
            {[
              { num: '2.500+', label: 'Clientes' },
              { num: '20+', label: 'Sabores' },
              { num: '4.9★', label: 'Avaliação' },
              { num: '45min', label: 'Entrega' },
            ].map((s, i) => (
              <div key={s.label} className="text-center lg:text-left anim-up" style={{ animationDelay: `${0.9 + i * 0.1}s`, opacity: 0 }}>
                <p className="stat-number" style={{ fontSize: '1.9rem' }}>{s.num}</p>
                <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.35)', marginTop: '0.2rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator — só desktop */}
        <div className="absolute bottom-6 right-8 hidden lg:flex flex-col items-center gap-2 anim-in" style={{ animationDelay: '1.2s', opacity: 0 }}>
          <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.2)', writingMode: 'vertical-rl', letterSpacing: '0.15em' }}>scroll</p>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(245,237,216,0.15), transparent)' }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: '#8B2323', padding: '0.875rem 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          {Array(8).fill(['Piadina Artesanal', '·', 'Farm to Table', '·', 'Ingredientes Frescos', '·', 'Entrega Rápida', '·', 'Clube Fidelidade', '·']).flat().map((t, i) => (
            <span key={i} className="eyebrow" style={{ color: 'rgba(245,237,216,0.8)', padding: '0 1.25rem', letterSpacing: '0.12em', flexShrink: 0 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SOBRE
      ══════════════════════════════════════ */}
      <section style={{ background: '#F5EDD8', padding: 'clamp(4rem,8vw,8rem) 1.5rem' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Texto — centralizado no mobile */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="eyebrow inline-flex items-center justify-center lg:justify-start gap-3 mb-6" style={{ color: '#B5581E' }}>
              <span className="hidden lg:inline-block" style={{ width: '40px', height: '1px', background: '#B5581E' }} />
              Nossa História
            </p>
            <h2 className="display-md mb-4" style={{ color: '#120707' }}>
              A arte da piadina<br />
              <span style={{ color: '#8B2323' }}>feita com alma.</span>
            </h2>
            <div className="section-divider section-divider-center lg:mx-0" />
            <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.25rem', maxWidth: '480px', margin: '0 auto 1.25rem' }} className="lg:mx-0">
              Cada piadina é preparada na hora, com massa artesanal e ingredientes selecionados diretamente de produtores locais.
            </p>
            <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1rem', lineHeight: 1.85, marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }} className="lg:mx-0">
              Do campo à sua mesa, respeitando cada etapa do processo com cuidado e paixão.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Ver Cardápio Completo <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-1 lg:order-2 mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative overflow-hidden" style={{ borderRadius: '1.25rem', aspectRatio: '4/5', background: 'linear-gradient(135deg, #1A0A0A 0%, #3D1515 100%)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/logo.png" alt="La Piadina" width={180} height={180} className="anim-float" style={{ opacity: 0.9 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <div style={{ background: 'rgba(245,237,216,0.08)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '1rem 1.25rem', border: '1px solid rgba(245,237,216,0.1)' }}>
                  <p style={{ fontFamily: 'Georgia, serif', color: '#F5EDD8', fontSize: '1rem', fontWeight: 700 }}>Farm to Table</p>
                  <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.6)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Ingredientes frescos • Sem conservantes</p>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: '#8B2323', borderRadius: '0.75rem', padding: '1rem 1.25rem', width: '120px', boxShadow: '0 8px 32px rgba(139,35,35,0.35)' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#F5EDD8', fontWeight: 700, lineHeight: 1 }}>20+</p>
              <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.7)', marginTop: '0.3rem', fontSize: '0.6rem' }}>Sabores únicos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIFERENCIAIS
      ══════════════════════════════════════ */}
      <section style={{ background: '#120707', padding: 'clamp(4rem,8vw,8rem) 1.5rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <p className="eyebrow mb-3" style={{ color: '#B5581E' }}>Por que La Piadina?</p>
            <h2 className="display-md" style={{ color: '#F5EDD8' }}>Qualidade em cada detalhe</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(245,237,216,0.06)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(245,237,216,0.06)' }}>
            {[
              { Icon: Leaf,  title: 'Farm to Table',    desc: 'Ingredientes frescos de produtores locais, sem intermediários.', n: '01' },
              { Icon: Truck, title: 'Delivery Rápido',  desc: 'Entrega ágil para você aproveitar quente, saboroso e na hora certa.', n: '02' },
              { Icon: Star,  title: 'Clube Fidelidade', desc: 'Acumule pontos e troque por descontos e produtos gratuitos.', n: '03' },
              { Icon: Users, title: 'Indique & Ganhe',  desc: 'Indique amigos, eles compram e você recebe pontos bônus na hora.', n: '04' },
            ].map(item => (
              <div key={item.title} className="diff-card text-center sm:text-left"
                style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,3vw,2.5rem)', background: '#120707', transition: 'background 0.3s ease' }}>
                <p className="eyebrow mb-6" style={{ color: 'rgba(181,88,30,0.5)' }}>{item.n}</p>
                <item.Icon size={26} style={{ color: '#B5581E', marginBottom: '1.25rem' }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#F5EDD8', marginBottom: '0.75rem', fontWeight: 400 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.38)', fontSize: '0.86rem', lineHeight: 1.75 }}>
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
      <section style={{ background: '#120707', padding: 'clamp(4rem,8vw,8rem) 1.5rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="text-center sm:text-left">
              <p className="eyebrow mb-3" style={{ color: '#B5581E' }}>Mais Pedidos</p>
              <h2 className="display-md" style={{ color: '#F5EDD8' }}>Destaques da casa</h2>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Link href="/cardapio"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(245,237,216,0.45)', fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver cardápio completo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(n => (
                <div key={n} style={{ borderRadius: '1rem', overflow: 'hidden', background: '#1A0A0A', border: '1px solid rgba(245,237,216,0.06)' }}>
                  <div style={{ height: '200px', background: '#0D0404' }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ height: '16px', background: 'rgba(245,237,216,0.05)', borderRadius: '4px', width: '65%' }} />
                    <div style={{ height: '12px', background: 'rgba(245,237,216,0.03)', borderRadius: '4px', width: '85%' }} />
                  </div>
                </div>
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLUBE FIDELIDADE
      ══════════════════════════════════════ */}
      <section style={{ background: '#F5EDD8', padding: 'clamp(4rem,8vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(139,35,35,0.04)', border: '1px solid rgba(139,35,35,0.07)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Texto — centralizado no mobile */}
            <div className="text-center lg:text-left">
              <p className="eyebrow inline-flex items-center justify-center lg:justify-start gap-3 mb-6" style={{ color: '#5C7A2C' }}>
                <span className="hidden lg:inline-block" style={{ width: '40px', height: '1px', background: '#5C7A2C' }} />
                Programa de Fidelidade
              </p>
              <h2 className="display-md mb-4" style={{ color: '#120707' }}>
                Clube<br /><span style={{ color: '#8B2323' }}>La Piadina</span>
              </h2>
              <div className="section-divider section-divider-center lg:mx-0" style={{ background: '#5C7A2C' }} />
              <p style={{ fontFamily: 'system-ui', color: '#6B6B6B', fontSize: '1rem', lineHeight: 1.85, maxWidth: '440px', margin: '0 auto 2.5rem' }} className="lg:mx-0">
                Cada real gasto vira pontos. Cada amigo indicado vira bônus. Troque por descontos, produtos grátis e muito mais.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link href="/cadastro" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                  Entrar no Clube Grátis <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Cards de pontos */}
            <div className="space-y-3">
              {[
                { label: 'Por R$1,00 gasto', pts: '100 pts', Icon: ShoppingBag, color: '#8B2323' },
                { label: 'Por indicação confirmada', pts: '500 pts', Icon: Users, color: '#5C7A2C' },
                { label: 'Bônus de aniversário', pts: '1.000 pts', Icon: Award, color: '#B5581E' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-xl"
                  style={{ background: '#fff', border: '1px solid rgba(234,217,184,0.8)', boxShadow: '0 2px 12px rgba(18,7,7,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}12` }}>
                      <item.Icon size={18} style={{ color: item.color }} />
                    </div>
                    <p style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#6B6B6B' }}>{item.label}</p>
                  </div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: item.color, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {item.pts}
                  </p>
                </div>
              ))}
              {/* CTA card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl"
                style={{ background: '#8B2323', boxShadow: '0 8px 32px rgba(139,35,35,0.3)' }}>
                <div>
                  <p className="eyebrow mb-1" style={{ color: 'rgba(245,237,216,0.6)', fontSize: '0.62rem' }}>Comece a resgatar</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#F5EDD8' }}>A partir de 1.000 pontos</p>
                </div>
                <Link href="/clube" style={{ background: 'rgba(245,237,216,0.12)', border: '1px solid rgba(245,237,216,0.2)', color: '#F5EDD8', padding: '0.7rem 1.25rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Ver Prêmios <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════ */}
      <section style={{ background: '#120707', padding: 'clamp(4rem,8vw,8rem) 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <p className="eyebrow mb-3" style={{ color: '#B5581E' }}>Simples assim</p>
            <h2 className="display-md" style={{ color: '#F5EDD8' }}>Como fazer seu pedido</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: '01', title: 'Escolha', desc: 'Navegue pelo cardápio e monte seu pedido do jeito que preferir.' },
              { n: '02', title: 'Pague', desc: 'PIX com aprovação imediata ou cartão/dinheiro na entrega.' },
              { n: '03', title: 'Aproveite', desc: 'Receba em casa e acumule pontos no Clube La Piadina.' },
            ].map((step, i) => (
              <div key={step.n} className="text-center md:text-left"
                style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,3vw,2rem)', borderTop: '1px solid rgba(245,237,216,0.06)', borderLeft: i > 0 ? '0' : undefined }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', color: 'rgba(181,88,30,0.1)', lineHeight: 1, marginBottom: '1.25rem' }}>
                  {step.n}
                </p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#F5EDD8', marginBottom: '0.75rem', fontWeight: 400 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.38)', fontSize: '0.88rem', lineHeight: 1.75, maxWidth: '260px', margin: '0 auto' }} className="md:mx-0">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/cardapio" className="btn-primary" style={{ fontSize: '0.85rem', padding: '1rem 2.5rem' }}>
              Fazer Pedido Agora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO BAR
      ══════════════════════════════════════ */}
      <section style={{ background: '#8B2323', padding: '3rem 1.5rem' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-between gap-6 lg:gap-8">
          {[
            { Icon: Clock, title: 'Horário', info: 'Seg–Dom: 11h às 22h' },
            { Icon: MapPin, title: 'Área de entrega', info: 'Consulte disponibilidade' },
            { Icon: Truck, title: 'Tempo médio', info: '30–45 minutos' },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3 text-left">
              <div style={{ width: '42px', height: '42px', borderRadius: '0.5rem', background: 'rgba(245,237,216,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.Icon size={18} style={{ color: '#F5EDD8' }} />
              </div>
              <div>
                <p className="eyebrow" style={{ color: 'rgba(245,237,216,0.5)', marginBottom: '0.1rem', fontSize: '0.6rem' }}>{item.title}</p>
                <p style={{ fontFamily: 'system-ui', color: '#F5EDD8', fontWeight: 600, fontSize: '0.9rem' }}>{item.info}</p>
              </div>
            </div>
          ))}
          <Link href="/cardapio" className="btn-ghost" style={{ fontSize: '0.82rem', padding: '0.875rem 1.75rem' }}>
            Pedir Agora <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
