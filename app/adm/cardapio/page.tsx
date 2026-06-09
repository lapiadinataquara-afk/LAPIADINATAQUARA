'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, ImagePlus, GripVertical, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category, Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

type Tab = 'categorias' | 'produtos'

export default function AdminCardapioPage() {
  const [tab, setTab] = useState<Tab>('categorias')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCatForm, setShowCatForm] = useState(false)
  const [showProdForm, setShowProdForm] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [editProd, setEditProd] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [catForm, setCatForm] = useState({ name: '', description: '' })
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', category_id: '', image_url: '', featured: false })

  async function load() {
    const supabase = createClient()
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('order_index'),
      supabase.from('products').select('*').order('name'),
    ])
    if (catRes.data) setCategories(catRes.data)
    if (prodRes.data) setProducts(prodRes.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadImage(file: File, bucket: string): Promise<string | null> {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) { toast.error('Erro ao fazer upload.'); setUploading(false); return null }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    setUploading(false)
    return data.publicUrl
  }

  // ── Categories ──
  async function saveCategory() {
    const supabase = createClient()
    if (editCat) {
      await supabase.from('categories').update({ name: catForm.name, description: catForm.description }).eq('id', editCat.id)
      toast.success('Categoria atualizada!')
    } else {
      await supabase.from('categories').insert({ name: catForm.name, description: catForm.description, order_index: categories.length, active: true })
      toast.success('Categoria criada!')
    }
    setCatForm({ name: '', description: '' })
    setShowCatForm(false)
    setEditCat(null)
    load()
  }

  async function deleteCategory(id: string) {
    if (!confirm('Tem certeza? Produtos desta categoria ficarão sem categoria.')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    toast.success('Categoria removida.')
    load()
  }

  async function toggleCategoryActive(cat: Category) {
    const supabase = createClient()
    await supabase.from('categories').update({ active: !cat.active }).eq('id', cat.id)
    load()
  }

  // ── Products ──
  async function saveProduct() {
    const supabase = createClient()
    const data = {
      name: prodForm.name,
      description: prodForm.description,
      price: parseFloat(prodForm.price),
      category_id: prodForm.category_id,
      image_url: prodForm.image_url || null,
      featured: prodForm.featured,
      active: true,
    }
    if (editProd) {
      await supabase.from('products').update(data).eq('id', editProd.id)
      toast.success('Produto atualizado!')
    } else {
      await supabase.from('products').insert(data)
      toast.success('Produto criado!')
    }
    setProdForm({ name: '', description: '', price: '', category_id: '', image_url: '', featured: false })
    setShowProdForm(false)
    setEditProd(null)
    load()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Remover produto?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    toast.success('Produto removido.')
    load()
  }

  async function toggleProduct(prod: Product) {
    const supabase = createClient()
    await supabase.from('products').update({ active: !prod.active }).eq('id', prod.id)
    load()
  }

  async function handleProductImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file, 'produtos')
    if (url) setProdForm(p => ({ ...p, image_url: url }))
  }

  function openEditCat(cat: Category) {
    setEditCat(cat)
    setCatForm({ name: cat.name, description: cat.description || '' })
    setShowCatForm(true)
  }

  function openEditProd(prod: Product) {
    setEditProd(prod)
    setProdForm({
      name: prod.name, description: prod.description || '', price: prod.price.toString(),
      category_id: prod.category_id, image_url: prod.image_url || '', featured: prod.featured,
    })
    setShowProdForm(true)
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#8B2323' }}>Cardápio</h1>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: 'white' }}>
        {(['categorias', 'produtos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg transition-all text-sm font-medium"
            style={{ background: tab === t ? '#8B2323' : 'transparent', color: tab === t ? 'white' : '#6B6B6B', border: 'none', cursor: 'pointer' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Categories Tab ── */}
      {tab === 'categorias' && (
        <div className="space-y-4">
          <button onClick={() => { setEditCat(null); setCatForm({ name: '', description: '' }); setShowCatForm(true) }}
            className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>
            <Plus size={16} /> Nova Categoria
          </button>

          {showCatForm && (
            <div className="card p-5 space-y-4" style={{ border: '2px solid #8B2323' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0A0A' }}>
                {editCat ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <div>
                <label className="label">Nome *</label>
                <input className="input" value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Piadinas Clássicas" />
              </div>
              <div>
                <label className="label">Descrição</label>
                <input className="input" value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrição opcional..." />
              </div>
              <div className="flex gap-3">
                <button onClick={saveCategory} className="btn-primary" style={{ fontSize: '0.9rem' }}>Salvar</button>
                <button onClick={() => { setShowCatForm(false); setEditCat(null) }} className="btn-secondary" style={{ fontSize: '0.9rem' }}>Cancelar</button>
              </div>
            </div>
          )}

          {loading ? <p style={{ color: '#6B6B6B' }}>Carregando...</p> : categories.length === 0 ? (
            <p style={{ color: '#6B6B6B', fontStyle: 'italic' }}>Nenhuma categoria. Crie a primeira!</p>
          ) : (
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="card p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} style={{ color: '#EAD9B8' }} />
                    <div>
                      <p style={{ fontWeight: 700, color: '#1A0A0A', fontSize: '0.9rem' }}>{cat.name}</p>
                      {cat.description && <p style={{ fontSize: '0.78rem', color: '#6B6B6B' }}>{cat.description}</p>}
                      <p style={{ fontSize: '0.72rem', color: '#6B6B6B', marginTop: '0.1rem' }}>
                        {products.filter(p => p.category_id === cat.id).length} produto(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCategoryActive(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {cat.active
                        ? <ToggleRight size={24} style={{ color: '#5C7A2C' }} />
                        : <ToggleLeft size={24} style={{ color: '#EAD9B8' }} />}
                    </button>
                    <button onClick={() => openEditCat(cat)} className="p-2 rounded-lg" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                      <Pencil size={14} style={{ color: '#8B2323' }} />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={14} style={{ color: '#8B2323' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Products Tab ── */}
      {tab === 'produtos' && (
        <div className="space-y-4">
          <button onClick={() => { setEditProd(null); setProdForm({ name: '', description: '', price: '', category_id: '', image_url: '', featured: false }); setShowProdForm(true) }}
            className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>
            <Plus size={16} /> Novo Produto
          </button>

          {showProdForm && (
            <div className="card p-5 space-y-4" style={{ border: '2px solid #8B2323' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A0A0A' }}>
                {editProd ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Nome *</label>
                  <input className="input" value={prodForm.name} onChange={e => setProdForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Piadina Margherita" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Descrição</label>
                  <textarea className="input" value={prodForm.description} onChange={e => setProdForm(p => ({ ...p, description: e.target.value }))} placeholder="Ingredientes e descrição..." rows={2} style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="label">Preço *</label>
                  <input className="input" type="number" step="0.01" min="0" value={prodForm.price} onChange={e => setProdForm(p => ({ ...p, price: e.target.value }))} placeholder="0,00" />
                </div>
                <div>
                  <label className="label">Categoria *</label>
                  <select className="input" value={prodForm.category_id} onChange={e => setProdForm(p => ({ ...p, category_id: e.target.value }))} style={{ cursor: 'pointer' }}>
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Foto do produto</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleProductImage} className="hidden" />
                  <div className="flex items-center gap-3">
                    <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      <ImagePlus size={15} /> {uploading ? 'Enviando...' : 'Selecionar foto'}
                    </button>
                    {prodForm.image_url && (
                      <Image src={prodForm.image_url} alt="Preview" width={60} height={60} className="rounded-lg object-cover" />
                    )}
                  </div>
                  {prodForm.image_url && (
                    <input className="input mt-2" value={prodForm.image_url} onChange={e => setProdForm(p => ({ ...p, image_url: e.target.value }))} placeholder="Ou cole a URL da imagem" />
                  )}
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={prodForm.featured} onChange={e => setProdForm(p => ({ ...p, featured: e.target.checked }))} />
                  <label htmlFor="featured" style={{ fontFamily: 'system-ui', fontSize: '0.875rem', color: '#1A0A0A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={14} style={{ color: '#B5581E' }} /> Produto em destaque
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveProduct} disabled={!prodForm.name || !prodForm.price || !prodForm.category_id} className="btn-primary" style={{ fontSize: '0.9rem' }}>Salvar</button>
                <button onClick={() => { setShowProdForm(false); setEditProd(null) }} className="btn-secondary" style={{ fontSize: '0.9rem' }}>Cancelar</button>
              </div>
            </div>
          )}

          {loading ? <p style={{ color: '#6B6B6B' }}>Carregando...</p> : (
            <div className="space-y-3">
              {categories.map(cat => {
                const catProds = products.filter(p => p.category_id === cat.id)
                if (catProds.length === 0) return null
                return (
                  <div key={cat.id}>
                    <h3 style={{ fontFamily: 'Georgia, serif', color: '#8B2323', fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid #EAD9B8' }}>
                      {cat.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {catProds.map(prod => (
                        <div key={prod.id} className="card p-4 flex gap-3" style={{ opacity: prod.active ? 1 : 0.6 }}>
                          {prod.image_url && (
                            <Image src={prod.image_url} alt={prod.name} width={56} height={56} className="rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1A0A0A' }} className="truncate">{prod.name}</p>
                                <p style={{ fontWeight: 700, color: '#8B2323', fontSize: '0.9rem' }}>{formatCurrency(prod.price)}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => toggleProduct(prod)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                  {prod.active ? <ToggleRight size={20} style={{ color: '#5C7A2C' }} /> : <ToggleLeft size={20} style={{ color: '#EAD9B8' }} />}
                                </button>
                                <button onClick={() => openEditProd(prod)} className="p-1.5 rounded" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                                  <Pencil size={12} style={{ color: '#8B2323' }} />
                                </button>
                                <button onClick={() => deleteProduct(prod.id)} className="p-1.5 rounded" style={{ background: '#F5EDD8', border: 'none', cursor: 'pointer' }}>
                                  <Trash2 size={12} style={{ color: '#8B2323' }} />
                                </button>
                              </div>
                            </div>
                            {prod.featured && (
                              <span className="badge badge-red mt-1" style={{ fontSize: '0.65rem' }}>Destaque</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {products.length === 0 && (
                <p style={{ color: '#6B6B6B', fontStyle: 'italic', padding: '1rem' }}>
                  Nenhum produto. Crie categorias primeiro, depois adicione produtos.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
