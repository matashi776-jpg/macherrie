'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getCategoryLabel } from '@/lib/utils'

interface Product {
  id: string; name: string; description: string; price: number; category: string; stock: number; featured: boolean
}

const CATEGORIES = ['ALL', 'BODY_CARE', 'DRY_HAIR', 'CURLY_HAIR', 'MASKS', 'SHAMPOOS', 'SECRET_BOX']

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'ALL')

  useEffect(() => {
    setLoading(true)
    const url = activeCategory !== 'ALL' ? `/api/products?category=${activeCategory}` : '/api/products'
    fetch(url).then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }, [activeCategory])

  return (
    <div>
      <div className="bg-dark pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-script text-cherry text-3xl mb-2">Our Collection</div>
          <h1 className="font-playfair text-5xl font-bold text-cream">All Products</h1>
          <p className="text-cream/60 mt-3">Discover luxury beauty from Africa to Asia</p>
        </div>
      </div>
      <div className="bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-cherry text-white' : 'bg-white text-charcoal border border-gray-200 hover:border-cherry hover:text-cherry'}`}
              >
                {cat === 'ALL' ? 'All Products' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="min-h-screen bg-dark" />}><ProductsContent /></Suspense>
}
