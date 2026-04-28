'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, ArrowLeft, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  category: string
  subcategory: string | null
  images: string
  stock: number
  featured: boolean
  createdAt: Date
}

export function AdminProductsClient({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const defaultForm = { name: '', description: '', price: '', comparePrice: '', category: 'hair-care', subcategory: 'dry-hair', images: '', stock: '100', featured: false }
  const [form, setForm] = useState(defaultForm)

  const openAdd = () => {
    setForm(defaultForm)
    setEditProduct(null)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    const imgs: string[] = JSON.parse(p.images || '[]')
    setForm({
      name: p.name,
      description: '',
      price: String(p.price),
      comparePrice: String(p.comparePrice || ''),
      category: p.category,
      subcategory: p.subcategory || 'dry-hair',
      images: imgs[0] || '',
      stock: String(p.stock),
      featured: p.featured,
    })
    setEditProduct(p)
    setShowForm(true)
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(slug)
    await fetch(`/api/products/${slug}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.slug !== slug))
    setDeletingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      category: form.category,
      subcategory: form.subcategory,
      images: JSON.stringify(form.images ? [form.images] : []),
      stock: parseInt(form.stock),
      featured: form.featured,
      ...(editProduct ? {} : { slug: form.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') + '-' + Date.now() }),
    }

    if (editProduct) {
      await fetch(`/api/products/${editProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    setLoading(false)
    setShowForm(false)
    router.refresh()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-cherry-800 text-sm mb-3 transition-colors">
              <ArrowLeft size={14} /> Admin
            </Link>
            <h1 className="font-serif text-4xl font-bold text-gray-900">Products ({products.length})</h1>
          </div>
          <button onClick={openAdd} className="btn-luxury rounded-full flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-dark/50">
                <tr>
                  {['Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(col => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-cream-DEFAULT/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{p.subcategory?.replace(/-/g, ' ')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-cherry-800">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"><Check size={10} /> Yes</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full"><X size={10} /> No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.slug)}
                          disabled={deletingId === p.slug}
                          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'name', label: 'Product Name', type: 'text' },
                  { id: 'description', label: 'Description', type: 'textarea' },
                  { id: 'price', label: 'Price ($)', type: 'number' },
                  { id: 'comparePrice', label: 'Compare Price ($)', type: 'number' },
                  { id: 'images', label: 'Image URL', type: 'text' },
                  { id: 'stock', label: 'Stock', type: 'number' },
                ].map(field => (
                  <div key={field.id}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={(form as any)[field.id]}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        rows={3}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800"
                      />
                    ) : (
                      <input
                        type={field.type}
                        step={field.type === 'number' ? '0.01' : undefined}
                        value={(form as any)[field.id]}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800"
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subcategory</label>
                  <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry-800">
                    {['dry-hair', 'curly-hair', 'masks', 'shampoos', 'conditioners'].map(s => (
                      <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-cherry-800 w-4 h-4" />
                  <label htmlFor="featured" className="text-sm text-gray-700 font-medium">Featured product</label>
                </div>
                <button type="submit" disabled={loading} className="btn-luxury rounded-full w-full py-3.5 disabled:opacity-70">
                  {loading ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
