'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { SlidersHorizontal, X } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  category: string
  subcategory: string | null
  images: string
  featured: boolean
  description: string
  stock: number
  createdAt: Date
}

const SUBCATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'dry-hair', label: 'Dry Hair Care' },
  { value: 'curly-hair', label: 'Curly Hair Care' },
  { value: 'masks', label: 'Hair Masks' },
  { value: 'shampoos', label: 'Shampoos' },
  { value: 'conditioners', label: 'Conditioners' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
]

export function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const initialSubcat = searchParams.get('subcategory') || ''

  const [selectedSubcat, setSelectedSubcat] = useState(initialSubcat)
  const [sortBy, setSortBy] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(100)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]
    if (selectedSubcat) result = result.filter(p => p.subcategory === selectedSubcat)
    result = result.filter(p => p.price <= maxPrice)
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [products, selectedSubcat, sortBy, maxPrice])

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24">
      {/* Header */}
      <div className="bg-black py-20 text-center">
        <p className="text-rosegold-DEFAULT text-sm font-medium tracking-[0.3em] uppercase mb-3">Luxury Hair Care</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">Our Collection</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          {filtered.length} products crafted where African heritage meets Asian precision.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar – desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark sticky top-28">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Filters</h3>

              <div className="mb-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                {SUBCATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedSubcat(cat.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${
                      selectedSubcat === cat.value
                        ? 'bg-cherry-800 text-white font-medium'
                        : 'text-gray-700 hover:bg-cream-dark'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Max Price: <span className="text-cherry-800">${maxPrice}</span>
                </p>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cherry-800"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$20</span><span>$100</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Sort & mobile filter toggle */}
            <div className="flex items-center justify-between mb-8 gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-500 hidden sm:inline">{filtered.length} products</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-cherry-800 bg-white"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg">No products match your filters.</p>
                <button onClick={() => { setSelectedSubcat(''); setMaxPrice(100) }} className="mt-4 text-cherry-800 underline text-sm">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
              {SUBCATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedSubcat(cat.value); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${
                    selectedSubcat === cat.value ? 'bg-cherry-800 text-white' : 'text-gray-700 hover:bg-cream-dark'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Max Price: <span className="text-cherry-800">${maxPrice}</span>
              </p>
              <input type="range" min="20" max="100" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-cherry-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
