'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/client'
import { Category, Product } from '@/lib/types'

export default function CardapioPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').eq('active', true).order('order_index'),
        supabase.from('products').select('*').eq('active', true).order('name'),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (prodRes.data) setProducts(prodRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category_id === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* Header */}
      <div className="hero-gradient py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="badge badge-red mb-3" style={{ background: 'rgba(181,88,30,0.2)', color: '#B5581E' }}>
            Farm to Table
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,5vw,3rem)', color: '#F5EDD8', marginBottom: '0.75rem' }}>
            Nosso Cardápio
          </h1>
          <p style={{ fontFamily: 'system-ui', color: 'rgba(245,237,216,0.7)', fontSize: '1rem' }}>
            Piadinas artesanais com ingredientes frescos selecionados
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'sticky', top: '64px', zIndex: 20 }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }} />
            <input
              className="input pl-9"
              placeholder="Buscar piadina..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Categories scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium"
              style={{
                fontFamily: 'system-ui',
                background: activeCategory === 'all' ? '#8B2323' : '#F5EDD8',
                color: activeCategory === 'all' ? 'white' : '#6B6B6B',
                border: 'none', cursor: 'pointer',
              }}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium"
                style={{
                  fontFamily: 'system-ui',
                  background: activeCategory === cat.id ? '#8B2323' : '#F5EDD8',
                  color: activeCategory === cat.id ? 'white' : '#6B6B6B',
                  border: 'none', cursor: 'pointer',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <main style={{ background: '#F5EDD8', flex: 1 }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="card animate-pulse">
                  <div style={{ height: '180px', background: '#EAD9B8' }} />
                  <div className="p-4 space-y-3">
                    <div style={{ height: '16px', background: '#EAD9B8', borderRadius: '4px', width: '70%' }} />
                    <div style={{ height: '12px', background: '#EAD9B8', borderRadius: '4px', width: '90%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#6B6B6B' }}>
                {products.length === 0
                  ? 'Cardápio ainda não configurado. Acesse o painel administrativo.'
                  : 'Nenhum produto encontrado.'}
              </p>
            </div>
          ) : (
            <>
              {/* Group by category if showing all */}
              {activeCategory === 'all' && search === '' ? (
                categories.map(cat => {
                  const catProducts = filtered.filter(p => p.category_id === cat.id)
                  if (catProducts.length === 0) return null
                  return (
                    <div key={cat.id} className="mb-12">
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#8B2323', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EAD9B8' }}>
                        {cat.name}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catProducts.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
