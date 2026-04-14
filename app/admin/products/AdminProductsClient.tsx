'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import type { Product, Category } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Props {
  products: Product[]
  categories: Category[]
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAt: '',
  images: '',
  stock: '',
  featured: false,
  categoryId: '',
}

export default function AdminProductsClient({ products, categories }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: String(p.price),
      compareAt: p.compareAt ? String(p.compareAt) : '',
      images: p.images.join(', '),
      stock: String(p.stock),
      featured: p.featured,
      categoryId: p.categoryId,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...form,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      stock: parseInt(form.stock),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    }

    const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products'
    const method = editProduct ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">admin</p>
            <h1 className="text-display font-black lowercase tracking-tight">products.</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-black text-[#e5e2e1] px-6 py-3 rounded-full text-sm lowercase tracking-[0.05em] font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            add product
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                {['', 'name', 'category', 'price', 'stock', 'featured', 'actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-[0.1em] uppercase text-[#777777] pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <motion.tr
                  key={p.id}
                  layout
                  className="border-b border-[#f3f3f4] hover:bg-[#f3f3f4] transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className="w-12 h-12 bg-[#e2e2e2] rounded overflow-hidden">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-medium lowercase">{p.name}</td>
                  <td className="py-4 pr-4 text-[#777777] lowercase">{p.category?.name}</td>
                  <td className="py-4 pr-4 font-medium">{formatPrice(p.price)}</td>
                  <td className={`py-4 pr-4 ${p.stock < 5 ? 'text-[#ba1a1a]' : 'text-[#777777]'}`}>
                    {p.stock}
                  </td>
                  <td className="py-4 pr-4">
                    {p.featured ? (
                      <Check className="w-4 h-4 text-[#3b3d2b]" />
                    ) : (
                      <span className="text-[#c6c6c6]">—</span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 hover:bg-[#e2e2e2] rounded-full transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="p-2 hover:bg-[#ba1a1a]/10 rounded-full transition-colors text-[#ba1a1a] disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-[#f9f9f9] overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-black lowercase tracking-tight text-xl">
                    {editProduct ? 'edit product' : 'new product'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#e2e2e2] rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { label: 'name', key: 'name', type: 'text', required: true },
                    { label: 'slug', key: 'slug', type: 'text', required: true },
                    { label: 'price', key: 'price', type: 'number', required: true },
                    { label: 'compare at price', key: 'compareAt', type: 'number' },
                    { label: 'stock', key: 'stock', type: 'number', required: true },
                    { label: 'images (comma-separated urls)', key: 'images', type: 'text', required: true },
                  ].map(({ label, key, type, required }) => (
                    <div key={key}>
                      <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">{label}</label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={required}
                        className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-[#777777] mb-2 block">category</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      required
                      className="w-full bg-transparent border-b border-[#c6c6c6] focus:border-black pb-2 text-sm outline-none transition-colors"
                    >
                      <option value="">select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm lowercase text-[#777777]">featured product</label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
                  >
                    {loading ? 'saving...' : editProduct ? 'update product' : 'create product'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
