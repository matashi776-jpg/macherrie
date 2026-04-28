'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AdminProductForm from '@/components/AdminProductForm'
import { formatPrice, getCategoryLabel } from '@/lib/utils'

interface Product {
  id: string; name: string; price: number; category: string; stock: number; featured: boolean; description: string
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (session && (session.user as { role?: string }).role !== 'ADMIN') router.push('/')
  }, [session, status, router])

  async function loadProducts() {
    const data = await fetch('/api/products').then(r => r.json())
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { if (session) loadProducts() }, [session])

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    loadProducts()
  }

  function openEdit(p: Product) { setEditing(p); setShowForm(true) }
  function openAdd() { setEditing(undefined); setShowForm(true) }

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="text-cream animate-pulse">Loading...</div></div>

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-dark pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-cream/60 hover:text-rose-300 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-script text-rose-300 text-3xl mb-1">Admin</div>
              <h1 className="font-playfair text-4xl font-bold text-cream">Products</h1>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-cherry text-white px-5 py-2.5 rounded-full font-medium hover:bg-cherry/80 transition-all">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-charcoal/60 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-charcoal">{p.name}</td>
                    <td className="px-4 py-3 text-charcoal/60">{getCategoryLabel(p.category)}</td>
                    <td className="px-4 py-3 font-semibold text-cherry">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-charcoal/60">{p.stock}</td>
                    <td className="px-4 py-3">{p.featured ? <span className="text-champagne text-xs font-medium">★ Yes</span> : <span className="text-charcoal/30 text-xs">No</span>}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <AdminProductForm
          product={editing}
          onClose={() => { setShowForm(false); setEditing(undefined) }}
          onSaved={() => { setShowForm(false); setEditing(undefined); loadProducts() }}
        />
      )}
    </div>
  )
}
