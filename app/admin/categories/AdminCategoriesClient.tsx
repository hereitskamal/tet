'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Props {
  categories: Category[]
}

const emptyForm = {
  name: '',
  slug: '',
}

export default function AdminCategoriesClient({ categories }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditCategory(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (c: Category) => {
    setEditCategory(c)
    setForm({
      name: c.name,
      slug: c.slug,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = editCategory ? `/api/categories/${editCategory.id}` : '/api/categories'
    const method = editCategory ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      setShowForm(false)
      setLoading(false)
      router.refresh()
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to save category')
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category && category._count.products > 0) {
      alert('Cannot delete category with existing products')
      return
    }

    if (!confirm('Delete this category?')) return
    setDeletingId(id)

    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })

    if (response.ok) {
      setDeletingId(null)
      router.refresh()
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to delete category')
      setDeletingId(null)
    }
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">admin</p>
            <h1 className="text-display font-black lowercase tracking-tight">categories.</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-black text-[#e5e2e1] px-6 py-3 rounded-full text-sm lowercase tracking-[0.05em] font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            add category
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                {['name', 'slug', 'products', 'actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-[0.1em] uppercase text-[#777777] pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <motion.tr
                  key={c.id}
                  layout
                  className="border-b border-[#f3f3f4] hover:bg-[#f3f3f4] transition-colors"
                >
                  <td className="py-4 pr-4 font-medium lowercase">{c.name}</td>
                  <td className="py-4 pr-4 text-[#777777] lowercase">{c.slug}</td>
                  <td className="py-4 pr-4 text-[#777777]">{c._count.products}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 hover:bg-[#e2e2e2] rounded-full transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
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
                    {editCategory ? 'edit category' : 'new category'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#e2e2e2] rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { label: 'name', key: 'name', type: 'text', required: true },
                    { label: 'slug', key: 'slug', type: 'text', required: true },
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
                  >
                    {loading ? 'saving...' : editCategory ? 'update category' : 'create category'}
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