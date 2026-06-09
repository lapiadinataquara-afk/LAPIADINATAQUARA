import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'

async function getFeatured(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

export default async function FeaturedProducts() {
  const products = await getFeatured()

  if (products.length === 0) {
    return (
      <p style={{ fontFamily: 'system-ui', fontSize: '0.9rem', color: 'rgba(245,237,216,0.3)', textAlign: 'center', padding: '2rem' }}>
        Configure seu cardápio no painel administrativo.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <article key={product.id} className="product-card group" style={{ background: '#1A0A0A', border: '1px solid rgba(245,237,216,0.06)' }}>
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/2', background: '#0D0404' }}>
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/logo.png" alt="" width={56} height={56} style={{ opacity: 0.15 }} />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,4,4,0.7) 0%, transparent 55%)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div style={{ padding: '1.25rem 1.375rem 1.375rem' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#F5EDD8', lineHeight: 1.3, marginBottom: '0.4rem', fontWeight: 400 }}>
              {product.name}
            </h3>
            {product.description && (
              <p style={{ fontFamily: 'system-ui', fontSize: '0.8rem', color: 'rgba(245,237,216,0.38)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#B5581E', fontWeight: 700 }}>
                {formatCurrency(product.price)}
              </p>
              <AddToCartButton product={product} dark />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
